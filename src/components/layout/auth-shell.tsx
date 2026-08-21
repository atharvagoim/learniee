"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";
import { StudyIllustration } from "./study-illustration";
import { DoodleStar, DoodleSparkle, DoodleCloud } from "./doodles";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg lg:flex">
      {/* Left: form */}
      <div className="flex min-h-screen w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-[30%] lg:px-12 xl:px-16">
        <motion.div variants={container} initial="hidden" animate="show" className="mx-auto w-full max-w-sm">
          <motion.div variants={item} className="mb-10 lg:hidden">
            <Link href="/" className="flex items-center gap-2 text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-500/25">
                <GraduationCap size={18} />
              </span>
              <span className="text-lg font-extrabold tracking-tight">Learniee</span>
            </Link>
          </motion.div>

          <motion.h1 variants={item} className="mb-2 text-3xl font-extrabold tracking-tight text-ink">
            {title}
          </motion.h1>
          <motion.p variants={item} className="mb-8 text-sm text-ink-soft">
            {subtitle}
          </motion.p>

          <motion.div variants={item}>{children}</motion.div>

          <motion.div variants={item} className="mt-8 text-center text-sm text-ink-soft">
            {footer}
          </motion.div>
        </motion.div>
      </div>

      {/* Right: illustration panel */}
      <div className="relative hidden bg-hero lg:flex lg:w-[70%] lg:items-center lg:justify-center lg:overflow-hidden">
        {/* Full-bleed cover image, edge-to-edge */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/login.webp"
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          <div className="hidden h-full w-full items-center justify-center p-10">
            <StudyIllustration className="w-full max-w-md" />
          </div>
          {/* Readability wash so the brand mark, info card, and decorations stay legible over any photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-hero/55 via-transparent to-hero/55" />
        </div>

        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <DoodleStar className="animate-float-slow absolute left-16 top-16 h-7 w-7 text-amber-300" />
          <DoodleSparkle
            className="animate-float-slow absolute right-24 top-28 h-5 w-5 text-white/70"
            style={{ animationDelay: "0.6s" }}
          />
          <DoodleCloud className="absolute right-14 bottom-24 h-9 w-16 text-white/15" />
        </div>

        {/* Brand mark over the image */}
        <Link href="/" className="absolute left-10 top-10 z-10">
          <span className="text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">Learniee</span>
        </Link>

        <div className="absolute right-10 top-10 max-w-xs rounded-2xl border border-white/15 bg-white/10 p-4 text-right backdrop-blur-sm">
          <p className="flex items-center justify-end gap-1.5 text-sm font-bold text-white">
            Learniee for Parents
            <BookOpen size={15} />
          </p>
          <p className="mt-1 text-xs leading-relaxed text-white/70">
            450+ courses across every subject, with real teachers your child will love learning
            from.
          </p>
        </div>
      </div>
    </div>
  );
}
