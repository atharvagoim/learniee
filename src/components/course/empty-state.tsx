"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface/60 px-6 py-20 text-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-500"
      >
        <SearchX size={28} />
      </motion.div>
      <h3 className="text-lg font-semibold text-ink">No courses found</h3>
      <p className="max-w-sm text-sm text-ink-soft">
        We couldn&apos;t find courses matching your current search and filters. Try adjusting your
        search or removing some filters.
      </p>
      <Button variant="secondary" size="sm" onClick={onClearFilters} className="mt-2">
        Clear all filters
      </Button>
    </motion.div>
  );
}
