"use client";

import { Search, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function SearchBar({
  value,
  onChange,
  isSearching,
  autoFocus,
}: {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <motion.div
      whileFocus={{}}
      className="relative flex items-center rounded-2xl border-2 border-border bg-surface shadow-sm shadow-black/[0.02] transition-all duration-200 focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-400/15 focus-within:shadow-md"
    >
      <Search
        size={19}
        className="pointer-events-none absolute left-4 text-ink-soft transition-colors duration-200 peer-focus:text-accent"
      />
      <input
        type="text"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search courses, subjects or teachers..."
        aria-label="Search courses, subjects or teachers"
        className="peer h-14 w-full rounded-2xl bg-transparent pl-12 pr-11 text-[15px] text-ink placeholder:text-ink-soft/70 outline-none"
      />
      <div className="absolute right-3.5 flex items-center">
        {isSearching && <Loader2 size={17} className="animate-spin text-accent" />}
        {!isSearching && value && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="rounded-full p-1 text-ink-soft hover:bg-black/[0.04] hover:text-ink transition-colors"
          >
            <X size={16} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
