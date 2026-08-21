"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages);

  return (
    <nav aria-label="Course results pages" className="flex items-center justify-center gap-1.5 sm:gap-2">
      <PageButton
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
        className="px-3"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </PageButton>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-ink-soft">
              &hellip;
            </span>
          ) : (
            <PageButton
              key={p}
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "h-9 w-9 justify-center px-0",
                p === page && "bg-accent text-accent-ink border-accent"
              )}
            >
              {p}
            </PageButton>
          )
        )}
      </div>

      <PageButton
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
        className="px-3"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </PageButton>
    </nav>
  );
}

function PageButton({
  children,
  className,
  disabled,
  ...props
}: Omit<HTMLMotionProps<"button">, "children"> & { children?: React.ReactNode }) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.93 }}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-lg border border-border bg-surface text-sm font-medium text-ink transition-colors duration-150",
        "hover:border-ink/25 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

function getPageList(page: number, totalPages: number): (number | "...")[] {
  const delta = 1;
  const range: (number | "...")[] = [];
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  range.push(1);
  if (left > 2) range.push("...");
  for (let i = left; i <= right; i++) range.push(i);
  if (right < totalPages - 1) range.push("...");
  if (totalPages > 1) range.push(totalPages);

  return range;
}
