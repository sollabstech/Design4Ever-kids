"use client";

import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { authLink, IconInput, MailIcon, pinkBtn } from "@/components/auth/AuthBits";
import { isEmail, isPhone } from "@/lib/validate";
import { useStore } from "@/lib/store";

export default function ForgotPasswordPage() {
  const [id, setId] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { resetPassword } = useStore();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(id) && !isPhone(id)) { setError("Enter a valid email address or 10-digit phone number."); return; }
    setBusy(true);
    const r = await resetPassword(id);
    setBusy(false);
    if (r.ok) setSent(true);
    else setError(r.error);
  };

  return (
    <AuthShell title="Forgot Password?" subtitle="Enter your email or phone and we'll send you a reset link.">
      {sent ? (
        <div className="text-center py-4">
          <div className="text-5xl mb-3">📬</div>
          <h2 className="font-black text-[#14215a] text-lg">Check your inbox</h2>
          <p className="text-sm text-[#3b4a7a] mt-1">If an account exists for <b>{id}</b>, you&apos;ll receive a reset link shortly.</p>
          <Link href="/login" className={`${pinkBtn} inline-block mt-6 py-3.5`}>Back to Sign In</Link>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-5">
          <div>
            <IconInput icon={<MailIcon />} inputMode="email" autoComplete="username" aria-label="Email address or phone number" placeholder="Email address or phone number"
              value={id} onChange={(e) => { setId(e.target.value); setError(""); }} invalid={!!error} />
            {error && <p className="text-xs text-red-500 font-semibold mt-1.5">{error}</p>}
          </div>
          <button type="submit" disabled={busy} className={`${pinkBtn} py-4 text-lg`}>{busy ? "Sending…" : "Send Reset Link"}</button>
          <p className="text-center text-[15px]"><Link href="/login" className={authLink}>← Back to Sign In</Link></p>
        </form>
      )}
    </AuthShell>
  );
}
