"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { products } from "@/lib/catalog";
import { orderStatus, useStore } from "@/lib/store";
import { EmptyState, fmtDate, Modal, RecoCard, Spinner } from "@/components/ui";
import { AddressCard, HelpCard, OrderItemsCard, PaymentCard, QuickActions, TrackingCard } from "@/components/order/OrderParts";
import AddressForm from "@/components/account/AddressForm";

export default function ConfirmationClient() {
  const params = useSearchParams();
  const { ready, user, orders, getOrder, updateOrderAddress } = useStore();
  const [editing, setEditing] = useState(false);

  if (!ready) return <Spinner label="Loading your order…" />;
  if (!user) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-12">
        <EmptyState emoji="🔐" title="Please sign in" text="Sign in to view your order confirmation." href="/login?next=/account/orders" cta="Sign In" />
      </div>
    );
  }

  const id = params.get("id");
  const order = id ? getOrder(id) : orders[0];
  if (!order) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-12">
        <EmptyState emoji="📦" title="Order not found" text="We couldn't find that order on your account." href="/account/orders" cta="View My Orders" />
      </div>
    );
  }

  const status = orderStatus(order);
  const firstName = order.customerName.split(" ")[0];
  const bought = new Set(order.items.map((i) => i.productId));
  const reco = products.filter((p) => !bought.has(p.id) && p.stock > 0).sort((a, b) => a.rank - b.rank).slice(0, 5);

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
          {/* LEFT */}
          <div className="space-y-5">
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-[#4caf50] rounded-full flex items-center justify-center shrink-0 shadow-md shadow-green-200">
                  <svg className="w-7 h-7 fill-none stroke-white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#1a1a2e] mb-0.5">Thank you, {firstName}!</h1>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Your order has been placed successfully.</p>
                  <p className="text-xs text-gray-500">We&apos;ve sent an order confirmation to <span className="font-semibold text-gray-700">{order.email}</span></p>
                </div>
              </div>
              <div className="sm:text-right shrink-0 sm:border-l sm:border-green-200 sm:pl-5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Order Number</div>
                <div className="text-base font-black text-[#1a1a2e]">#{order.id}</div>
                <div className="text-[10px] text-gray-400 mt-1">Placed on</div>
                <div className="text-xs font-semibold text-gray-600">{fmtDate(order.placedAt, true)}</div>
              </div>
            </div>

            <OrderItemsCard order={order} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <AddressCard order={order} onChange={status === "Processing" ? () => setEditing(true) : undefined} />
              <PaymentCard order={order} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">
            <TrackingCard order={order} />
            <HelpCard />
            <QuickActions order={order} />
          </div>
        </div>
      </div>

      {/* Promo strip */}
      <div className="w-full bg-[#e91e8c]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div>
            <div className="text-xl sm:text-2xl font-black">🎁 Get 10% off your next order!</div>
            <div className="text-sm opacity-90 mt-1">Use code <span className="font-black tracking-wider bg-white/20 px-2 py-0.5 rounded">KIDS10</span> at checkout. Valid on all products.</div>
          </div>
          <Link href="/offers" className="bg-white text-[#e91e8c] font-black px-6 py-3 rounded-full hover:bg-pink-50 transition-colors whitespace-nowrap">See All Offers →</Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#1a1a2e] flex items-center gap-2">You May Also Like <span className="text-yellow-400">✦</span></h2>
          <Link href="/shop" className="text-sm font-bold text-[#1e88e5] hover:underline flex items-center gap-1">View All →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {reco.map((p) => <RecoCard key={p.id} product={p} />)}
        </div>
      </div>

      {editing && (
        <Modal title="Change Delivery Address" onClose={() => setEditing(false)}>
          <AddressForm initial={order.address} submitLabel="Update Address" onCancel={() => setEditing(false)}
            onSubmit={(v) => { updateOrderAddress(order.id, v); setEditing(false); }} />
        </Modal>
      )}
    </>
  );
}
