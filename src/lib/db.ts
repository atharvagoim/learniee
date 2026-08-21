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

declare global {
  var __learnieeDb: DatabaseSync | undefined;
}

function createConnection() {
  try {
    const dir = path.dirname(DB_PATH);
    // Only attempt to create the directory if it doesn't already exist.
    // On some platforms (Render's mounted disks in particular), the mount
    // root already exists but the app's process isn't permitted to run
    // mkdir against it directly -- even though reading/writing files
    // inside it works fine. Skipping the redundant mkdir avoids that
    // EACCES entirely instead of trying to fall back gracefully from it.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const database = new DatabaseSync(DB_PATH);
    database.exec("PRAGMA journal_mode = DELETE;");
    database.exec("PRAGMA foreign_keys = ON;");
    return database;
  } catch (err) {
    // Some hosting platforms (Render, Railway, etc.) only attach a
    // persistent disk to the *running* service -- not to the build step.
    // Next.js's "collect page data" build phase imports every route module
    // to statically analyze it, which runs this file's top-level `db`
    // export even though no query actually executes yet. If the disk isn't
    // mounted at build time, LEARNIEE_DB_PATH's directory won't exist and
    // mkdir/open will throw, crashing the build entirely. Fall back to an
    // in-memory database in that case so module evaluation always
    // succeeds; the real persistent path is used normally once the app is
    // actually running with its disk mounted (which is what matters).
    console.warn(
      `[learniee] Could not open database at "${DB_PATH}" (falling back to an in-memory database for this process). ` +
        "This is expected during some build steps where a persistent disk isn't mounted yet; " +
        "if you see this while the app is actually running, check that LEARNIEE_DB_PATH points at a writable, mounted directory.",
      err
    );
    const database = new DatabaseSync(":memory:");
    database.exec("PRAGMA foreign_keys = ON;");
    return database;
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
