"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Check, Zap, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function CourseActions({
  courseId,
  price,
  initialInCart = false,
}: {
  courseId: string;
  price: number;
  initialInCart?: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [inCart, setInCart] = useState(initialInCart);
  const [addBusy, setAddBusy] = useState(false);
  const [buyBusy, setBuyBusy] = useState(false);

  async function ensureInCart() {
    if (inCart) return true;
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    if (res.status === 401) {
      showToast("Log in to add courses to your cart", "warning");
      return false;
    }
    if (!res.ok) {
      showToast("Something went wrong. Please try again.", "error");
      return false;
    }
    setInCart(true);
    window.dispatchEvent(new Event("learniee:cart-changed"));
    return true;
  }

  async function handleAddToCart() {
    if (addBusy || inCart) return;
    setAddBusy(true);
    const ok = await ensureInCart();
    if (ok) showToast("Added to cart", "success");
    setAddBusy(false);
  }

  async function handleBuyNow() {
    if (buyBusy) return;
    setBuyBusy(true);
    const ok = await ensureInCart();
    setBuyBusy(false);
    if (ok) router.push("/checkout");
  }

  return (
    <div className="sticky bottom-[calc(env(safe-area-inset-bottom)+1rem)] flex flex-col gap-3 rounded-2xl border-2 border-border bg-surface p-4 shadow-xl shadow-black/5 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <p className="text-xs text-ink-soft">Course price</p>
        <p className="text-2xl font-extrabold text-ink">{formatINR(price)}</p>
      </div>
      <div className="flex gap-2.5">
        <button
          onClick={handleAddToCart}
          disabled={addBusy || inCart}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-border bg-surface px-4 py-3 text-sm font-bold text-ink transition-colors hover:border-ink/25 disabled:cursor-default sm:flex-none"
        >
          {addBusy ? (
            <Loader2 size={16} className="animate-spin" />
          ) : inCart ? (
            <Check size={16} className="text-emerald-600" />
          ) : (
            <ShoppingCart size={16} />
          )}
          {inCart ? "In cart" : "Add to cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={buyBusy}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-500/25 transition-transform hover:scale-[1.015] active:scale-[0.97] disabled:opacity-70 sm:flex-none"
        >
          {buyBusy ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
          Buy now
        </button>
      </div>
    </div>
  );
}
