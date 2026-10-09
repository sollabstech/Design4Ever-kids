"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { isEmail, isPhone, passwordIssue } from "@/lib/validate";
import { Field, inputCls } from "@/components/ui";
import PasswordInput from "@/components/auth/PasswordInput";
import { safeNext } from "../login/LoginForm";

export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { ready, user, signup } = useStore();
  const [v, setV] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  const errors: Partial<Record<keyof typeof v | "agree", string>> = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!isEmail(v.email)) errors.email = "Enter a valid email address.";
  if (!isPhone(v.phone)) errors.phone = "Enter a valid 10-digit mobile number.";
  const pw = passwordIssue(v.password);
  if (pw) errors.password = pw;
  if (v.confirm !== v.password) errors.confirm = "Passwords don't match.";
  if (!agree) errors.agree = "Please accept the terms to continue.";

  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement>) => { setV((x) => ({ ...x, [k]: e.target.value })); setError(""); };
  const err = (k: keyof typeof errors) => (touched ? errors[k] : undefined);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;
    const r = signup({ name: v.name, email: v.email, phone: v.phone, password: v.password });
    if (!r.ok) setError(r.error);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <Field label="Full Name" required error={err("name")}>
        <input autoComplete="name" value={v.name} onChange={set("name")} placeholder="e.g. Priya Sharma" className={`${inputCls} ${err("name") ? "border-red-300" : ""}`} />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email Address" required error={err("email")}>
          <input type="email" autoComplete="email" value={v.email} onChange={set("email")} placeholder="you@example.com" className={`${inputCls} ${err("email") ? "border-red-300" : ""}`} />
        </Field>
        <Field label="Mobile Number" required error={err("phone")}>
          <input type="tel" autoComplete="tel" value={v.phone} onChange={set("phone")} placeholder="98765 43210" className={`${inputCls} ${err("phone") ? "border-red-300" : ""}`} />
        </Field>
      </div>
      <Field label="Password" required error={err("password")} hint="At least 8 characters with a letter and a number.">
        <PasswordInput autoComplete="new-password" value={v.password} onChange={set("password")} placeholder="Create a password" invalid={!!err("password")} />
      </Field>
      <Field label="Confirm Password" required error={err("confirm")}>
        <PasswordInput autoComplete="new-password" value={v.confirm} onChange={set("confirm")} placeholder="Re-enter password" invalid={!!err("confirm")} />
      </Field>
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input type="checkbox" checked={agree} onChange={() => setAgree((a) => !a)} className="w-4 h-4 mt-0.5 rounded accent-[#e91e8c]" />
        <span className="text-sm text-gray-600">I agree to the <Link href="/terms" className="text-[#e91e8c] font-bold hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-[#e91e8c] font-bold hover:underline">Privacy Policy</Link>.</span>
      </label>
      {err("agree") && <p className="text-xs text-red-500 font-semibold -mt-2">{err("agree")}</p>}
      {error && <div className="bg-[#fdecec] text-[#ef4444] text-sm font-semibold rounded-xl px-4 py-2.5">{error}</div>}
      <button type="submit" className="w-full bg-[#e91e8c] hover:bg-[#c2187a] text-white font-black py-3.5 rounded-xl transition-colors shadow-lg shadow-pink-200">Create Account</button>
      <p className="text-sm text-gray-500 text-center">
        Already have an account?{" "}
        <Link href={`/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-[#e91e8c] hover:underline">Sign in</Link>
      </p>
    </form>
  );
}
