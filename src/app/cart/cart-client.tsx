"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, ArrowRight, Star } from "lucide-react";
import { CourseCover } from "@/components/course/course-cover";
import { LinkButton } from "@/components/ui/link-button";
import { useToast } from "@/components/ui/toast";
import { formatINR } from "@/lib/utils";
import { getSubjectVisual } from "@/lib/subject-visuals";
import type { Course } from "@/types";

export function CartClient() {
  const [items, setItems] = useState<(Course & { addedAt: string })[] | null>(null);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { showToast } = useToast();

  function load() {
    fetch("/api/cart")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load your cart.");
        setItems(data.items);
      })
      .catch(() => setError("Unable to load your cart right now. Please try again."));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleRemove(courseId: string) {
    setRemovingId(courseId);
    try {
      const res = await fetch(`/api/cart/${courseId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => (prev ? prev.filter((i) => i.id !== courseId) : prev));
      window.dispatchEvent(new Event("learniee:cart-changed"));
    } catch {
      showToast("Unable to remove this item. Please try again.", "error");
    } finally {
      setRemovingId(null);
    }
  }

  const subtotal = items?.reduce((sum, i) => sum + i.price, 0) ?? 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-10 sm:px-6 lg:px-10 lg:pb-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
          <ShoppingCart size={20} />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Your cart</h1>
          <p className="text-sm text-ink-soft">Review your courses before checking out.</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="mb-6 rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {items === null && !error ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border-2 border-border bg-surface p-4">
              <div className="skeleton h-20 w-28 shrink-0 rounded-xl sm:h-24 sm:w-32" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="skeleton h-3 w-1/3 rounded" />
                <div className="skeleton h-4 w-2/3 rounded" />
                <div className="skeleton h-3 w-1/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : items && items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface/60 px-6 py-20 text-center"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
            <ShoppingCart size={28} />
          </span>
          <h3 className="text-lg font-semibold text-ink">Your cart is empty</h3>
          <p className="max-w-sm text-sm text-ink-soft">
            Browse courses and tap &quot;Add to cart&quot; to start building your child&apos;s
            learning plan.
          </p>
          <Link
            href="/dashboard"
            className="mt-2 inline-flex h-9 items-center justify-center rounded-lg border-2 border-border bg-surface px-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-black/[0.02]"
          >
            Browse courses
          </Link>
        </motion.div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {items?.map((item) => {
                const visual = getSubjectVisual(item.subject);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                    className="flex gap-4 rounded-2xl border-2 border-border bg-surface p-3 sm:p-4"
                  >
                    <Link href={`/course/${item.slug}`} className="shrink-0">
                      <CourseCover
                        subject={item.subject}
                        className="h-20 w-28 rounded-xl sm:h-24 sm:w-32"
                        iconClassName="h-10 w-10"
                      />
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className={`text-[11px] font-bold ${visual.text}`}>{item.subject}</p>
                        <Link href={`/course/${item.slug}`}>
                          <h3 className="line-clamp-2 text-sm font-semibold text-ink hover:underline sm:text-[15px]">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="mt-1 flex items-center gap-2 text-xs text-ink-soft">
                          <span>{item.grade}</span>
                          <span aria-hidden>&middot;</span>
                          <span className="inline-flex items-center gap-0.5">
                            <Star size={11} className="fill-amber text-amber" /> {item.teacherRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-bold text-ink sm:text-base">
                          {formatINR(item.price)}
                        </span>
                        <button
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                          aria-label={`Remove ${item.title} from cart`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Desktop summary sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border-2 border-border bg-surface p-6">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ink-soft">
                Order summary
              </h2>
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-ink-soft">
                  {items?.length} course{items?.length === 1 ? "" : "s"}
                </span>
                <span className="font-semibold text-ink">{formatINR(subtotal)}</span>
              </div>
              <div className="mb-5 flex items-center justify-between border-t border-border pt-4">
                <span className="font-bold text-ink">Subtotal</span>
                <span className="text-xl font-extrabold text-ink">{formatINR(subtotal)}</span>
              </div>
              <LinkButton href="/checkout" className="w-full">
                Proceed to checkout <ArrowRight size={16} />
              </LinkButton>
            </div>
          </div>
        </div>
      )}

      {/* Mobile sticky checkout bar */}
      {items && items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-border bg-surface/95 p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-ink-soft">
                {items.length} course{items.length === 1 ? "" : "s"}
              </p>
              <p className="text-lg font-extrabold text-ink">{formatINR(subtotal)}</p>
            </div>
            <LinkButton href="/checkout" size="md" className="max-w-[220px] flex-1">
              Checkout <ArrowRight size={16} />
            </LinkButton>
          </div>
        </div>
      )}
    </div>
  );
}
