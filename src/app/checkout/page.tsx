import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { listCartItems } from "@/lib/cart";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { CheckoutClient } from "./checkout-client";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const items = listCartItems(user.id);
  if (items.length === 0) redirect("/cart");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <DashboardHeader name={user.name} />
      <CheckoutClient items={items} parentName={user.name} />
    </div>
  );
}
