"use client";

import { useState } from "react";
import Link from "next/link";
import { orderStatus, useStore, type Order } from "@/lib/store";
import { Field, inputCls, StatusPill, fmtDate } from "@/components/ui";
import { OrderItemsCard, TrackingCard } from "@/components/order/OrderParts";

export default function TrackForm() {
  const { user, orders, findOrder, backendKind } = useStore();
  const [busy, setBusy] = useState(false);
  const [id, setId] = useState("");
  const [contact, setContact] = useState("");
  const [result, setResult] = useState<Order | null | "none">(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim() || !contact.trim()) return;
    setBusy(true);
    setResult((await findOrder(id, contact)) ?? "none");
    setBusy(false);
  };
  const needsSignIn = backendKind === "firebase" && !user;

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <form onSubmit={submit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
        <Field label="Order Number" required>
          <input value={id} onChange={(e) => setId(e.target.value.toUpperCase())} placeholder="e.g. DK100328" className={inputCls} />
        </Field>
        <Field label="Email or Phone" required>
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@example.com" className={inputCls} />
        </Field>
        <button type="submit" disabled={busy || needsSignIn} className="bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold px-6 py-3 rounded-xl disabled:opacity-50">{busy ? "Tracking…" : "Track"}</button>
      </form>

      {needsSignIn && (
        <div className="bg-[#fff0f7] rounded-2xl p-4 text-sm font-semibold text-[#1a1a2e] flex items-center justify-between gap-3 flex-wrap">
          For your privacy, please sign in to track your orders.
          <Link href="/login?next=/track-order" className="bg-[#e91e8c] text-white font-bold px-4 py-2 rounded-xl hover:bg-[#c2187a]">Sign In</Link>
        </div>
      )}

      {result === "none" && (
        <div className="bg-[#fdecec] text-[#ef4444] rounded-2xl p-4 text-sm font-semibold">We couldn&apos;t find an order with those details. Please check the order number and the email/phone used at checkout.</div>
      )}

      {result && result !== "none" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="text-lg font-black text-[#1a1a2e]">Order #{result.id}</div>
              <div className="text-xs text-gray-500">Placed {fmtDate(result.placedAt, true)}</div>
            </div>
            <StatusPill status={orderStatus(result)} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
            <OrderItemsCard order={result} />
            <TrackingCard order={result} />
          </div>
        </div>
      )}

      {user && orders.length > 0 && !result && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-[#1a1a2e] mb-3">Your recent orders</h2>
          <div className="divide-y divide-gray-100">
            {orders.slice(0, 4).map((o) => (
              <Link key={o.id} href={`/account/orders/${o.id}`} className="flex items-center justify-between py-3 hover:text-[#e91e8c]">
                <span className="text-sm font-bold">#{o.id} <span className="text-gray-400 font-semibold">· {fmtDate(o.placedAt)}</span></span>
                <StatusPill status={orderStatus(o)} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
