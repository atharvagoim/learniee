import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { FavoritesClient } from "./components/favorites-client";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <DashboardHeader name={user.name} />
      <FavoritesClient />
      <div className="h-16 sm:hidden" />
      <MobileTabBar />
    </div>
  );
}
