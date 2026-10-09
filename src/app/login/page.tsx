import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back! 👋" subtitle="Sign in to your Design4Ever account.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
