import { randomUUID } from "crypto";
import { db } from "./db";

export function addFavorite(userId: string, courseId: string) {
  db.prepare(
    `INSERT INTO Favorite (id, userId, courseId) VALUES (?, ?, ?)
     ON CONFLICT(userId, courseId) DO NOTHING`
  ).run(randomUUID(), userId, courseId);
}

export function removeFavorite(userId: string, courseId: string) {
  db.prepare(`DELETE FROM Favorite WHERE userId = ? AND courseId = ?`).run(userId, courseId);
}

export function isFavorited(userId: string, courseId: string): boolean {
  const row = db
    .prepare(`SELECT 1 FROM Favorite WHERE userId = ? AND courseId = ? LIMIT 1`)
    .get(userId, courseId);
  return Boolean(row);
}

/** Returns the set of courseIds (from the given list) the user has favorited. */
export function getFavoritedIds(userId: string, courseIds: string[]): Set<string> {
  if (courseIds.length === 0) return new Set();
  const placeholders = courseIds.map(() => "?").join(", ");
  const rows = db
    .prepare(`SELECT courseId FROM Favorite WHERE userId = ? AND courseId IN (${placeholders})`)
    .all(userId, ...courseIds) as { courseId: string }[];
  return new Set(rows.map((r) => r.courseId));
}

/** All favorited course IDs for a user, most-recently-favorited first. */
export function listFavoriteCourseIds(userId: string): string[] {
  const rows = db
    .prepare(`SELECT courseId FROM Favorite WHERE userId = ? ORDER BY createdAt DESC`)
    .all(userId) as { courseId: string }[];
  return rows.map((r) => r.courseId);
}

export function favoriteCount(userId: string): number {
  return (
    db.prepare(`SELECT COUNT(*) as count FROM Favorite WHERE userId = ?`).get(userId) as {
      count: number;
    }
  ).count;
}

/** Distinct subjects the user has favorited courses in, most-favorited first. */
export function getFavoritedSubjects(userId: string): string[] {
  const rows = db
    .prepare(
      `SELECT c.subject as subject, COUNT(*) as count
       FROM Favorite f JOIN Course c ON c.id = f.courseId
       WHERE f.userId = ?
       GROUP BY c.subject
       ORDER BY count DESC`
    )
    .all(userId) as { subject: string; count: number }[];
  return rows.map((r) => r.subject);
}
