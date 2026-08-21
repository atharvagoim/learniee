import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CartClient } from "./cart-client";

export default async function CartPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <DashboardHeader name={user.name} />
      <CartClient />
    </div>
  );
}
