"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:brightness-110 disabled:opacity-50 shadow-md shadow-violet-500/25",
  secondary:
    "bg-surface text-ink border-2 border-border hover:border-ink/30 hover:bg-black/[0.02]",
  ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-black/[0.03]",
  danger: "bg-danger text-white hover:bg-danger/90",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", loading, disabled, children, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileHover={disabled || loading ? undefined : { scale: 1.012 }}
      whileTap={disabled || loading ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors duration-150 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-accent",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </motion.button>
  );
});
