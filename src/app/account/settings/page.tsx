"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, type Settings } from "@/lib/store";
import { passwordIssue } from "@/lib/validate";
import { Field, Modal } from "@/components/ui";
import PasswordInput from "@/components/auth/PasswordInput";

const toggles: { key: keyof Settings; label: string; desc: string }[] = [
  { key: "orderEmails", label: "Order updates by email", desc: "Confirmation, shipping and delivery emails." },
  { key: "smsUpdates", label: "SMS & WhatsApp updates", desc: "Delivery alerts on your mobile." },
  { key: "offers", label: "Offers & discounts", desc: "Be the first to know about sales and coupons." },
  { key: "newsletter", label: "Parenting newsletter", desc: "Monthly tips, activities and new arrivals." },
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`w-12 h-7 rounded-full p-1 transition-colors shrink-0 ${on ? "bg-[#e91e8c]" : "bg-gray-200"}`}>
      <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings, changePassword, deleteAccount, toast, user } = useStore();
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwError, setPwError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const submitPw = (e: React.FormEvent) => {
    e.preventDefault();
    const issue = passwordIssue(pw.next);
    if (!pw.current) return setPwError("Enter your current password.");
    if (issue) return setPwError(issue);
    if (pw.next !== pw.confirm) return setPwError("New passwords don't match.");
    const r = changePassword(pw.current, pw.next);
    if (!r.ok) return setPwError(r.error);
    setPw({ current: "", next: "", confirm: "" });
    setPwError("");
    toast("Password changed successfully");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="px-5 sm:px-6 py-5 border-b border-gray-100"><h1 className="text-xl font-black text-[#1a1a2e]">Notifications</h1></div>
        <div className="divide-y divide-gray-100">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4">
              <div>
                <div className="text-sm font-bold text-[#1a1a2e]">{t.label}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </div>
              <Toggle label={t.label} on={settings[t.key]} onChange={() => { updateSettings({ [t.key]: !settings[t.key] }); toast("Preferences saved", "info"); }} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="px-5 sm:px-6 py-5 border-b border-gray-100"><h2 className="text-lg font-black text-[#1a1a2e]">Change Password</h2></div>
        <form onSubmit={submitPw} noValidate className="p-5 sm:p-6 space-y-4 max-w-md">
          <Field label="Current Password"><PasswordInput autoComplete="current-password" value={pw.current} onChange={(e) => { setPw((x) => ({ ...x, current: e.target.value })); setPwError(""); }} /></Field>
          <Field label="New Password" hint="At least 8 characters with a letter and a number."><PasswordInput autoComplete="new-password" value={pw.next} onChange={(e) => { setPw((x) => ({ ...x, next: e.target.value })); setPwError(""); }} /></Field>
          <Field label="Confirm New Password"><PasswordInput autoComplete="new-password" value={pw.confirm} onChange={(e) => { setPw((x) => ({ ...x, confirm: e.target.value })); setPwError(""); }} /></Field>
          {pwError && <p className="text-sm text-red-500 font-semibold">{pwError}</p>}
          <button type="submit" className="bg-[#1a1a2e] hover:bg-black text-white font-bold px-6 py-3 rounded-xl">Update Password</button>
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-red-100 shadow-sm p-5 sm:p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-black text-red-500">Delete Account</h2>
          <p className="text-sm text-gray-500">Permanently remove your account, orders, addresses and wishlist from this device.</p>
        </div>
        <button onClick={() => setConfirmDelete(true)} className="border-2 border-red-200 text-red-500 font-bold px-5 py-2.5 rounded-xl hover:bg-red-50">Delete Account</button>
      </div>

      {confirmDelete && (
        <Modal title="Delete your account?" onClose={() => setConfirmDelete(false)}>
          <p className="text-sm text-gray-500 mb-4">This can&apos;t be undone. Type <b>DELETE</b> to confirm deleting <b>{user?.email}</b>.</p>
          <input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400 mb-4" />
          <button disabled={deleteText !== "DELETE"} onClick={() => { deleteAccount(); router.push("/"); }} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl disabled:opacity-40">Permanently Delete</button>
        </Modal>
      )}
    </div>
  );
}
