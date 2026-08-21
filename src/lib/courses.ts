import { db } from "./db";
import { gradeOrder } from "./constants";
import type { CourseQuery } from "./validations";
import type { Course, CoursesResponse } from "@/types";

interface CourseRow {
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
}

function toCourse(row: CourseRow): Course {
  return { ...row };
}

const SORT_CLAUSES: Record<string, string> = {
  recommended: "teacherRating DESC, teacherReviewCount DESC",
  price_asc: "price ASC",
  price_desc: "price DESC",
  rating_desc: "teacherRating DESC, teacherReviewCount DESC",
  newest: "createdAt DESC",
};

export function queryCourses(query: CourseQuery): CoursesResponse {
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (query.search) {
    where.push("(title LIKE ? OR subject LIKE ? OR teacherName LIKE ?)");
    const like = `%${query.search.toLowerCase()}%`;
    params.push(like, like, like);
  }
  if (query.grade) {
    where.push("grade = ?");
    params.push(query.grade);
  }
  if (query.subject) {
    where.push("subject = ?");
    params.push(query.subject);
  }
  if (query.minPrice !== undefined) {
    where.push("price >= ?");
    params.push(query.minPrice);
  }
  if (query.maxPrice !== undefined) {
    where.push("price <= ?");
    params.push(query.maxPrice);
  }
  if (query.minRating !== undefined) {
    where.push("teacherRating >= ?");
    params.push(query.minRating);
  }

  const whereClause = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const total = (
    db.prepare(`SELECT COUNT(*) as count FROM Course ${whereClause}`).get(...params) as {
      count: number;
    }
  ).count;

  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const page = Math.min(query.page, totalPages);
  const offset = (page - 1) * query.pageSize;

  const orderClause = SORT_CLAUSES[query.sort] ?? SORT_CLAUSES.recommended;

  const rows = db
    .prepare(
      `SELECT * FROM Course ${whereClause} ORDER BY ${orderClause} LIMIT ? OFFSET ?`
    )
    .all(...params, query.pageSize, offset) as unknown as CourseRow[];

  return {
    courses: rows.map(toCourse),
    pagination: { page, pageSize: query.pageSize, total, totalPages },
  };
}

export function getCourseBySlug(slug: string): Course | null {
  const row = db.prepare(`SELECT * FROM Course WHERE slug = ?`).get(slug) as
    | CourseRow
    | undefined;
  return row ? toCourse(row) : null;
}

export function getCourseById(id: string): Course | null {
  const row = db.prepare(`SELECT * FROM Course WHERE id = ?`).get(id) as CourseRow | undefined;
  return row ? toCourse(row) : null;
}

export function getCoursesByIds(ids: string[]): Course[] {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => "?").join(", ");
  const rows = db
    .prepare(`SELECT * FROM Course WHERE id IN (${placeholders})`)
    .all(...ids) as unknown as CourseRow[];
  // Preserve the order the ids were given in (most-recently-favorited first, etc.)
  const byId = new Map(rows.map((r) => [r.id, toCourse(r)]));
  return ids.map((id) => byId.get(id)).filter((c): c is Course => Boolean(c));
}

/**
 * A lightweight "recommended for you" query: highly-rated courses,
 * optionally biased toward the given subjects (e.g. subjects the parent
 * has already favorited), excluding courses already favorited.
 */
export function getRecommendedCourses(options: {
  subjects?: string[];
  excludeIds?: string[];
  limit?: number;
}): Course[] {
  const { subjects = [], excludeIds = [], limit = 8 } = options;
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (subjects.length > 0) {
    where.push(`subject IN (${subjects.map(() => "?").join(", ")})`);
    params.push(...subjects);
  }
  if (excludeIds.length > 0) {
    where.push(`id NOT IN (${excludeIds.map(() => "?").join(", ")})`);
    params.push(...excludeIds);
  }
  where.push("teacherRating >= 4.5");

  const whereClause = `WHERE ${where.join(" AND ")}`;
  const rows = db
    .prepare(
      `SELECT * FROM Course ${whereClause} ORDER BY teacherRating DESC, teacherReviewCount DESC LIMIT ?`
    )
    .all(...params, limit) as unknown as CourseRow[];

  if (rows.length < limit && subjects.length > 0) {
    // Not enough matches within the preferred subjects -- top up with
    // general top-rated courses instead of showing a sparse row.
    const have = new Set(rows.map((r) => r.id));
    const fillExclude = [...excludeIds, ...have];
    const fillWhere = fillExclude.length
      ? `WHERE id NOT IN (${fillExclude.map(() => "?").join(", ")}) AND teacherRating >= 4.5`
      : "WHERE teacherRating >= 4.5";
    const fillRows = db
      .prepare(
        `SELECT * FROM Course ${fillWhere} ORDER BY teacherRating DESC, teacherReviewCount DESC LIMIT ?`
      )
      .all(...fillExclude, limit - rows.length) as unknown as CourseRow[];
    rows.push(...fillRows);
  }

  return rows.map(toCourse);
}

export function courseCount() {
  return (db.prepare(`SELECT COUNT(*) as count FROM Course`).get() as { count: number }).count;
}

export { gradeOrder };
