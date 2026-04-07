import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign Up | Freshwell" };

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
