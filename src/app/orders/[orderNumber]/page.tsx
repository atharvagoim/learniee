import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getOrderByNumber } from "@/lib/orders";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { OrderConfirmation } from "./order-confirmation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { orderNumber } = await params;
  const order = getOrderByNumber(user.id, orderNumber);
  if (!order) notFound();

  return (
    <div className="min-h-screen bg-bg">
      <DashboardHeader name={user.name} />
      <OrderConfirmation order={order} />
      <div className="mx-auto -mt-4 flex max-w-2xl justify-center px-4 pb-10">
        <Link href="/orders" className="text-sm font-medium text-ink-soft hover:text-ink transition-colors">
          View all orders
        </Link>
      </div>
      <div className="h-16 sm:hidden" />
      <MobileTabBar />
    </div>
  );
}
