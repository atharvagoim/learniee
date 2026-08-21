"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export interface ActiveFilter {
  key: string;
  label: string;
  onRemove: () => void;
}

export function ActiveFilterChips({
  filters,
  onClearAll,
}: {
  filters: ActiveFilter[];
  onClearAll: () => void;
}) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AnimatePresence initial={false}>
        {filters.map((f) => (
          <motion.button
            key={f.key}
            layout
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.18 }}
            onClick={f.onRemove}
            className="group inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {f.label}
            <X size={12} />
          </motion.button>
        ))}
      </AnimatePresence>
      <motion.button
        layout
        onClick={onClearAll}
        className="text-xs font-semibold text-ink-soft underline-offset-2 hover:text-danger hover:underline transition-colors"
      >
        Clear all
      </motion.button>
    </div>
  );
}
