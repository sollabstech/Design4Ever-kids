"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DEMO_EMAIL, DEMO_PASSWORD, useStore } from "@/lib/store";
import { isEmail, isPhone } from "@/lib/validate";
import { safeNext } from "@/lib/nav";
import { authLink, Divider, IconInput, MailIcon, PasswordField, pinkBtn, SocialButtons } from "@/components/auth/AuthBits";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { ready, user, login, backendKind } = useStore();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(id) && !isPhone(id)) { setError("Enter a valid email address or 10-digit phone number."); return; }
    if (!password) { setError("Please enter your password."); return; }
    setBusy(true);
    const r = await login(id, password, remember);
    if (!r.ok) { setError(r.error); setBusy(false); }
  };

  const signupHref = `/signup${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <>
      <form onSubmit={submit} noValidate className="space-y-5">
        <IconInput icon={<MailIcon />} type="text" inputMode="email" autoComplete="username" aria-label="Email address or phone number"
          placeholder="Email address or phone number" value={id} onChange={(e) => { setId(e.target.value); setError(""); }} invalid={!!error && !password} />
        <PasswordField autoComplete="current-password" aria-label="Password" placeholder="Password"
          value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} />

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-[15px] text-[#14215a]">
            <input type="checkbox" checked={remember} onChange={() => setRemember((r) => !r)} className="w-5 h-5 rounded accent-[#e91e8c]" />
            Remember me
          </label>
          <Link href="/forgot-password" className={authLink}>Forgot Password?</Link>
        </div>

        {error && <div role="alert" className="bg-[#fdecec] text-[#ef4444] text-sm font-semibold rounded-xl px-4 py-2.5">{error}</div>}

        <button type="submit" disabled={busy} className={`${pinkBtn} py-4 text-lg`}>{busy ? "Signing in…" : "Sign In"}</button>
      </form>

      <Divider label="or continue with" />
      <SocialButtons />

      <div className="border-t border-[#eef1f7] mt-8 pt-6 text-center text-[15px] text-[#14215a]">
        Don&apos;t have an account? <Link href={signupHref} className={`${authLink} text-base`}>Create an Account</Link>
      </div>

      {backendKind === "local" && <p className="mt-4 text-center text-xs text-[#7b86a6]">
        Demo: {DEMO_EMAIL} / {DEMO_PASSWORD} ·{" "}
        <button type="button" onClick={() => { setId(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(""); }} className="font-bold text-[#e91e8c] hover:underline">Fill in</button>
      </p>}
    </>
  );
}
