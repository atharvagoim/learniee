"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  User,
  LogOut,
  Heart,
  LayoutGrid,
  ReceiptText,
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { CartButton } from "./cart-button";

const NAV_LINKS = [
  { href: "/dashboard", label: "Explore", icon: LayoutGrid },
  { href: "/favorites", label: "Favorites", icon: Heart },
];

export function DashboardHeader({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    showToast("Logged out successfully", "success");
    router.push("/login");
    router.refresh();
  }

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 text-ink">
            <span className="text-base font-extrabold tracking-tight">
              Learniee
            </span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-150",
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-ink-soft hover:bg-black/[0.04] hover:text-ink",
                  )}
                >
                  <Icon size={15} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <CartButton />
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="flex items-center gap-2 rounded-full border-2 border-border bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-ink/25"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xs font-bold text-white">
                {initials}
              </span>
              <span className="hidden text-sm font-medium text-ink sm:inline">
                {name}
              </span>
              <ChevronDown
                size={14}
                className={`text-ink-soft transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.96,
                    transition: { duration: 0.12 },
                  }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-xl shadow-black/10"
                >
                  <div className="px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">
                      {name}
                    </p>
                    <p className="text-xs text-ink-soft">Parent account</p>
                  </div>
                  <div className="border-t border-border p-1.5 sm:hidden">
                    {NAV_LINKS.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          role="menuitem"
                          onClick={() => setOpen(false)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.04] transition-colors"
                        >
                          <Icon size={15} /> {link.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-border p-1.5">
                    <Link
                      href="/account"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.04] transition-colors"
                    >
                      <User size={15} /> Account
                    </Link>
                    <Link
                      href="/orders"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-black/[0.04] transition-colors"
                    >
                      <ReceiptText size={15} /> Order history
                    </Link>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger-soft transition-colors"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
