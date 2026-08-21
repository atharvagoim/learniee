import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white hover:brightness-110 shadow-md shadow-violet-500/25",
  secondary: "bg-surface text-ink border-2 border-border hover:border-ink/30 hover:bg-black/[0.02]",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2",
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ scale: 1.012 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.12 }}>
      <Link
        href={href}
        className={cn(
          "inline-flex w-full items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
      >
        {children}
      </Link>
    </motion.div>
  );
}
