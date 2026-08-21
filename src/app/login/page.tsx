"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "Unable to sign in. Please try again.");
        setLoading(false);
        return;
      }

      showToast("Welcome back", "success");
      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  function fillDemo() {
    setEmail("demo@learniee.com");
    setPassword("Demo@12345");
    setErrors({});
    setFormError("");
  }

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Log in to keep finding courses your child will love."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-accent hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          isPassword
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {formError && (
          <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" loading={loading} className="mt-1 w-full">
          <span className="flex w-full items-center justify-between">
            Log in
            {!loading && <ArrowRight size={16} />}
          </span>
        </Button>

        <button
          type="button"
          onClick={fillDemo}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
        >
          <Sparkles size={13} />
          Use demo account
        </button>
      </form>
    </AuthShell>
  );
}
