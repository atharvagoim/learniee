import { CourseCardSkeleton } from "@/components/course/course-card";

export default function DashboardLoading() {
  return (
    <div className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="skeleton mb-3 h-8 w-72 rounded-lg" />
      <div className="skeleton mb-8 h-4 w-96 rounded-lg" />
      <div className="skeleton mb-10 h-14 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
