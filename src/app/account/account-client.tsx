"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Heart, LogOut, ReceiptText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import type { PublicUser } from "@/lib/auth";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.03 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

export function AccountClient({
  user,
  favoritesCount,
  ordersCount,
}: {
  user: PublicUser;
  favoritesCount: number;
  ordersCount: number;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Unable to update your account.");
        return;
      }
      showToast("Account updated", "success");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    showToast("Logged out successfully", "success");
    router.push("/login");
    router.refresh();
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-10"
    >
      <motion.div variants={item} className="mb-8 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-xl font-bold text-white shadow-md shadow-violet-500/20">
          {initials}
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">{user.name}</h1>
          <p className="text-sm text-ink-soft">Parent account</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={Mail} label="Email" value={user.email} />
        <StatCard icon={Calendar} label="Member since" value={joined} />
        <StatCard icon={Heart} label="Favorites" value={String(favoritesCount)} />
      </motion.div>

      <motion.div variants={item} className="mb-6">
        <Link
          href="/orders"
          className="flex items-center justify-between gap-3 rounded-2xl border-2 border-border bg-surface p-4 transition-colors hover:border-ink/20 sm:p-5"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
              <ReceiptText size={18} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Order history</span>
              <span className="block text-xs text-ink-soft">
                {ordersCount} order{ordersCount === 1 ? "" : "s"} placed
              </span>
            </span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-ink-soft" />
        </Link>
      </motion.div>

      <motion.div variants={item} className="rounded-2xl border-2 border-border bg-surface p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-ink-soft">
          <User size={14} /> Profile details
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Parent name" value={name} onChange={(e) => setName(e.target.value)} error={error} />
          <Input label="Email address" value={user.email} disabled />

          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-ink-soft">Email address can&apos;t be changed here.</p>
            <Button type="submit" size="sm" loading={loading}>
              Save changes
            </Button>
          </div>
        </form>
      </motion.div>

      <motion.div variants={item} className="mt-6 flex justify-end">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-danger hover:underline"
        >
          <LogOut size={15} /> Log out
        </button>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border-2 border-border bg-surface p-3.5">
      <Icon size={15} className="mb-2 text-accent" />
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="truncate text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
