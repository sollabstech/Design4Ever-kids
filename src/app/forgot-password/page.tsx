"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { Field, inputCls } from "@/components/ui";
import { isEmail } from "@/lib/validate";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) { setError("Please enter a valid email address."); return; }
    setSent(true);
  };

  return (
    <AuthShell title="Forgot password? 🔑" subtitle="Enter your email and we'll send you a reset link.">
      {sent ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">📬</div>
          <h2 className="font-black text-[#1a1a2e] text-lg">Check your inbox</h2>
          <p className="text-sm text-gray-500 mt-1">If an account exists for <b>{email}</b>, you&apos;ll receive a password reset link shortly.</p>
          <Link href="/login" className="inline-block mt-6 bg-[#e91e8c] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#c2187a]">Back to Sign In</Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <Field label="Email Address" required error={error}>
            <input type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" className={inputCls} />
          </Field>
          <button type="submit" className="w-full bg-[#e91e8c] hover:bg-[#c2187a] text-white font-black py-3.5 rounded-xl transition-colors">Send Reset Link</button>
          <p className="text-sm text-gray-500 text-center"><Link href="/login" className="font-bold text-[#e91e8c] hover:underline">← Back to Sign In</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
