import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <AuthShell title="Sign In" subtitle="Access your account to manage orders, wishlist and more.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
