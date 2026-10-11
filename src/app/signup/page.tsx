import { Suspense } from "react";
import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <AuthShell title="Create an Account" subtitle="It’s quick, easy and free!">
      <Suspense>
        <SignupForm />
      </Suspense>
    </AuthShell>
  );
}
