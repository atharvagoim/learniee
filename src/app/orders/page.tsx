import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { listOrdersForUser } from "@/lib/orders";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { formatINR } from "@/lib/utils";
import { ReceiptText, ChevronRight, ShoppingBag } from "lucide-react";

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = listOrdersForUser(user.id);

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <DashboardHeader name={user.name} />
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <ReceiptText size={20} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">Order history</h1>
            <p className="text-sm text-ink-soft">Everything you&apos;ve booked through Learniee.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface/60 px-6 py-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <ShoppingBag size={28} />
            </span>
            <h3 className="text-lg font-semibold text-ink">No orders yet</h3>
            <p className="max-w-sm text-sm text-ink-soft">
              Once you check out, your order confirmations will show up here.
            </p>
            <Link
              href="/dashboard"
              className="mt-2 inline-flex h-9 items-center justify-center rounded-lg border-2 border-border bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-black/[0.02]"
            >
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.orderNumber}
                href={`/orders/${order.orderNumber}`}
                className="flex items-center justify-between gap-4 rounded-2xl border-2 border-border bg-surface p-4 transition-colors hover:border-ink/20 sm:p-5"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-ink">#{order.orderNumber}</p>
                  <p className="text-xs text-ink-soft">
                    {order.itemCount} course{order.itemCount === 1 ? "" : "s"} &middot;{" "}
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="font-bold text-ink">{formatINR(order.total)}</span>
                  <ChevronRight size={16} className="text-ink-soft" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="h-16 sm:hidden" />
      <MobileTabBar />
    </div>
  );
}
