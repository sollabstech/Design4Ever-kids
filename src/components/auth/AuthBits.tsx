"use client";

import { useState } from "react";
import { useStore, type SocialProvider } from "@/lib/store";

export const MailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.5 6.5l8.5 6 8.5-6" /></svg>
);
export const LockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2" /><path strokeLinecap="round" d="M8 10.5V7.5a4 4 0 018 0v3" /><circle cx="12" cy="15.5" r="1.2" fill="currentColor" /></svg>
);
export const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path strokeLinecap="round" d="M4.5 20.5c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" /></svg>
);
export const KeyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="8" cy="15" r="4" /><path strokeLinecap="round" strokeLinejoin="round" d="M11 12l8-8m-3 3l2 2m-4 0l2 2" /></svg>
);

/** Input with an icon tile on the left, matching the auth design. */
export function IconInput({ icon, invalid, right, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode; invalid?: boolean; right?: React.ReactNode }) {
  return (
    <div className={`flex items-stretch rounded-xl border bg-white overflow-hidden transition-colors focus-within:border-[#e91e8c] ${invalid ? "border-red-300" : "border-[#d6dbe8]"}`}>
      <span className="w-14 sm:w-16 shrink-0 flex items-center justify-center bg-[#f5f7fb] text-[#14215a]">{icon}</span>
      <input {...props} className="flex-1 min-w-0 px-4 py-4 text-[15px] text-[#14215a] placeholder:text-[#7b86a6] outline-none bg-white" />
      {right}
    </div>
  );
}

export function PasswordField(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & { invalid?: boolean; icon?: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const { icon, ...rest } = props;
  return (
    <IconInput
      {...rest}
      icon={icon ?? <LockIcon />}
      type={show ? "text" : "password"}
      right={
        <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="px-4 text-[#3b4a7a] hover:text-[#e91e8c]">
          {show ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A9.8 9.8 0 0112 5c4.5 0 8.3 2.9 9.5 7-.4 1.4-1.1 2.6-2.1 3.7M6.2 6.2C4.5 7.4 3.2 9.1 2.5 12c1.2 4.1 5 7 9.5 7 1.6 0 3.1-.4 4.4-1" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M2.5 12C3.7 7.9 7.5 5 12 5s8.3 2.9 9.5 7c-1.2 4.1-5 7-9.5 7s-8.3-2.9-9.5-7z" /><circle cx="12" cy="12" r="3" /></svg>
          )}
        </button>
      }
    />
  );
}

export const pinkBtn =
  "w-full rounded-xl bg-gradient-to-r from-[#ff0f5f] to-[#f43f7f] hover:from-[#e60d55] hover:to-[#e8346f] text-white font-bold shadow-lg shadow-pink-200 transition-colors disabled:opacity-60";

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-7">
      <span className="flex-1 h-px bg-[#d6dbe8]" />
      <span className="text-sm text-[#3b4a7a]">{label}</span>
      <span className="flex-1 h-px bg-[#d6dbe8]" />
    </div>
  );
}

const GoogleLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" /><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" /><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" /><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" /></svg>
);
const FacebookLogo = () => (
  <svg className="w-7 h-7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path fill="#fff" d="M15.1 12.6l.4-2.7h-2.6V8.2c0-.7.4-1.5 1.5-1.5h1.2V4.4s-1.1-.2-2.1-.2c-2.2 0-3.6 1.3-3.6 3.7v2h-2.4v2.7h2.4V20h2.9v-7.4h2.3z" /></svg>
);
const AppleLogo = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#111"><path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.45-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.83-.81-3-.79-1.55.02-2.97.9-3.77 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.65zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.01.61-2.66 1.37-.58.67-1.09 1.75-.96 2.79 1.02.08 2.05-.52 2.68-1.27z" /></svg>
);

/** Social login buttons (Firebase popup sign-in; explains itself in demo mode). */
export function SocialButtons() {
  const { socialLogin, toast, backendKind } = useStore();
  const [busy, setBusy] = useState<SocialProvider | null>(null);
  const go = async (p: SocialProvider) => {
    setBusy(p);
    const r = await socialLogin(p);
    setBusy(null);
    if (!r.ok) toast(r.error, backendKind === "local" ? "info" : "error");
  };
  const btn = "flex items-center justify-center gap-2.5 py-3.5 rounded-xl border border-[#d6dbe8] bg-white text-[15px] font-semibold text-[#14215a] hover:border-[#14215a]/40 hover:shadow-sm transition-all";
  return (
    <div className="grid grid-cols-3 gap-3">
      <button type="button" onClick={() => go("google")} disabled={!!busy} className={`${btn} disabled:opacity-60`}><GoogleLogo /><span className="hidden sm:inline">Google</span></button>
      <button type="button" onClick={() => go("facebook")} disabled={!!busy} className={`${btn} disabled:opacity-60`}><FacebookLogo /><span className="hidden sm:inline">Facebook</span></button>
      <button type="button" onClick={() => go("apple")} disabled={!!busy} className={`${btn} disabled:opacity-60`}><AppleLogo /><span className="hidden sm:inline">Apple</span></button>
    </div>
  );
}

export const authLink = "text-[#1a56db] font-semibold underline underline-offset-2 hover:text-[#e91e8c]";
