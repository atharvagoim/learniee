"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, User, CreditCard, Tag } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from "@/lib/constants";
import type { OrderRecord } from "@/lib/orders";

export function OrderConfirmation({ order }: { order: OrderRecord }) {
  const paymentLabel =
    PAYMENT_METHOD_LABELS[order.paymentMethod as (typeof PAYMENT_METHODS)[number]] ??
    order.paymentMethod;
  const orderDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 lg:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mb-6 flex flex-col items-center gap-3 text-center"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">Order confirmed!</h1>
        <p className="text-sm text-ink-soft">
          Order <span className="font-semibold text-ink">#{order.orderNumber}</span> placed on{" "}
          {orderDate}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-2xl border-2 border-border bg-surface p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-wrap gap-4 border-b border-border pb-5 text-sm">
          {order.childName && (
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
              <User size={14} /> For <span className="font-medium text-ink">{order.childName}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-ink-soft">
            <CreditCard size={14} /> Paid via <span className="font-medium text-ink">{paymentLabel}</span>
          </span>
          {order.promoCode && (
            <span className="inline-flex items-center gap-1.5 text-ink-soft">
              <Tag size={14} /> Code <span className="font-medium text-ink">{order.promoCode}</span>
            </span>
          )}
        </div>

        <div className="mb-5 flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{item.title}</p>
                <p className="text-xs text-ink-soft">{item.subject}</p>
              </div>
              <span className="shrink-0 font-semibold text-ink">{formatINR(item.price)}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span className="text-ink">{formatINR(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex items-center justify-between text-success">
              <span>Discount</span>
              <span>&minus;{formatINR(order.discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-bold text-ink">Total paid</span>
            <span className="text-xl font-extrabold text-ink">{formatINR(order.total)}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 flex justify-center"
      >
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 text-sm font-bold text-white shadow-md shadow-violet-500/25 transition-transform hover:scale-[1.02] active:scale-[0.97]"
        >
          Back to dashboard
        </Link>
      </motion.div>
    </div>
  );
}
