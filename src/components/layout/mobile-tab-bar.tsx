"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Heart, ShoppingCart, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "Explore", icon: LayoutGrid },
  { href: "/favorites", label: "Favorites", icon: Heart },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account", label: "Account", icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState<number | null>(null);

  const refreshCart = useCallback(() => {
    fetch("/api/cart")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setCartCount(data.items?.length ?? 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshCart();
    window.addEventListener("learniee:cart-changed", refreshCart);
    return () => window.removeEventListener("learniee:cart-changed", refreshCart);
  }, [refreshCart]);

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-border bg-surface/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] sm:hidden"
    >
      <div className="grid grid-cols-4">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-semibold transition-colors",
                active ? "text-accent" : "text-ink-soft"
              )}
            >
              <span className="relative">
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {tab.href === "/cart" && (
                  <AnimatePresence>
                    {Boolean(cartCount) && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-0.5 text-[9px] font-bold text-white"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
