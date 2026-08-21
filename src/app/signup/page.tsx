"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { AuthShell } from "@/components/layout/auth-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { signupSchema } from "@/lib/validations";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const parsed = signupSchema.safeParse(form);
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error ?? "Unable to create your account. Please try again.");
        setLoading(false);
        return;
      }

      showToast("Account created successfully", "success");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setFormError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Join Learniee to search and compare courses for your child in minutes."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Parent name"
          autoComplete="name"
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />
        <Input
          label="Password"
          isPassword
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={errors.password}
        />
        <Input
          label="Confirm password"
          isPassword
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
        />

        {formError && (
          <p role="alert" className="rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger">
            {formError}
          </p>
        )}

        <Button type="submit" loading={loading} className="mt-1 w-full">
          <span className="flex w-full items-center justify-between">
            Create account
            {!loading && <ArrowRight size={16} />}
          </span>
        </Button>
      </form>
    </AuthShell>
  );
}
