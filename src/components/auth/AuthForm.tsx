"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Leaf } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/foods");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setSuccess(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-sm text-center space-y-4 py-20 px-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <Leaf className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
        <p className="text-sm text-gray-500">
          We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm py-20 px-4">
      <div className="text-center mb-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
          <Leaf className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {mode === "login"
            ? "Sign in to access your saved recipes"
            : "Sign up to save and share your favourite recipes"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="At least 6 characters"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-emerald-600 font-medium hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-emerald-600 font-medium hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
