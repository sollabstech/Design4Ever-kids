"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { isPhone } from "@/lib/validate";
import { Field, fmtDate, inputCls } from "@/components/ui";
import { Avatar } from "@/components/account/Avatar";

const avatars = ["👧", "👦", "🧒", "👩", "👨", "🦄", "🐻", "🐼", "🦁", "🐰", "🚀", "🌈"];

export default function ProfilePage() {
  const { user, updateProfile, toast, orders } = useStore();
  const [v, setV] = useState({ name: user!.name, phone: user!.phone, childName: user!.childName ?? "", avatar: user!.avatar });
  const [touched, setTouched] = useState(false);

  const errors: { name?: string; phone?: string } = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!isPhone(v.phone)) errors.phone = "Enter a valid 10-digit mobile number.";

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;
    updateProfile({ name: v.name.trim(), phone: v.phone.trim(), childName: v.childName.trim() || undefined, avatar: v.avatar });
    toast("Profile updated");
  };

  const spent = orders.filter((o) => !o.manualStatus).reduce((s, o) => s + o.total, 0);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
        <h1 className="text-xl font-black text-[#1a1a2e]">My Profile</h1>
      </div>
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <div className="flex flex-col items-center text-center">
          <Avatar name={v.name || "?"} avatar={v.avatar} size={110} />
          <div className="font-black text-[#1a1a2e] mt-3">{user!.name}</div>
          <div className="text-xs text-gray-400">Member since {fmtDate(user!.joinedAt)}</div>
          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            <div className="bg-[#fff0f5] rounded-xl p-2"><div className="font-black text-[#1a1a2e]">{orders.length}</div><div className="text-[10px] text-gray-500 font-semibold">Orders</div></div>
            <div className="bg-[#effaf3] rounded-xl p-2"><div className="font-black text-[#1a1a2e]">₹{spent.toLocaleString("en-IN")}</div><div className="text-[10px] text-gray-500 font-semibold">Spent</div></div>
          </div>
          <div className="mt-5 w-full">
            <div className="text-xs font-semibold text-gray-500 mb-2">Choose an avatar</div>
            <div className="grid grid-cols-6 gap-1.5">
              <button type="button" onClick={() => setV((x) => ({ ...x, avatar: undefined }))} className={`aspect-square rounded-xl text-xs font-black border-2 ${!v.avatar ? "border-[#e91e8c] bg-[#fff0f7] text-[#e91e8c]" : "border-gray-100 text-gray-400"}`}>{(v.name || "?").charAt(0).toUpperCase()}</button>
              {avatars.map((a) => (
                <button key={a} type="button" onClick={() => setV((x) => ({ ...x, avatar: a }))} className={`aspect-square rounded-xl text-lg border-2 ${v.avatar === a ? "border-[#e91e8c] bg-[#fff0f7]" : "border-gray-100 hover:border-gray-200"}`}>{a}</button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={save} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required error={touched ? errors.name : undefined}>
              <input value={v.name} onChange={(e) => setV((x) => ({ ...x, name: e.target.value }))} className={inputCls} />
            </Field>
            <Field label="Mobile Number" required error={touched ? errors.phone : undefined}>
              <input type="tel" value={v.phone} onChange={(e) => setV((x) => ({ ...x, phone: e.target.value }))} className={inputCls} />
            </Field>
          </div>
          <Field label="Email Address" hint="Contact support to change the email on your account.">
            <input value={user!.email || "Not added (signed up with phone)"} disabled className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
          </Field>
          <Field label="Child's Name" hint="Optional — helps us recommend age-appropriate picks.">
            <input value={v.childName} onChange={(e) => setV((x) => ({ ...x, childName: e.target.value }))} placeholder="e.g. Aarav" className={inputCls} />
          </Field>
          <button type="submit" className="bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-pink-200">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
