"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, Sparkles, BookOpen, Users, GraduationCap } from "lucide-react";
import { SearchBar } from "@/components/course/search-bar";
import { FilterDropdown } from "@/components/course/filter-dropdown";
import { ActiveFilterChips, type ActiveFilter } from "@/components/course/active-filter-chips";
import { CourseCard, CourseCardSkeleton } from "@/components/course/course-card";
import { EmptyState } from "@/components/course/empty-state";
import { Pagination } from "@/components/course/pagination";
import { AnimatedCount } from "@/components/course/animated-count";
import { MobileFilterDrawer, type FilterState } from "@/components/course/mobile-filter-drawer";
import { WaveDivider } from "@/components/layout/wave-divider";
import { DoodleSparkle, DoodleDotGrid } from "@/components/layout/doodles";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/components/ui/toast";
import { getSubjectVisual } from "@/lib/subject-visuals";
import { cn } from "@/lib/utils";
import {
  GRADES,
  SUBJECTS,
  PRICE_RANGES,
  RATING_FILTERS,
  SORT_LABELS,
  POPULAR_SUBJECTS,
} from "@/lib/constants";
import type { Course, PaginationMeta } from "@/types";

const SORT_OPTIONS = Object.entries(SORT_LABELS).map(([value, label]) => ({ value, label }));

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function DashboardClient({
  parentName,
  recommendedCourses = [],
  personalized = false,
}: {
  parentName: string;
  recommendedCourses?: Course[];
  personalized?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [filters, setFilters] = useState<FilterState>({
    grade: searchParams.get("grade") ?? "",
    subject: searchParams.get("subject") ?? "",
    price: searchParams.get("price") ?? "",
    rating: searchParams.get("rating") ?? "",
  });
  const [sort, setSort] = useState(searchParams.get("sort") ?? "recommended");
  const [page, setPage] = useState(Number(searchParams.get("page") ?? 1));

  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  function handleSearchChange(v: string) {
    setSearch(v);
    setPage(1);
  }
  function handleFiltersChange(next: FilterState) {
    setFilters(next);
    setPage(1);
  }
  function handleSortChange(v: string) {
    setSort(v);
    setPage(1);
  }

  const priceRange = useMemo(
    () => PRICE_RANGES.find((p) => p.value === filters.price),
    [filters.price]
  );
  const ratingFilter = useMemo(
    () => RATING_FILTERS.find((r) => r.value === filters.rating),
    [filters.rating]
  );

  // Sync URL. Uses the native History API (Next's documented "shallow
  // routing" pattern -- see nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#using-the-native-history-api)
  // instead of next/navigation's router.replace(). This matters here
  // because /dashboard is a fully dynamic route (it checks the session
  // cookie on every request), so router.replace() would force a real
  // server round-trip on every keystroke/filter change -- which is
  // exactly what caused the "keeps refreshing" bug. history.replaceState
  // only updates the address bar; it never talks to the server.
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.grade) params.set("grade", filters.grade);
    if (filters.subject) params.set("subject", filters.subject);
    if (filters.price) params.set("price", filters.price);
    if (filters.rating) params.set("rating", filters.rating);
    if (sort !== "recommended") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));

    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    window.history.replaceState(window.history.state, "", url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters, sort, page]);

  // Fetch courses. This is the canonical data-fetching-in-effect pattern
  // (see react.dev/learn/synchronizing-with-effects#fetching-data): the
  // effect synchronizes local state with an external system (the API),
  // so the loading/error resets are intentional, not accidental renders.
  useEffect(() => {
    const controller = new AbortController();
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoading(true);
    setError("");
    /* eslint-enable react-hooks/set-state-in-effect */

    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.grade) params.set("grade", filters.grade);
    if (filters.subject) params.set("subject", filters.subject);
    if (priceRange?.min !== undefined) params.set("minPrice", String(priceRange.min));
    if (priceRange?.max !== undefined) params.set("maxPrice", String(priceRange.max));
    if (ratingFilter?.min !== undefined) params.set("minRating", String(ratingFilter.min));
    params.set("sort", sort);
    params.set("page", String(page));
    params.set("pageSize", "12");

    fetch(`/api/courses?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load courses.");
        setCourses(data.courses);
        setPagination(data.pagination);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Unable to load courses right now. Please try again.");
        showToast("Unable to load courses", "error");
      })
      .finally(() => {
        setLoading(false);
        setInitial(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.grade, filters.subject, priceRange, ratingFilter, sort, page]);

  const resetAll = useCallback(() => {
    setSearch("");
    setFilters({ grade: "", subject: "", price: "", rating: "" });
    setSort("recommended");
    setPage(1);
  }, []);

  const activeFilters: ActiveFilter[] = [];
  if (filters.grade)
    activeFilters.push({ key: "grade", label: filters.grade, onRemove: () => handleFiltersChange({ ...filters, grade: "" }) });
  if (filters.subject)
    activeFilters.push({ key: "subject", label: filters.subject, onRemove: () => handleFiltersChange({ ...filters, subject: "" }) });
  if (priceRange && priceRange.value)
    activeFilters.push({ key: "price", label: priceRange.label, onRemove: () => handleFiltersChange({ ...filters, price: "" }) });
  if (ratingFilter && ratingFilter.value)
    activeFilters.push({ key: "rating", label: ratingFilter.label, onRemove: () => handleFiltersChange({ ...filters, rating: "" }) });
  if (debouncedSearch)
    activeFilters.push({ key: "search", label: `"${debouncedSearch}"`, onRemove: () => handleSearchChange("") });

  const activeCount = activeFilters.length;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } },
  };
  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex-1">
      {/* Hero */}
      <section className="relative min-h-[640px] overflow-hidden bg-hero sm:min-h-[560px] lg:min-h-[620px]">
        {/* Full-bleed background image(s), swapped by breakpoint */}
        <div aria-hidden className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-illustration-desktop.png"
            alt=""
            className="hidden h-full w-full object-cover object-center lg:block"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-illustration-mobile.png"
            alt=""
            className="block h-full w-full object-cover object-center lg:hidden"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          {/* Readability overlay: strong behind the text, fading toward the art */}
          <div className="absolute inset-0 bg-gradient-to-r from-hero via-hero/75 to-hero/10 lg:to-hero/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-hero/70 via-transparent to-hero/40 lg:hidden" />
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <DoodleDotGrid className="absolute right-[8%] top-10 hidden h-16 w-20 text-white/20 sm:block" rows={4} cols={5} />
          <DoodleSparkle className="animate-float-slow absolute right-[10%] top-12 h-6 w-6 text-white/80 sm:right-[14%]" />
        </div>

        <div className="relative flex min-h-[640px] w-full flex-col justify-start px-4 pb-10 pt-6 sm:min-h-[560px] sm:justify-center sm:px-6 sm:py-14 lg:min-h-[620px] lg:px-10">
          <motion.p variants={item} className="text-sm font-semibold text-white/75">
            {greeting()}, {parentName}! 👋
          </motion.p>
          <motion.h1 variants={item} className="mt-2 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Find something your child will love learning today.
          </motion.h1>

          <motion.div variants={item} className="mt-8 max-w-lg">
            <SearchBar value={search} onChange={handleSearchChange} isSearching={loading && !initial} />
          </motion.div>

          <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold text-white">
            <StatBadge icon={BookOpen}>
              <AnimatedCount value={pagination.total || 450} />+ courses
            </StatBadge>
            <StatBadge icon={Users}>60+ teachers</StatBadge>
            <StatBadge icon={GraduationCap}>13 grade levels</StatBadge>
          </motion.div>
        </div>

        <WaveDivider color="var(--color-bg)" />
      </section>

      {/* Popular subjects */}
      <section className="relative w-full px-4 pb-4 pt-8 sm:px-6 sm:pt-10 lg:px-10">
        <motion.div variants={item} className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
            Popular subjects
          </h2>
          {filters.subject && (
            <button
              onClick={() => handleFiltersChange({ ...filters, subject: "" })}
              className="text-xs font-bold text-accent hover:underline"
            >
              Clear selection
            </button>
          )}
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-8">
          {POPULAR_SUBJECTS.map((s) => {
            const visual = getSubjectVisual(s);
            const Icon = visual.icon;
            const active = filters.subject === s;
            return (
              <motion.button
                key={s}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleFiltersChange({ ...filters, subject: active ? "" : s })}
                className={cn(
                  "group relative flex h-32 items-center overflow-hidden rounded-2xl border-2 px-6 text-left shadow-sm transition-shadow duration-200 sm:h-36 lg:h-24 lg:px-4",
                  active ? "border-transparent shadow-lg" : "border-white/60 hover:shadow-md",
                  visual.cardGradient
                )}
              >
                {/* decorative dot grid */}
                <DoodleDotGrid
                  className={cn("pointer-events-none absolute right-5 top-4 h-10 w-14 opacity-30 lg:right-3 lg:h-7 lg:w-9", visual.text)}
                  rows={3}
                  cols={5}
                />
                {/* large watermark icon as the card's visual flourish */}
                <Icon
                  className={cn(
                    "pointer-events-none absolute -right-4 -bottom-6 h-28 w-28 opacity-[0.16] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 sm:h-32 sm:w-32 lg:-right-3 lg:-bottom-3 lg:h-16 lg:w-16",
                    visual.text
                  )}
                  strokeWidth={1.4}
                />
                {/* bottom wave accent */}
                <svg
                  aria-hidden
                  viewBox="0 0 300 40"
                  preserveAspectRatio="none"
                  className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-6 w-full opacity-25", visual.text)}
                >
                  <path d="M0,20 C60,0 120,36 180,18 C220,6 260,26 300,14 L300,40 L0,40 Z" fill="currentColor" />
                </svg>

                <div className="relative z-10 flex flex-col items-start gap-3 lg:gap-2">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm lg:h-9 lg:w-9">
                    <Icon size={22} strokeWidth={2.2} className={cn("lg:hidden", visual.text)} />
                    <Icon size={16} strokeWidth={2.4} className={cn("hidden lg:block", visual.text)} />
                  </span>
                  <span className={cn("text-lg font-extrabold leading-tight lg:text-sm", visual.text)}>{s}</span>
                </div>

                {active && (
                  <span className={cn("absolute right-4 top-4 z-10 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold shadow-sm lg:hidden", visual.text)}>
                    Selected
                  </span>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </section>

      {/* Recommended for you */}
      {recommendedCourses.length > 0 && (
        <section className="w-full px-4 pb-4 pt-6 sm:px-6 lg:px-10">
          <motion.div variants={item} className="mb-5 flex items-center gap-2">
            <Sparkles size={18} className="text-violet-500" />
            <h2 className="text-lg font-extrabold tracking-tight text-ink sm:text-xl">
              {personalized ? "Recommended for you" : "Popular with other parents"}
            </h2>
          </motion.div>

          <motion.div
            variants={item}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 no-scrollbar"
          >
            {recommendedCourses.map((course, i) => (
              <div key={course.id} className="w-[78vw] shrink-0 snap-start sm:w-64 lg:w-72">
                <CourseCard course={course} index={i} />
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Results */}
      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <motion.div variants={item} className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">
            Explore courses{" "}
            <span className="ml-1 font-normal text-ink-soft">
              (<AnimatedCount value={pagination.total} /> course{pagination.total === 1 ? "" : "s"})
            </span>
          </h2>

          <div className="hidden items-center gap-2 sm:flex">
            <FilterDropdown
              label="All Grades"
              value={filters.grade}
              onChange={(v) => handleFiltersChange({ ...filters, grade: v })}
              options={[{ value: "", label: "All Grades" }, ...GRADES.map((g) => ({ value: g, label: g }))]}
            />
            <FilterDropdown
              label="All Subjects"
              value={filters.subject}
              onChange={(v) => handleFiltersChange({ ...filters, subject: v })}
              options={[{ value: "", label: "All Subjects" }, ...SUBJECTS.map((s) => ({ value: s, label: s }))]}
            />
            <FilterDropdown
              label="Any Price"
              value={filters.price}
              onChange={(v) => handleFiltersChange({ ...filters, price: v })}
              options={PRICE_RANGES.map((p) => ({ value: p.value, label: p.label }))}
            />
            <FilterDropdown
              label="Any Rating"
              value={filters.rating}
              onChange={(v) => handleFiltersChange({ ...filters, rating: v })}
              options={RATING_FILTERS.map((r) => ({ value: r.value, label: r.label }))}
            />
            <div className="h-6 w-px bg-border" />
            <FilterDropdown
              label={SORT_LABELS.recommended}
              value={sort}
              onChange={handleSortChange}
              options={SORT_OPTIONS}
            />
          </div>

          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-ink sm:hidden"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeCount > 0 && (
              <span className="flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-ink">
                {activeCount}
              </span>
            )}
          </button>
        </motion.div>

        <motion.div variants={item} className="mb-6">
          <ActiveFilterChips filters={activeFilters} onClearAll={resetAll} />
        </motion.div>

        {error && (
          <div role="alert" className="mb-6 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <motion.div variants={item}>
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState onClearFilters={resetAll} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${page}-${sort}-${debouncedSearch}-${filters.grade}-${filters.subject}-${filters.price}-${filters.rating}`}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
              >
                {courses.map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {!loading && courses.length > 0 && (
          <motion.div variants={item} className="mt-10">
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </motion.div>
        )}
      </section>

      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={handleFiltersChange}
        onReset={resetAll}
        activeCount={activeCount}
      />
    </motion.div>
  );
}

function StatBadge({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-3.5 backdrop-blur-sm">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
        <Icon size={13} strokeWidth={2.5} className="text-white" />
      </span>
      {children}
    </span>
  );
}
