"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight, Clock, Users2, BarChart3 } from "lucide-react";
import { formatINR, cn } from "@/lib/utils";
import { getSubjectVisual } from "@/lib/subject-visuals";
import { CourseCover } from "./course-cover";
import { FavoriteButton } from "./favorite-button";
import { AddToCartButton } from "./add-to-cart-button";
import type { Course } from "@/types";

export function CourseCard({
  course,
  index = 0,
  onFavoriteChange,
}: {
  course: Course;
  index?: number;
  onFavoriteChange?: (courseId: string, favorited: boolean) => void;
}) {
  const visual = getSubjectVisual(course.subject);
  const SubjectIcon = visual.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.012 }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-sm shadow-black/[0.02] transition-shadow duration-200",
        "hover:shadow-xl hover:shadow-black/[0.08] hover:border-ink/15"
      )}
    >
      <Link href={`/course/${course.slug}`} className="flex h-full flex-col focus:outline-none">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <CourseCover
            subject={course.subject}
            className="absolute inset-0 h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <span
            className={cn(
              "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm",
              visual.bg,
              visual.text
            )}
          >
            <SubjectIcon size={12} strokeWidth={2.5} />
            {course.subject}
          </span>
          <FavoriteButton
            courseId={course.id}
            initialFavorited={course.isFavorited}
            size="sm"
            className="absolute right-3 top-3"
            onChange={(favorited) => onFavoriteChange?.(course.id, favorited)}
          />
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-4">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-ink-soft">
            <span>{course.grade}</span>
            <span aria-hidden>&middot;</span>
            <span className="inline-flex items-center gap-1">
              <BarChart3 size={12} /> {course.level}
            </span>
          </div>

          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink">
            {course.title}
          </h3>

          <div className="flex items-center gap-1.5 text-sm">
            <Star size={14} className="fill-amber text-amber" />
            <span className="font-semibold text-ink">{course.teacherRating.toFixed(1)}</span>
            <span className="text-ink-soft">({course.teacherReviewCount})</span>
          </div>

          <p className="truncate text-sm text-ink-soft">{course.teacherName}</p>

          <div className="flex items-center gap-3 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Users2 size={13} /> {course.mode}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {course.duration}
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
            <span className="text-base font-bold text-ink">{formatINR(course.price)}</span>
            <div className="flex items-center gap-2">
              <AddToCartButton courseId={course.id} initialInCart={course.isInCart} />
              <span className={cn("inline-flex items-center gap-1 text-sm font-bold", visual.text)}>
                View
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-4 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}
