import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getCourseBySlug } from "@/lib/courses";
import { isFavorited } from "@/lib/favorites";
import { isInCart } from "@/lib/cart";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CourseCover } from "@/components/course/course-cover";
import { FavoriteButton } from "@/components/course/favorite-button";
import { cn } from "@/lib/utils";
import { getSubjectVisual } from "@/lib/subject-visuals";
import { Star, Clock, BookOpen, Globe2, BarChart3, ArrowLeft } from "lucide-react";
import { CourseDetailEnter } from "./course-detail-enter";
import { CourseActions } from "./course-actions";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [user, course] = await Promise.all([getCurrentUser(), getCourseBySlug(slug)]);

  if (!course) notFound();

  const visual = getSubjectVisual(course.subject);
  const SubjectIcon = visual.icon;
  const favorited = user ? isFavorited(user.id, course.id) : false;
  const inCart = user ? isInCart(user.id, course.id) : false;

  return (
    <div className="min-h-screen bg-bg">
      {user && <DashboardHeader name={user.name} />}
      <CourseDetailEnter>
        <div className="w-full px-4 py-8 sm:px-6 lg:px-10">
          <Link
            href="/dashboard"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
          >
            <ArrowLeft size={15} /> Back to courses
          </Link>

          <div className="relative mb-7">
            <CourseCover
              subject={course.subject}
              className="aspect-[16/8] w-full rounded-2xl"
              iconClassName="h-24 w-24"
            />
            <FavoriteButton
              courseId={course.id}
              initialFavorited={favorited}
              size="lg"
              className="absolute right-4 top-4"
            />
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                visual.bg,
                visual.text
              )}
            >
              <SubjectIcon size={13} strokeWidth={2.5} />
              {course.subject}
            </span>
            <span className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-semibold text-ink-soft">
              {course.grade}
            </span>
          </div>

          <h1 className="mb-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {course.title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
              <Star size={16} className="fill-amber text-amber" />
              {course.teacherRating.toFixed(1)}
              <span className="font-normal text-ink-soft">({course.teacherReviewCount} reviews)</span>
            </span>
            <span className="text-ink-soft">Taught by {course.teacherName}</span>
          </div>

          <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {course.description}
          </p>

          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <DetailStat icon={BarChart3} label="Level" value={course.level} theme="bg-blue-100 text-blue-600" />
            <DetailStat icon={Globe2} label="Mode" value={course.mode} theme="bg-emerald-100 text-emerald-600" />
            <DetailStat icon={Clock} label="Duration" value={course.duration} theme="bg-amber-100 text-amber-700" />
            <DetailStat icon={BookOpen} label="Lessons" value={String(course.lessons)} theme="bg-fuchsia-100 text-fuchsia-600" />
          </div>

          <div className="mb-8 rounded-2xl border-2 border-border bg-surface p-3 text-sm text-ink-soft">
            Language of instruction: <span className="font-medium text-ink">{course.language}</span>
          </div>

          <CourseActions courseId={course.id} price={course.price} initialInCart={inCart} />
        </div>
      </CourseDetailEnter>
    </div>
  );
}

function DetailStat({
  icon: Icon,
  label,
  value,
  theme,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  theme: string;
}) {
  return (
    <div className="rounded-xl border-2 border-border bg-surface p-3.5">
      <span className={cn("mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg", theme)}>
        <Icon size={14} strokeWidth={2.5} />
      </span>
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
