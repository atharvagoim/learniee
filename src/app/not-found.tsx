import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-soft text-accent">
        <GraduationCap size={22} />
      </span>
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        The course or page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/dashboard"
        className="mt-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink hover:bg-accent/90 transition-colors"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
