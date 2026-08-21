"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
  value: string;
  label: string;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const listId = useId();
  const active = value !== "";
  const activeLabel = options.find((o) => o.value === value)?.label ?? label;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        className={cn(
          "flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-150",
          active
            ? "border-accent bg-accent-soft text-accent"
            : "border-border bg-surface text-ink hover:border-ink/25"
        )}
      >
        {activeLabel}
        <ChevronDown size={15} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-30 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-xl shadow-black/10"
          >
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <li key={opt.value || "any"}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors duration-100",
                      selected ? "bg-accent-soft text-accent font-medium" : "text-ink hover:bg-black/[0.04]"
                    )}
                  >
                    {opt.label}
                    {selected && <Check size={14} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
