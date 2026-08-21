"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import { CourseCard, CourseCardSkeleton } from "@/components/course/course-card";
import type { Course } from "@/types";

export function FavoritesClient() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/favorites")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load favorites.");
        setCourses(data.courses);
      })
      .catch(() => setError("Unable to load your favorites right now. Please try again."));
  }, []);

  function handleFavoriteChange(courseId: string, favorited: boolean) {
    if (favorited) return; // shouldn't happen on this page, but no-op just in case
    setCourses((prev) => (prev ? prev.filter((c) => c.id !== courseId) : prev));
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-500">
          <Heart size={20} className="fill-rose-500" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Your favorites</h1>
          <p className="text-sm text-ink-soft">Courses you&apos;ve saved to consider later.</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {courses === null && !error ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses && courses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface/60 px-6 py-20 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-300">
            <Heart size={28} />
          </span>
          <h3 className="text-lg font-semibold text-ink">No favorites yet</h3>
          <p className="max-w-sm text-sm text-ink-soft">
            Tap the heart icon on any course to save it here for later.
          </p>
          <Link
            href="/dashboard"
            className="mt-2 inline-flex h-9 items-center justify-center rounded-lg border-2 border-border bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-black/[0.02]"
          >
            Browse courses
          </Link>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {courses?.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} onFavoriteChange={handleFavoriteChange} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
