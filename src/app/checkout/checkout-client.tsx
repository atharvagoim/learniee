"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, Smartphone, CreditCard, Landmark, Tag, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { formatINR, cn } from "@/lib/utils";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/constants";
import type { Course } from "@/types";

const PAYMENT_ICONS: Record<(typeof PAYMENT_METHODS)[number], React.ElementType> = {
  UPI: Smartphone,
  Card: CreditCard,
  "Net Banking": Landmark,
};

export function CheckoutClient({
  items,
  parentName,
}: {
  items: (Course & { addedAt: string })[];
  parentName: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();

  const [childName, setChildName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<(typeof PAYMENT_METHODS)[number]>("UPI");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [items]);
  const discount = promo?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  async function applyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const res = await fetch("/api/checkout/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPromoError(data.error ?? "That promo code isn't valid.");
        setPromo(null);
        return;
      }
      setPromo({ code: promoInput.trim().toUpperCase(), discount: data.discount, label: data.label });
      showToast(`Promo applied: ${data.label}`, "success");
    } catch {
      setPromoError("Unable to check that code right now.");
    } finally {
      setPromoLoading(false);
    }
  }

  async function placeOrder() {
    setPlacingOrder(true);
    setOrderError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName: childName.trim() || undefined,
          paymentMethod,
          promoCode: promo?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrderError(data.error ?? "Unable to place your order right now.");
        setPlacingOrder(false);
        return;
      }
      window.dispatchEvent(new Event("learniee:cart-changed"));
      router.push(`/orders/${data.order.orderNumber}`);
    } catch {
      setOrderError("Network error. Please try again.");
      setPlacingOrder(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-10">
      <Link
        href="/cart"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink transition-colors"
      >
        <ArrowLeft size={15} /> Back to cart
      </Link>

      <h1 className="mb-8 text-2xl font-extrabold tracking-tight text-ink">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border-2 border-border bg-surface p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-soft">
              Learner details
            </h2>
            <Input
              label="Child's name (optional)"
              placeholder="Who is this course for?"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
            />
            <p className="mt-2 text-xs text-ink-soft">
              Booking as <span className="font-medium text-ink">{parentName}</span>
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-surface p-5 sm:p-6">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-soft">
              Payment method
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((method) => {
                const Icon = PAYMENT_ICONS[method];
                const active = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 px-3 py-4 text-center transition-colors duration-150",
                      active ? "border-accent bg-accent-soft" : "border-border hover:border-ink/25"
                    )}
                  >
                    <Icon size={20} className={active ? "text-accent" : "text-ink-soft"} />
                    <span className={cn("text-sm font-semibold", active ? "text-accent" : "text-ink")}>
                      {PAYMENT_METHOD_LABELS[method]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 flex items-start gap-1.5 text-xs text-ink-soft">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              This is a demo checkout for a portfolio project — no real payment is collected or
              processed, and no card details are requested.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-surface p-5 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
              <Tag size={14} /> Promo code
            </h2>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  label="Promo code"
                  placeholder="Try LEARN10 or WELCOME500"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError("");
                  }}
                  className="h-11"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={applyPromo}
                loading={promoLoading}
                className="mt-[26px] h-11 shrink-0"
              >
                Apply
              </Button>
            </div>
            {promoError && <p className="mt-2 text-xs font-medium text-danger">{promoError}</p>}
            {promo && (
              <p className="mt-2 text-xs font-medium text-success">
                &quot;{promo.code}&quot; applied &mdash; {promo.label}
              </p>
            )}
          </div>
        </div>

        <div>
          <div className="rounded-2xl border-2 border-border bg-surface p-5 sm:sticky sm:top-24 sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
              <ShoppingBag size={14} /> Order summary
            </h2>

            <div className="mb-4 flex max-h-56 flex-col gap-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <span className="line-clamp-2 text-ink">{item.title}</span>
                  <span className="shrink-0 font-semibold text-ink">{formatINR(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-medium text-ink">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-success">
                  <span>Discount</span>
                  <span className="font-medium">&minus;{formatINR(discount)}</span>
                </div>
              )}
            </div>

            <div className="my-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-bold text-ink">Total</span>
              <span className="text-xl font-extrabold text-ink">{formatINR(total)}</span>
            </div>

            {orderError && (
              <p role="alert" className="mb-3 rounded-lg bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
                {orderError}
              </p>
            )}

            <Button onClick={placeOrder} loading={placingOrder} className="w-full">
              {placingOrder ? "Placing order..." : `Place order \u2022 ${formatINR(total)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
