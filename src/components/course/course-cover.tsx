"use client";

import { BookOpen, GraduationCap, Pencil } from "lucide-react";
import { getSubjectVisual } from "@/lib/subject-visuals";
import { cn, slugify } from "@/lib/utils";

/**
 * Course cover: tries a real uploaded image for the subject first
 * (public/cover/{subject-slug}.png, e.g. public/cover/robotics.png), and
 * falls back to a generated subject-colored, study-themed cover if that
 * file doesn't exist. This keeps every course visually tied to its
 * subject even for subjects that don't have a custom cover yet.
 */

// A few subjects have a shorter/different filename than a plain slugify()
// of their full name would produce (e.g. the cover for "Artificial
// Intelligence" is uploaded as ai.png, not artificial-intelligence.png).
const COVER_SLUG_OVERRIDES: Record<string, string> = {
  "Artificial Intelligence": "ai",
};

function coverSlug(subject: string) {
  return COVER_SLUG_OVERRIDES[subject] ?? slugify(subject);
}

export function CourseCover({
  subject,
  className,
  iconClassName,
}: {
  subject: string;
  className?: string;
  iconClassName?: string;
}) {
  const visual = getSubjectVisual(subject);
  const Icon = visual.icon;
  const coverSrc = `/cover/${coverSlug(subject)}.png`;

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", visual.bg, className)}>
      {/* soft dot-grid texture */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden>
        <defs>
          <pattern id={`dots-${subject}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="currentColor" className={visual.text} opacity="0.35" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${subject})`} />
      </svg>

      {/* soft radial glow behind the icon */}
      <div
        className={cn(
          "absolute h-2/3 w-2/3 rounded-full opacity-40 blur-2xl",
          visual.solid
        )}
      />

      {/* decorative corner motifs */}
      <BookOpen
        className={cn("absolute -left-2 -top-2 h-14 w-14 -rotate-12 opacity-15", visual.text)}
        strokeWidth={1.5}
      />
      <GraduationCap
        className={cn("absolute -right-3 -bottom-3 h-16 w-16 rotate-12 opacity-15", visual.text)}
        strokeWidth={1.5}
      />
      <Pencil
        className={cn("absolute right-4 top-3 h-6 w-6 rotate-45 opacity-20", visual.text)}
        strokeWidth={1.8}
      />

      {/* main subject icon badge (fallback content) */}
      <span
        className={cn(
          "relative z-10 flex items-center justify-center rounded-2xl bg-white/85 shadow-sm backdrop-blur-sm",
          iconClassName ?? "h-16 w-16"
        )}
      >
        <Icon className={visual.text} size={30} strokeWidth={2.1} />
      </span>

      {/* Real uploaded cover image, if present -- painted on top, hides
          itself on error so the generated fallback above shows through */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={coverSrc}
        alt=""
        className="absolute inset-0 z-20 h-full w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
