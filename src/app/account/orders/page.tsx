"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { orderStatus, useStore } from "@/lib/store";
import { OrderRow } from "@/components/account/OrderRow";
import { EmptyState } from "@/components/ui";

const tabs = [
  { id: "all", label: "All Orders" },
  { id: "active", label: "Active" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled / Returns" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function OrdersList() {
  const params = useSearchParams();
  const router = useRouter();
  const { orders } = useStore();
  const tabParam = params.get("tab") as TabId | null;
  const tab: TabId = tabs.some((t) => t.id === tabParam) ? tabParam! : "all";
  const [q, setQ] = useState("");

  const match = (id: TabId, s: string) =>
    id === "all" ||
    (id === "active" && ["Processing", "Shipped", "Out for Delivery"].includes(s)) ||
    (id === "delivered" && s === "Delivered") ||
    (id === "cancelled" && (s === "Cancelled" || s === "Return Requested"));

  const list = orders.filter((o) => {
    if (!match(tab, orderStatus(o))) return false;
    const s = q.trim().toLowerCase();
    return !s || o.id.toLowerCase().includes(s) || o.items.some((i) => i.name.toLowerCase().includes(s));
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-xl font-black text-[#1a1a2e]">My Orders <span className="text-gray-400 text-base font-semibold">({orders.length})</span></h1>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order ID or product…" aria-label="Search orders"
            className="w-full sm:w-72 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#e91e8c]" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {tabs.map((t) => {
            const count = orders.filter((o) => match(t.id, orderStatus(o))).length;
            return (
              <button key={t.id} onClick={() => router.replace(t.id === "all" ? "/account/orders" : `/account/orders?tab=${t.id}`)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap border transition-colors ${tab === t.id ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "border-gray-200 text-[#1a1a2e] hover:border-[#e91e8c]"}`}>
                {t.label} <span className={tab === t.id ? "opacity-80" : "text-gray-400"}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-5 sm:px-6 divide-y divide-gray-100">
        {list.length ? list.map((o) => <OrderRow key={o.id} order={o} />) : (
          <div className="py-6">
            <EmptyState emoji="📦" title={orders.length ? "No orders here" : "No orders yet"} text={orders.length ? "Try another tab or search term." : "When you place an order it will appear here."} href="/shop" cta="Start Shopping" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersList />
    </Suspense>
  );
}
