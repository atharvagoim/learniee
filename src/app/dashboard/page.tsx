import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getRecommendedCourses } from "@/lib/courses";
import { getFavoritedSubjects, listFavoriteCourseIds, getFavoritedIds } from "@/lib/favorites";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { DashboardClient } from "./components/dashboard-client";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const favoritedSubjects = getFavoritedSubjects(user.id);
  const favoriteIds = listFavoriteCourseIds(user.id);
  const recommended = getRecommendedCourses({
    subjects: favoritedSubjects,
    excludeIds: favoriteIds,
    limit: 8,
  });
  const recommendedFavorited = getFavoritedIds(
    user.id,
    recommended.map((c) => c.id)
  );
  const recommendedCourses = recommended.map((c) => ({
    ...c,
    isFavorited: recommendedFavorited.has(c.id),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <DashboardHeader name={user.name} />
      <DashboardClient
        parentName={user.name.split(" ")[0]}
        recommendedCourses={recommendedCourses}
        personalized={favoritedSubjects.length > 0}
      />
      <div className="h-16 sm:hidden" />
      <MobileTabBar />
    </div>
  );
}
