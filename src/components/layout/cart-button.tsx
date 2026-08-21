"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function CartButton() {
  const [count, setCount] = useState<number | null>(null);

  const refresh = useCallback(() => {
    fetch("/api/cart")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setCount(data.items?.length ?? 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("learniee:cart-changed", refresh);
    return () => window.removeEventListener("learniee:cart-changed", refresh);
  }, [refresh]);

  return (
    <Link
      href="/cart"
      aria-label={count ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/[0.04] hover:text-ink"
    >
      <ShoppingCart size={19} />
      <AnimatePresence>
        {Boolean(count) && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white"
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );
}
