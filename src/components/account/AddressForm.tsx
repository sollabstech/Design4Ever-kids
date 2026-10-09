"use client";

import { useState } from "react";
import { indianStates } from "@/lib/catalog";
import type { Address } from "@/lib/store";
import { isPhone, isPincode } from "@/lib/validate";
import { Field, inputCls } from "@/components/ui";

export type AddressValues = Omit<Address, "id" | "isDefault">;

export const blankAddress: AddressValues = { label: "Home", name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" };

export function addressErrors(a: AddressValues) {
  const e: Partial<Record<keyof AddressValues, string>> = {};
  if (a.name.trim().length < 2) e.name = "Please enter the full name.";
  if (!isPhone(a.phone)) e.phone = "Enter a valid 10-digit mobile number.";
  if (a.line1.trim().length < 5) e.line1 = "Please enter house no. and street.";
  if (a.city.trim().length < 2) e.city = "Please enter a city.";
  if (!a.state) e.state = "Please select a state.";
  if (!isPincode(a.pincode)) e.pincode = "Enter a valid 6-digit pincode.";
  return e;
}

export default function AddressForm({
  initial,
  submitLabel = "Save Address",
  showDefault,
  initialDefault = false,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<AddressValues>;
  submitLabel?: string;
  showDefault?: boolean;
  initialDefault?: boolean;
  onSubmit: (values: AddressValues, makeDefault: boolean) => void;
  onCancel?: () => void;
}) {
  const [v, setV] = useState<AddressValues>({ ...blankAddress, ...initial });
  const [makeDefault, setMakeDefault] = useState(initialDefault);
  const [touched, setTouched] = useState(false);
  const errors = addressErrors(v);
  const err = (k: keyof AddressValues) => (touched ? errors[k] : undefined);
  const cls = (k: keyof AddressValues) => `${inputCls} ${err(k) ? "border-red-300" : ""}`;
  const set = (k: keyof AddressValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setV((x) => ({ ...x, [k]: k === "pincode" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;
    onSubmit({ ...v, name: v.name.trim(), line1: v.line1.trim(), line2: v.line2?.trim(), city: v.city.trim(), phone: v.phone.trim() }, makeDefault);
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {(["Home", "Work", "Other"] as const).map((l) => (
          <button key={l} type="button" onClick={() => setV((x) => ({ ...x, label: l }))}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${v.label === l ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "border-gray-200 text-gray-600 hover:border-[#e91e8c]"}`}>
            {l === "Home" ? "🏠" : l === "Work" ? "🏢" : "📍"} {l}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" required error={err("name")}><input value={v.name} onChange={set("name")} autoComplete="name" placeholder="Enter full name" className={cls("name")} /></Field>
        <Field label="Phone Number" required error={err("phone")}><input type="tel" value={v.phone} onChange={set("phone")} autoComplete="tel" placeholder="Enter phone number" className={cls("phone")} /></Field>
      </div>
      <Field label="Address" required error={err("line1")}><input value={v.line1} onChange={set("line1")} autoComplete="address-line1" placeholder="House No, Building Name, Street Name" className={cls("line1")} /></Field>
      <Field label="Area / Landmark"><input value={v.line2 ?? ""} onChange={set("line2")} autoComplete="address-line2" placeholder="Optional" className={inputCls} /></Field>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="City" required error={err("city")}><input value={v.city} onChange={set("city")} autoComplete="address-level2" placeholder="Enter city" className={cls("city")} /></Field>
        <Field label="State" required error={err("state")}>
          <select value={v.state} onChange={set("state")} className={cls("state")}>
            <option value="">Select state</option>
            {indianStates.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Pincode" required error={err("pincode")}><input inputMode="numeric" value={v.pincode} onChange={set("pincode")} autoComplete="postal-code" placeholder="6-digit pincode" className={cls("pincode")} /></Field>
      </div>
      {showDefault && (
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" checked={makeDefault} onChange={() => setMakeDefault((x) => !x)} className="w-4 h-4 rounded accent-[#e91e8c]" />
          <span className="text-sm text-gray-600">Make this my default address</span>
        </label>
      )}
      <div className="flex gap-3 pt-1">
        <button type="submit" className="flex-1 bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold py-3 rounded-xl transition-colors">{submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel} className="px-6 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:border-gray-300">Cancel</button>}
      </div>
    </form>
  );
}
