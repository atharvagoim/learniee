import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { favoriteCount } from "@/lib/favorites";
import { orderCount } from "@/lib/orders";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { AccountClient } from "./account-client";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const favorites = favoriteCount(user.id);
  const orders = orderCount(user.id);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <DashboardHeader name={user.name} />
      <AccountClient user={user} favoritesCount={favorites} ordersCount={orders} />
      <div className="h-16 sm:hidden" />
      <MobileTabBar />
    </div>
  );
}
