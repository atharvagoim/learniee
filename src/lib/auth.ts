import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { db } from "./db";

export const SESSION_COOKIE = "learniee_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createUser(name: string, email: string, passwordHash: string): PublicUser {
  const id = randomUUID();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO User (id, name, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(id, name, email.toLowerCase(), passwordHash, now, now);
  return { id, name, email: email.toLowerCase(), createdAt: now };
}

export function findUserByEmail(email: string) {
  return db
    .prepare(`SELECT * FROM User WHERE email = ?`)
    .get(email.toLowerCase()) as
    | { id: string; name: string; email: string; passwordHash: string; createdAt: string }
    | undefined;
}

export function findUserById(id: string) {
  return db.prepare(`SELECT * FROM User WHERE id = ?`).get(id) as
    | { id: string; name: string; email: string; passwordHash: string; createdAt: string }
    | undefined;
}

export function updateUserName(id: string, name: string): PublicUser | null {
  const now = new Date().toISOString();
  db.prepare(`UPDATE User SET name = ?, updatedAt = ? WHERE id = ?`).run(name, now, id);
  const user = findUserById(id);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export function createSession(userId: string) {
  const id = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();
  db.prepare(`INSERT INTO Session (id, userId, expiresAt) VALUES (?, ?, ?)`).run(
    id,
    userId,
    expiresAt
  );
  return { id, expiresAt };
}

export function getSession(sessionId: string) {
  const session = db.prepare(`SELECT * FROM Session WHERE id = ?`).get(sessionId) as
    | { id: string; userId: string; expiresAt: string }
    | undefined;
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    db.prepare(`DELETE FROM Session WHERE id = ?`).run(sessionId);
    return null;
  }
  return session;
}

export function deleteSession(sessionId: string) {
  db.prepare(`DELETE FROM Session WHERE id = ?`).run(sessionId);
}

export async function setSessionCookie(sessionId: string, expiresAt: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  const session = getSession(sessionId);
  if (!session) return null;
  const user = findUserById(session.userId);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}
