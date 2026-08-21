"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function AddToCartButton({
  courseId,
  initialInCart = false,
  variant = "icon",
  className = "",
}: {
  courseId: string;
  initialInCart?: boolean;
  variant?: "icon" | "full";
  className?: string;
}) {
  const [inCart, setInCart] = useState(initialInCart);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);

    try {
      if (!inCart) {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        if (res.status === 401) {
          showToast("Log in to add courses to your cart", "warning");
          return;
        }
        if (!res.ok) throw new Error("Failed to add to cart");
        setInCart(true);
        showToast("Added to cart", "success");
      } else {
        const res = await fetch(`/api/cart/${courseId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove from cart");
        setInCart(false);
        showToast("Removed from cart", "success");
      }
      window.dispatchEvent(new Event("learniee:cart-changed"));
    } catch {
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  if (variant === "full") {
    return (
      <motion.button
        type="button"
        onClick={toggle}
        disabled={busy}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-colors duration-150 disabled:opacity-70",
          inCart
            ? "border-2 border-emerald-300 bg-emerald-50 text-emerald-700"
            : "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/25",
          className
        )}
      >
        {busy ? (
          <Loader2 size={16} className="animate-spin" />
        ) : inCart ? (
          <Check size={16} />
        ) : (
          <ShoppingCart size={16} />
        )}
        {inCart ? "Added to cart" : "Add to cart"}
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      disabled={busy}
      whileTap={{ scale: 0.9 }}
      aria-pressed={inCart}
      aria-label={inCart ? "Remove from cart" : "Add to cart"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-150",
        inCart ? "border-emerald-300 bg-emerald-50 text-emerald-600" : "border-border bg-surface text-ink-soft hover:border-accent hover:text-accent",
        className
      )}
    >
      {busy ? (
        <Loader2 size={14} className="animate-spin" />
      ) : inCart ? (
        <Check size={15} />
      ) : (
        <ShoppingCart size={15} />
      )}
    </motion.button>
  );
}
