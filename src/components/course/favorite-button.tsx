"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

export function FavoriteButton({
  courseId,
  initialFavorited = false,
  size = "md",
  onChange,
  className = "",
}: {
  courseId: string;
  initialFavorited?: boolean;
  size?: "sm" | "md" | "lg";
  onChange?: (favorited: boolean) => void;
  className?: string;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  const sizes = {
    sm: { box: "h-8 w-8", icon: 14 },
    md: { box: "h-9 w-9", icon: 16 },
    lg: { box: "h-11 w-11", icon: 19 },
  }[size];

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    const next = !favorited;
    setFavorited(next);
    onChange?.(next);
    setBusy(true);

    try {
      if (next) {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });
        if (res.status === 401) {
          setFavorited(false);
          onChange?.(false);
          showToast("Log in to save favorites", "warning");
          return;
        }
        if (!res.ok) throw new Error("Failed to add favorite");
        showToast("Saved to favorites", "success");
      } else {
        const res = await fetch(`/api/favorites/${courseId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to remove favorite");
      }
    } catch {
      // Roll back optimistic update on failure
      setFavorited(!next);
      onChange?.(!next);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      className={cn(
        "flex items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors duration-150 hover:bg-white",
        sizes.box,
        className
      )}
    >
      <motion.span
        key={favorited ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      >
        <Heart
          size={sizes.icon}
          className={cn(
            "transition-colors duration-150",
            favorited ? "fill-rose-500 text-rose-500" : "text-ink-soft"
          )}
        />
      </motion.span>
    </motion.button>
  );
}
