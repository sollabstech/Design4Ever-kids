"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { isEmail, isPhone, passwordIssue } from "@/lib/validate";
import { safeNext } from "@/lib/nav";
import { authLink, Divider, IconInput, KeyIcon, MailIcon, PasswordField, pinkBtn, SocialButtons, UserIcon } from "@/components/auth/AuthBits";

const RESEND_SECONDS = 30;

export default function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const { ready, user, startSignup, completeSignup, toast } = useStore();

  const [name, setName] = useState("");
  const [id, setId] = useState("");
  // After "Get OTP": how the code was sent. "demo" shows the code on screen (no backend yet);
  // "sms" is a real Firebase SMS; "email" skips the code and sends a verification link after sign-up.
  const [channel, setChannel] = useState<null | "sms" | "email" | "demo">(null);
  const [demoCode, setDemoCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState<null | "otp" | "create">(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, next, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const clear = (k: string) => setErrors((e) => { const n = { ...e }; delete n[k]; delete n.form; return n; });

  const getOtp = async () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your full name.";
    if (!isEmail(id) && !isPhone(id)) e.id = "Enter a valid email or 10-digit phone number.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy("otp");
    const r = await startSignup({ name, identifier: id, recaptchaContainerId: "recaptcha-container" });
    setBusy(null);
    if (!r.ok) { setErrors({ id: r.error }); return; }
    setChannel(r.channel);
    setDemoCode(r.demoCode ?? "");
    setSentTo(id.trim());
    setOtp("");
    if (r.channel !== "email") {
      setCooldown(RESEND_SECONDS);
      toast(`OTP sent to ${id.trim()}`, "info");
    }
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e: Record<string, string> = {};
    if (!channel) e.form = "Tap “Get OTP” to verify your email or phone first.";
    else {
      if (id.trim() !== sentTo) e.id = "You changed this — tap Get OTP again.";
      if (channel !== "email" && otp.length !== 6) e.otp = "Enter the 6-digit OTP.";
      const pw = passwordIssue(password);
      if (pw) e.password = pw;
    }
    if (!agree) e.agree = "Please accept the Terms & Conditions and Privacy Policy.";
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy("create");
    const r = await completeSignup({ name, identifier: id, password, code: otp });
    setBusy(null);
    if (!r.ok) setErrors(/otp/i.test(r.error) ? { otp: r.error } : { form: r.error });
    else toast(channel === "email" ? "Welcome! Check your inbox to verify your email. 🎉" : "Welcome to Design4Ever! 🎉");
  };

  const loginHref = `/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`;
  const errText = (k: string) => errors[k] && <p className="text-xs text-red-500 font-semibold mt-1.5">{errors[k]}</p>;

  return (
    <>
      <form onSubmit={submit} noValidate className="space-y-5">
        <div>
          <IconInput icon={<UserIcon />} autoComplete="name" aria-label="Full Name" placeholder="Full Name   (e.g. Priya S)"
            value={name} onChange={(e) => { setName(e.target.value); clear("name"); }} invalid={!!errors.name} />
          {errText("name")}
        </div>
        <div>
          <IconInput icon={<MailIcon />} inputMode="email" autoComplete="username" aria-label="Email or Phone Number" placeholder="Email or Phone Number"
            value={id} onChange={(e) => { setId(e.target.value); clear("id"); }} invalid={!!errors.id} />
          {errText("id")}
          {!errors.id && !channel && <p className="text-xs text-[#7b86a6] mt-1.5 ml-1">e.g. priya@example.com or +91 98765 43210</p>}
        </div>

        {!channel ? (
          <button type="button" onClick={getOtp} disabled={busy === "otp"} className={`${pinkBtn} py-4 text-xl font-black`}>{busy === "otp" ? "Sending…" : "Get OTP"}</button>
        ) : (
          <div className="rounded-2xl bg-[#f5f7fb] p-4 space-y-4">
            {channel === "email" ? (
              <p className="text-sm text-[#3b4a7a]">Create a password for <b className="text-[#14215a]">{sentTo}</b>. We&apos;ll email you a link to verify your address.</p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-[#3b4a7a]">Code sent to <b className="text-[#14215a]">{sentTo}</b></span>
                  <button type="button" disabled={cooldown > 0 || busy === "otp"} onClick={getOtp} className="font-bold text-[#e91e8c] disabled:text-[#7b86a6]">
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                  </button>
                </div>
                <div>
                  <IconInput icon={<KeyIcon />} inputMode="numeric" autoComplete="one-time-code" aria-label="6-digit OTP" placeholder="Enter 6-digit OTP" maxLength={6}
                    value={otp} onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); clear("otp"); }} invalid={!!errors.otp} />
                  {errText("otp")}
                  {channel === "demo" && <p className="text-[11px] text-[#7b86a6] mt-1.5 ml-1">Demo mode — your OTP is <b className="text-[#14215a] tracking-widest">{demoCode}</b></p>}
                </div>
              </>
            )}
            <div>
              <PasswordField autoComplete="new-password" aria-label="Create a password" placeholder="Create a password"
                value={password} onChange={(e) => { setPassword(e.target.value); clear("password"); }} invalid={!!errors.password} />
              {errors.password ? errText("password") : <p className="text-[11px] text-[#7b86a6] mt-1.5 ml-1">At least 8 characters with a letter and a number.</p>}
            </div>
          </div>
        )}
        {/* Invisible reCAPTCHA used by Firebase phone sign-up */}
        <div id="recaptcha-container" />

        <div>
          <label className="flex items-start gap-3 cursor-pointer select-none text-[15px] text-[#14215a]">
            <input type="checkbox" checked={agree} onChange={() => { setAgree((a) => !a); clear("agree"); }} className="w-5 h-5 mt-0.5 rounded accent-[#e91e8c] shrink-0" />
            <span>I agree to the <Link href="/terms" className={authLink}>Terms &amp; Conditions</Link> and <Link href="/privacy" className={authLink}>Privacy Policy</Link></span>
          </label>
          {errText("agree")}
        </div>

        {errors.form && <div role="alert" className="bg-[#fdecec] text-[#ef4444] text-sm font-semibold rounded-xl px-4 py-2.5">{errors.form}</div>}

        <button type="submit" disabled={busy === "create"} className={`${pinkBtn} py-4 text-lg`}>{busy === "create" ? "Creating account…" : "Create Account"}</button>
      </form>

      <Divider label="or sign up with" />
      <SocialButtons />

      <p className="text-center text-[15px] text-[#14215a] mt-8">
        Already have an account? <Link href={loginHref} className={`${authLink} text-base`}>Sign In</Link>
      </p>
    </>
  );
}
