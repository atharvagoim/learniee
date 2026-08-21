"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GRADES, SUBJECTS, PRICE_RANGES, RATING_FILTERS } from "@/lib/constants";
import { FilterDropdown } from "./filter-dropdown";

export interface FilterState {
  grade: string;
  subject: string;
  price: string;
  rating: string;
}

export function MobileFilterDrawer({
  open,
  onClose,
  filters,
  setFilters,
  onReset,
  activeCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  onReset: () => void;
  activeCount: number;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-surface p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Filters</h2>
              <button onClick={onClose} aria-label="Close filters" className="rounded-full p-1.5 text-ink-soft hover:bg-black/[0.04]">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <FilterField label="Grade">
                <FilterDropdown
                  label="All Grades"
                  value={filters.grade}
                  onChange={(v) => setFilters({ ...filters, grade: v })}
                  options={[{ value: "", label: "All Grades" }, ...GRADES.map((g) => ({ value: g, label: g }))]}
                />
              </FilterField>
              <FilterField label="Subject">
                <FilterDropdown
                  label="All Subjects"
                  value={filters.subject}
                  onChange={(v) => setFilters({ ...filters, subject: v })}
                  options={[{ value: "", label: "All Subjects" }, ...SUBJECTS.map((s) => ({ value: s, label: s }))]}
                />
              </FilterField>
              <FilterField label="Price">
                <FilterDropdown
                  label="Any Price"
                  value={filters.price}
                  onChange={(v) => setFilters({ ...filters, price: v })}
                  options={PRICE_RANGES.map((p) => ({ value: p.value, label: p.label }))}
                />
              </FilterField>
              <FilterField label="Teacher Rating">
                <FilterDropdown
                  label="Any Rating"
                  value={filters.rating}
                  onChange={(v) => setFilters({ ...filters, rating: v })}
                  options={RATING_FILTERS.map((r) => ({ value: r.value, label: r.label }))}
                />
              </FilterField>
            </div>

            <div className="mt-7 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={onReset}>
                Reset
              </Button>
              <Button className="flex-1" onClick={onClose}>
                Apply{activeCount > 0 ? ` (${activeCount})` : ""}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink">{label}</span>
      <div className="[&>div]:w-full [&_button]:w-full [&_ul]:w-full">{children}</div>
    </div>
  );
}
