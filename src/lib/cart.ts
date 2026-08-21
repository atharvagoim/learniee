import { randomUUID } from "crypto";
import { db } from "./db";
import type { Course } from "@/types";

interface CartRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  subject: string;
  grade: string;
  price: number;
  teacherName: string;
  teacherRating: number;
  teacherReviewCount: number;
  duration: string;
  lessons: number;
  level: string;
  mode: string;
  language: string;
  image: string;
  createdAt: string;
  addedAt: string;
}

export function addToCart(userId: string, courseId: string) {
  db.prepare(
    `INSERT INTO CartItem (id, userId, courseId) VALUES (?, ?, ?)
     ON CONFLICT(userId, courseId) DO NOTHING`
  ).run(randomUUID(), userId, courseId);
}

export function removeFromCart(userId: string, courseId: string) {
  db.prepare(`DELETE FROM CartItem WHERE userId = ? AND courseId = ?`).run(userId, courseId);
}

export function clearCart(userId: string) {
  db.prepare(`DELETE FROM CartItem WHERE userId = ?`).run(userId);
}

export function cartCount(userId: string): number {
  return (
    db.prepare(`SELECT COUNT(*) as count FROM CartItem WHERE userId = ?`).get(userId) as {
      count: number;
    }
  ).count;
}

export function isInCart(userId: string, courseId: string): boolean {
  const row = db
    .prepare(`SELECT 1 FROM CartItem WHERE userId = ? AND courseId = ? LIMIT 1`)
    .get(userId, courseId);
  return Boolean(row);
}

export function getCartIds(userId: string, courseIds: string[]): Set<string> {
  if (courseIds.length === 0) return new Set();
  const placeholders = courseIds.map(() => "?").join(", ");
  const rows = db
    .prepare(`SELECT courseId FROM CartItem WHERE userId = ? AND courseId IN (${placeholders})`)
    .all(userId, ...courseIds) as { courseId: string }[];
  return new Set(rows.map((r) => r.courseId));
}

/** Cart items joined with their course details, oldest-added first. */
export function listCartItems(userId: string): (Course & { addedAt: string })[] {
  const rows = db
    .prepare(
      `SELECT c.*, ci.createdAt as addedAt
       FROM CartItem ci JOIN Course c ON c.id = ci.courseId
       WHERE ci.userId = ?
       ORDER BY ci.createdAt ASC`
    )
    .all(userId) as unknown as CartRow[];

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description,
    subject: r.subject,
    grade: r.grade,
    price: r.price,
    teacherName: r.teacherName,
    teacherRating: r.teacherRating,
    teacherReviewCount: r.teacherReviewCount,
    duration: r.duration,
    lessons: r.lessons,
    level: r.level,
    mode: r.mode,
    language: r.language,
    image: r.image,
    createdAt: r.createdAt,
    addedAt: r.addedAt,
  }));
}
