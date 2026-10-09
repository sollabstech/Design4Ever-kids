"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_EMAIL, DEMO_PASSWORD, useStore } from "@/lib/store";
import { isEmail } from "@/lib/validate";
import { Field, inputCls } from "@/components/ui";
import PasswordInput from "@/components/auth/PasswordInput";

export function safeNext(next: string | null) {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { ready, user, login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) { setError("Please enter a valid email address."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setBusy(true);
    const r = login(email, password);
    if (!r.ok) { setError(r.error); setBusy(false); }
  };

  return (
    <>
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Email Address" required>
          <input type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@example.com" className={inputCls} />
        </Field>
        <Field label="Password" required>
          <PasswordInput autoComplete="current-password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Enter your password" />
        </Field>
        <div className="flex justify-end -mt-1">
          <Link href="/forgot-password" className="text-xs font-bold text-[#e91e8c] hover:underline">Forgot password?</Link>
        </div>
        {error && <div className="bg-[#fdecec] text-[#ef4444] text-sm font-semibold rounded-xl px-4 py-2.5">{error}</div>}
        <button type="submit" disabled={busy} className="w-full bg-[#e91e8c] hover:bg-[#c2187a] text-white font-black py-3.5 rounded-xl transition-colors shadow-lg shadow-pink-200 disabled:opacity-60">
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <div className="mt-5 bg-[#fffde7] border border-[#fff59d] rounded-xl p-3 text-xs text-gray-600 flex items-center justify-between gap-3 flex-wrap">
        <span>🧪 Demo account: <b>{DEMO_EMAIL}</b> / <b>{DEMO_PASSWORD}</b></span>
        <button type="button" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(""); }} className="font-bold text-[#e91e8c] hover:underline">Fill in</button>
      </div>

      <p className="text-sm text-gray-500 text-center mt-6">
        New to Design4Ever?{" "}
        <Link href={`/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-[#e91e8c] hover:underline">Create an account</Link>
      </p>
    </>
  );
}
