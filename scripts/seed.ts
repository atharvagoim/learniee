import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db, initSchema } from "../src/lib/db";
import { GRADES, gradeOrder, LEVELS, MODES, LANGUAGES, DURATIONS, PRICE_POINTS, RATING_POINTS } from "../src/lib/constants";
import { SUBJECT_CONFIG } from "./subject-config";
import { TEACHERS } from "./teachers";
import { createRng, pick, intBetween } from "./rng";
import { slugify } from "../src/lib/utils";

const rng = createRng(20260817);

function describeCourse(subject: string, grade: string, level: string, mode: string) {
  const openers = [
    `A ${level.toLowerCase()}-friendly ${subject.toLowerCase()} course designed for ${grade.toLowerCase()} students who love to learn by doing.`,
    `Build real confidence in ${subject.toLowerCase()} through guided practice, live discussion, and plenty of encouragement.`,
    `This ${mode.toLowerCase()} course breaks ${subject.toLowerCase()} down into clear, engaging steps suited for ${grade.toLowerCase()}.`,
    `Designed with parents and young learners in mind, this course makes ${subject.toLowerCase()} approachable and genuinely fun.`,
  ];
  const closers = [
    "Every lesson combines short concept videos, interactive practice, and friendly feedback.",
    "Small weekly projects help learners apply what they study right away.",
    "Includes regular progress check-ins so parents can track growth with confidence.",
    "Sessions are paced thoughtfully, with plenty of room for questions.",
  ];
  return `${pick(rng, openers)} ${pick(rng, closers)}`;
}

function main() {
  initSchema();

  const ifEmpty = process.argv.includes("--if-empty");
  if (ifEmpty) {
    const existing = (db.prepare(`SELECT COUNT(*) as count FROM Course`).get() as { count: number })
      .count;
    if (existing > 0) {
      console.log(`Database already has ${existing} courses -- skipping seed (--if-empty).`);
      return;
    }
  }

  console.log("Clearing existing development data...");
  db.exec("DELETE FROM Course; DELETE FROM Session; DELETE FROM User;");

  console.log("Creating demo parent account...");
  const demoId = randomUUID();
  const demoHash = bcrypt.hashSync("Demo@12345", 10);
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO User (id, name, email, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`
  ).run(demoId, "Atharva Goim", "demo@learniee.com", demoHash, now, now);

  console.log("Generating course catalog...");
  const insert = db.prepare(`
    INSERT INTO Course (
      id, title, slug, description, subject, grade, gradeOrder, price,
      teacherName, teacherRating, teacherReviewCount, duration, lessons,
      level, mode, language, image, createdAt, updatedAt
    ) VALUES (
      @id, @title, @slug, @description, @subject, @grade, @gradeOrder, @price,
      @teacherName, @teacherRating, @teacherReviewCount, @duration, @lessons,
      @level, @mode, @language, @image, @createdAt, @updatedAt
    )
  `);

  const usedSlugs = new Set<string>();
  let created = 0;
  function insertMany(rows: Record<string, unknown>[]) {
    db.exec("BEGIN");
    try {
      for (const row of rows) insert.run(row as Record<string, string | number>);
      db.exec("COMMIT");
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }

  const rows: Record<string, unknown>[] = [];
  // Stagger createdAt so "Newest" sort is meaningful (older index -> older date)
  let sequence = 0;
  const totalPlanned = SUBJECT_CONFIG.reduce((sum, c) => sum + c.count, 0);

  for (const config of SUBJECT_CONFIG) {
    const eligibleTeachers = TEACHERS.filter((t) => t.subjects.includes(config.subject));
    const teacherPool = eligibleTeachers.length ? eligibleTeachers : TEACHERS;

    for (let i = 0; i < config.count; i++) {
      const gradeIdx = intBetween(rng, config.minGrade, config.maxGrade);
      const grade = GRADES[gradeIdx];
      const template = pick(rng, config.templates);
      const title = template.replace("{grade}", grade);

      let slug = slugify(`${title}-${config.subject}`);
      if (usedSlugs.has(slug)) slug = `${slug}-${i}`;
      let uniq = 1;
      while (usedSlugs.has(slug)) {
        slug = `${slugify(`${title}-${config.subject}`)}-${i}-${uniq}`;
        uniq++;
      }
      usedSlugs.add(slug);

      const teacher = pick(rng, teacherPool);
      const level = pick(rng, LEVELS);
      const mode = pick(rng, MODES);
      const language = pick(rng, LANGUAGES);
      const duration = pick(rng, DURATIONS);
      const price = pick(rng, PRICE_POINTS);
      const teacherRating = pick(rng, RATING_POINTS);
      const teacherReviewCount = intBetween(rng, 12, 420);

      // Older sequence -> older createdAt, so "Newest" sort is meaningful.
      const daysAgo = totalPlanned - sequence;
      const createdAt = new Date(Date.now() - daysAgo * 6 * 60 * 60 * 1000).toISOString();
      sequence++;

      rows.push({
        id: randomUUID(),
        title,
        slug,
        description: describeCourse(config.subject, grade, level, mode),
        subject: config.subject,
        grade,
        gradeOrder: gradeOrder(grade),
        price,
        teacherName: teacher.name,
        teacherRating,
        teacherReviewCount,
        duration: duration.label,
        lessons: duration.lessons + intBetween(rng, -2, 4),
        level,
        mode,
        language,
        // Course covers are rendered as subject-themed illustrations (see
        // src/components/course/course-cover.tsx) rather than stock photos,
        // since a random photo API has no way to match a course's actual
        // subject. This field is kept for schema completeness / API shape.
        image: "",
        createdAt,
        updatedAt: createdAt,
      });
      created++;
    }
  }

  insertMany(rows);

  console.log(`Seed complete: ${created} courses, ${TEACHERS.length} teachers, 1 demo parent.`);
}

main();
