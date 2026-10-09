"use client";

import { useState } from "react";
import { categories } from "@/lib/catalog";
import { isEmail, isPhone } from "@/lib/validate";
import { Field, inputCls } from "@/components/ui";
import PasswordInput from "@/components/auth/PasswordInput";

const GST_RE = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export default function VendorForms() {
  const [v, setV] = useState({ business: "", contact: "", email: "", phone: "", city: "", gst: "", category: "", catalogSize: "", about: "" });
  const [touched, setTouched] = useState(false);
  const [applied, setApplied] = useState<string | null>(null);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [loginMsg, setLoginMsg] = useState("");

  const errors: Record<string, string> = {};
  if (v.business.trim().length < 2) errors.business = "Enter your business name.";
  if (v.contact.trim().length < 2) errors.contact = "Enter a contact person.";
  if (!isEmail(v.email)) errors.email = "Enter a valid email.";
  if (!isPhone(v.phone)) errors.phone = "Enter a valid mobile number.";
  if (v.city.trim().length < 2) errors.city = "Enter your city.";
  if (v.gst && !GST_RE.test(v.gst.trim().toUpperCase())) errors.gst = "Enter a valid 15-character GSTIN.";
  if (!v.category) errors.category = "Choose a primary category.";
  const err = (k: string) => (touched ? errors[k] : undefined);
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }));

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;
    const ref = `VEN${Date.now().toString().slice(-6)}`;
    try {
      const list = JSON.parse(localStorage.getItem("d4e:vendor-applications") ?? "[]");
      list.push({ ref, ...v, gst: v.gst.toUpperCase(), at: new Date().toISOString() });
      localStorage.setItem("d4e:vendor-applications", JSON.stringify(list));
    } catch { /* ignore */ }
    setApplied(ref);
  };

  const vendorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(login.email) || !login.password) { setLoginMsg("Enter your registered email and password."); return; }
    let pending = false;
    try {
      const list: { email: string }[] = JSON.parse(localStorage.getItem("d4e:vendor-applications") ?? "[]");
      pending = list.some((a) => a.email.toLowerCase() === login.email.trim().toLowerCase());
    } catch { /* ignore */ }
    setLoginMsg(pending
      ? "Your application is still under review. We'll email your vendor dashboard access once approved (2–3 business days)."
      : "No approved vendor account found for this email. Please register below.");
  };

  const cls = (k: string) => `${inputCls} ${err(k) ? "border-red-300" : ""}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
      <div id="register" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 scroll-mt-32">
        {applied ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-3">🎉</div>
            <h2 className="text-2xl font-black text-[#1a1a2e]">Application received!</h2>
            <p className="text-gray-500 mt-1">Reference <b className="text-[#1a1a2e]">#{applied}</b>. Our partner team will contact <b>{v.email}</b> within 2–3 business days.</p>
          </div>
        ) : (
          <form onSubmit={apply} noValidate className="space-y-4">
            <h2 className="text-xl font-black text-[#1a1a2e]">Vendor Registration</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Business Name" required error={err("business")}><input value={v.business} onChange={set("business")} className={cls("business")} /></Field>
              <Field label="Contact Person" required error={err("contact")}><input value={v.contact} onChange={set("contact")} className={cls("contact")} /></Field>
              <Field label="Business Email" required error={err("email")}><input type="email" value={v.email} onChange={set("email")} className={cls("email")} /></Field>
              <Field label="Mobile Number" required error={err("phone")}><input type="tel" value={v.phone} onChange={set("phone")} className={cls("phone")} /></Field>
              <Field label="City" required error={err("city")}><input value={v.city} onChange={set("city")} className={cls("city")} /></Field>
              <Field label="GSTIN" error={err("gst")} hint="Optional for now, required before your first payout."><input value={v.gst} onChange={set("gst")} maxLength={15} className={`${cls("gst")} uppercase`} /></Field>
              <Field label="Primary Category" required error={err("category")}>
                <select value={v.category} onChange={set("category")} className={cls("category")}>
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.label}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Number of Products">
                <select value={v.catalogSize} onChange={set("catalogSize")} className={inputCls}>
                  <option value="">Select</option>
                  <option>1 - 10</option><option>11 - 50</option><option>51 - 200</option><option>200+</option>
                </select>
              </Field>
            </div>
            <Field label="Tell us about your products"><textarea rows={3} value={v.about} onChange={set("about")} className={`${inputCls} resize-none`} /></Field>
            <button type="submit" className="bg-[#e91e8c] hover:bg-[#c2187a] text-white font-black px-8 py-3.5 rounded-xl shadow-lg shadow-pink-200">Submit Application</button>
          </form>
        )}
      </div>

      <div id="vendor-login" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 scroll-mt-32">
        <h2 className="text-lg font-black text-[#1a1a2e]">Vendor Login</h2>
        <p className="text-xs text-gray-500 mb-4">Already a partner? Sign in to your vendor dashboard.</p>
        <form onSubmit={vendorLogin} noValidate className="space-y-3">
          <input type="email" value={login.email} onChange={(e) => { setLogin((x) => ({ ...x, email: e.target.value })); setLoginMsg(""); }} placeholder="Registered email" className={inputCls} />
          <PasswordInput value={login.password} onChange={(e) => { setLogin((x) => ({ ...x, password: e.target.value })); setLoginMsg(""); }} placeholder="Password" />
          {loginMsg && <p className="text-xs font-semibold text-[#ef6c00] bg-[#fff3e0] rounded-xl p-3">{loginMsg}</p>}
          <button type="submit" className="w-full bg-[#1a1a2e] hover:bg-black text-white font-bold py-3 rounded-xl">Sign In</button>
        </form>
      </div>
    </div>
  );
}
