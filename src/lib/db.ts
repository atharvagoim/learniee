import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";

// Learniee data layer
//
// NOTE ON TECH CHOICE: The assignment spec calls for Prisma ORM. This
// build environment's sandbox blocks network access to Prisma's engine
// binary host (binaries.prisma.sh), which means `prisma generate` cannot
// complete here and the app would fail to build/run. To keep the
// deliverable fully working, tested, and buildable, this project uses
// Node's built-in `node:sqlite` module (still real SQLite, still a typed,
// indexed, server-side data layer, and with zero native compilation step
// -- it ships with Node itself) behind a small repository-style API in
// `lib/db.ts`, `lib/auth.ts`, and `lib/courses.ts`.
// See README "Assumptions" for details and for how to swap to Prisma.
//
// Requires Node.js 22.5+ (built in, no extra install). `node:sqlite` is
// still marked experimental by Node and prints a one-line warning on
// startup -- that's expected and harmless.
//
// NOTE ON FILE LOCATION + JOURNAL MODE: the database intentionally lives
// in a dot-prefixed `.data/` folder (instead of `prisma/`) and uses
// SQLite's default rollback journal instead of WAL mode. Both choices
// exist to avoid a real bug we hit in `next dev`: WAL mode touches a
// `-wal`/`-shm` file on almost every read (not just writes), and if that
// file sits inside a directory the dev server watches for source changes,
// every single API request ends up triggering a Fast Refresh reload --
// which re-fetches courses, which touches the file again, forever. The
// dot-prefixed folder and non-WAL journal mode together eliminate that
// loop. Override the location with LEARNIEE_DB_PATH if you need to.

const DB_PATH = process.env.LEARNIEE_DB_PATH ?? path.join(process.cwd(), ".data", "dev.db");

// If the configured path can't be used, fall back to a file inside the
// app's own working directory rather than an in-memory database. This
// matters a lot here: `start:prod` runs the seed script and the actual web
// server as two *separate* Node processes. An in-memory database is
// private to a single process, so if seeding fell back to `:memory:`, the
// data it wrote would vanish the instant that process exited -- the web
// server's own (also in-memory) database would come up empty every time,
// which looks exactly like "seeding doesn't work" even though it ran
// successfully. A real file on disk, even a non-persistent one inside the
// container's ephemeral filesystem, is at least shared by every process in
// that same running instance, so the app actually works correctly for the
// lifetime of that instance -- it just won't survive a redeploy until
// LEARNIEE_DB_PATH points at somewhere genuinely writable.
const FALLBACK_DB_PATH = path.join(process.cwd(), ".data-fallback", "dev.db");

declare global {
  var __learnieeDb: DatabaseSync | undefined;
}

function tryOpen(dbPath: string): DatabaseSync {
  const dir = path.dirname(dbPath);
  // Only attempt to create the directory if it doesn't already exist. On
  // some platforms (Render's mounted disks in particular), the mount root
  // already exists but the app's process isn't permitted to run mkdir
  // against it directly -- even though reading/writing files inside it
  // works fine. Skipping the redundant mkdir avoids that EACCES entirely.
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const database = new DatabaseSync(dbPath);
  database.exec("PRAGMA journal_mode = DELETE;");
  database.exec("PRAGMA foreign_keys = ON;");
  return database;
}

function createConnection(): DatabaseSync {
  try {
    const database = tryOpen(DB_PATH);
    console.log(`[learniee] Database ready at "${DB_PATH}".`);
    return database;
  } catch (primaryErr) {
    console.warn(
      `[learniee] Could not open database at "${DB_PATH}" -- falling back to "${FALLBACK_DB_PATH}". ` +
        "Data will work correctly for this running instance, but won't survive a redeploy until " +
        "LEARNIEE_DB_PATH points at somewhere genuinely writable (check your platform's persistent " +
        "disk/volume configuration and permissions).",
      primaryErr
    );
    try {
      return tryOpen(FALLBACK_DB_PATH);
    } catch (fallbackErr) {
      // Last resort: this should be extremely rare (it means even the
      // app's own working directory isn't writable), but still don't crash.
      console.error(
        `[learniee] Could not open fallback database at "${FALLBACK_DB_PATH}" either -- using an ` +
          "in-memory database. Nothing will persist, and separate processes (e.g. the seed script " +
          "and the web server) will not share data.",
        fallbackErr
      );
      const database = new DatabaseSync(":memory:");
      database.exec("PRAGMA foreign_keys = ON;");
      return database;
    }
  }
}

export const db = global.__learnieeDb ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  global.__learnieeDb = db;
}

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Session (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      expiresAt TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Course (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      subject TEXT NOT NULL,
      grade TEXT NOT NULL,
      gradeOrder INTEGER NOT NULL,
      price INTEGER NOT NULL,
      teacherName TEXT NOT NULL,
      teacherRating REAL NOT NULL,
      teacherReviewCount INTEGER NOT NULL,
      duration TEXT NOT NULL,
      lessons INTEGER NOT NULL,
      level TEXT NOT NULL,
      mode TEXT NOT NULL,
      language TEXT NOT NULL,
      image TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS Favorite (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      courseId TEXT NOT NULL REFERENCES Course(id) ON DELETE CASCADE,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(userId, courseId)
    );

    CREATE TABLE IF NOT EXISTS CartItem (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      courseId TEXT NOT NULL REFERENCES Course(id) ON DELETE CASCADE,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(userId, courseId)
    );

    CREATE TABLE IF NOT EXISTS "Order" (
      id TEXT PRIMARY KEY,
      orderNumber TEXT NOT NULL UNIQUE,
      userId TEXT NOT NULL REFERENCES User(id) ON DELETE CASCADE,
      childName TEXT,
      paymentMethod TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      discount INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      promoCode TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS OrderItem (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
      courseId TEXT NOT NULL REFERENCES Course(id) ON DELETE SET NULL,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      price INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_session_userId ON Session(userId);
    CREATE INDEX IF NOT EXISTS idx_session_expiresAt ON Session(expiresAt);
    CREATE INDEX IF NOT EXISTS idx_course_subject ON Course(subject);
    CREATE INDEX IF NOT EXISTS idx_course_grade ON Course(gradeOrder);
    CREATE INDEX IF NOT EXISTS idx_course_price ON Course(price);
    CREATE INDEX IF NOT EXISTS idx_course_rating ON Course(teacherRating);
    CREATE INDEX IF NOT EXISTS idx_course_title ON Course(title);
    CREATE INDEX IF NOT EXISTS idx_course_teacher ON Course(teacherName);
    CREATE INDEX IF NOT EXISTS idx_course_createdAt ON Course(createdAt);
    CREATE INDEX IF NOT EXISTS idx_favorite_userId ON Favorite(userId);
    CREATE INDEX IF NOT EXISTS idx_favorite_courseId ON Favorite(courseId);
    CREATE INDEX IF NOT EXISTS idx_cartitem_userId ON CartItem(userId);
    CREATE INDEX IF NOT EXISTS idx_order_userId ON "Order"(userId);
    CREATE INDEX IF NOT EXISTS idx_orderitem_orderId ON OrderItem(orderId);
  `);
}

initSchema();
