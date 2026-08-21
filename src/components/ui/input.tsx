"use client";

import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, isPassword, className, id, type, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [show, setShow] = useState(false);
  const resolvedType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            "h-12 w-full rounded-xl border bg-surface px-4 text-[15px] text-ink placeholder:text-ink-soft/60 outline-none transition-all duration-150",
            "focus:border-accent focus:ring-4 focus:ring-accent/10",
            "disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-ink-soft",
            error ? "border-danger focus:border-danger focus:ring-danger/10" : "border-border",
            isPassword && "pr-11",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <motion.p
          id={`${inputId}-error`}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium text-danger"
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
});
