"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { isEmail } from "@/lib/validate";
import { Field, inputCls } from "@/components/ui";

const topics = ["Order status", "Returns & refunds", "Payment issue", "Product question", "Partnership / Bulk order", "Feedback", "Other"];

export default function ContactForm() {
  const { user, ready } = useStore();
  // Remount once the session loads so signed-in shoppers get their details prefilled.
  return <Form key={ready ? user?.email ?? "guest" : "loading"} initialName={user?.name ?? ""} initialEmail={user?.email ?? ""} />;
}

function Form({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const [v, setV] = useState({ name: initialName, email: initialEmail, topic: "", orderId: "", message: "" });
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState<string | null>(null);
  const { name, email } = v;

  const errors: Record<string, string> = {};
  if (name.trim().length < 2) errors.name = "Please enter your name.";
  if (!isEmail(email)) errors.email = "Enter a valid email address.";
  if (!v.topic) errors.topic = "Please choose a topic.";
  if (v.message.trim().length < 10) errors.message = "Please write at least 10 characters.";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length) return;
    const ticket = `T${Date.now().toString().slice(-6)}`;
    try {
      const list = JSON.parse(localStorage.getItem("d4e:messages") ?? "[]");
      list.push({ ticket, ...v, name, email, at: new Date().toISOString() });
      localStorage.setItem("d4e:messages", JSON.stringify(list));
    } catch { /* ignore */ }
    setSent(ticket);
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="text-6xl mb-3">🚀</div>
        <h2 className="text-2xl font-black text-[#1a1a2e]">Message sent!</h2>
        <p className="text-gray-500 mt-1">Your ticket number is <b className="text-[#1a1a2e]">#{sent}</b>. We&apos;ll reply to <b>{email}</b> within 24 hours.</p>
        <div className="flex justify-center gap-3 mt-6">
          <Link href="/shop" className="bg-[#e91e8c] text-white font-bold px-6 py-3 rounded-full hover:bg-[#c2187a]">Continue Shopping</Link>
          <button onClick={() => { setSent(null); setV({ name: initialName, email: initialEmail, topic: "", orderId: "", message: "" }); setTouched(false); }} className="border-2 border-gray-200 font-bold px-6 py-3 rounded-full">New Message</button>
        </div>
      </div>
    );
  }

  const err = (k: string) => (touched ? errors[k] : undefined);
  return (
    <form onSubmit={submit} noValidate className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Name" required error={err("name")}>
          <input value={name} onChange={(e) => setV((x) => ({ ...x, name: e.target.value }))} placeholder="e.g. Priya" className={`${inputCls} ${err("name") ? "border-red-300" : ""}`} />
        </Field>
        <Field label="Email" required error={err("email")}>
          <input type="email" value={email} onChange={(e) => setV((x) => ({ ...x, email: e.target.value }))} placeholder="you@example.com" className={`${inputCls} ${err("email") ? "border-red-300" : ""}`} />
        </Field>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Topic" required error={err("topic")}>
          <select value={v.topic} onChange={(e) => setV((x) => ({ ...x, topic: e.target.value }))} className={`${inputCls} ${err("topic") ? "border-red-300" : ""}`}>
            <option value="">Select a topic</option>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Order Number" hint="Optional">
          <input value={v.orderId} onChange={(e) => setV((x) => ({ ...x, orderId: e.target.value.toUpperCase() }))} placeholder="e.g. DK100328" className={inputCls} />
        </Field>
      </div>
      <Field label="Message" required error={err("message")}>
        <textarea rows={5} value={v.message} onChange={(e) => setV((x) => ({ ...x, message: e.target.value }))} placeholder="Type your message here..." className={`${inputCls} resize-none ${err("message") ? "border-red-300" : ""}`} />
      </Field>
      <button type="submit" className="w-full sm:w-auto bg-[#e91e8c] hover:bg-[#c2187a] text-white font-black px-10 py-3.5 rounded-full shadow-lg shadow-pink-200">Send Message 🚀</button>
    </form>
  );
}
