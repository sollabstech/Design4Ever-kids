"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { canCancel, canReturn, orderStatus, useStore } from "@/lib/store";
import { EmptyState, fmtDate, Modal, StatusPill } from "@/components/ui";
import { AddressCard, HelpCard, OrderItemsCard, PaymentCard, TrackingCard } from "@/components/order/OrderParts";
import AddressForm from "@/components/account/AddressForm";
import { useBuyAgain } from "@/components/account/OrderRow";

const cancelReasons = ["Ordered by mistake", "Found a better price", "Delivery is taking too long", "Want to change items", "Other"];
const returnReasons = ["Item damaged or defective", "Wrong item received", "Not as described", "No longer needed", "Other"];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder, cancelOrder, requestReturn, updateOrderAddress, reviews } = useStore();
  const buyAgain = useBuyAgain();
  const [dialog, setDialog] = useState<null | "cancel" | "return" | "address">(null);
  const [reason, setReason] = useState("");

  const order = getOrder(id);
  if (!order) return <EmptyState emoji="📦" title="Order not found" text="We couldn't find this order on your account." href="/account/orders" cta="Back to My Orders" />;

  const status = orderStatus(order);
  const reviewed = new Set(reviews.map((r) => r.productId));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link href="/account/orders" className="text-xs font-bold text-gray-400 hover:text-[#e91e8c]">← All Orders</Link>
          <h1 className="text-xl font-black text-[#1a1a2e] mt-1 flex items-center gap-3 flex-wrap">Order #{order.id} <StatusPill status={status} /></h1>
          <p className="text-xs text-gray-500 mt-0.5">Placed on {fmtDate(order.placedAt, true)}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href={`/account/orders/${order.id}/invoice`} className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-[#1a1a2e] hover:border-[#e91e8c] hover:text-[#e91e8c]">📄 Invoice</Link>
          <button onClick={() => buyAgain(order)} className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-[#1a1a2e] hover:border-[#e91e8c] hover:text-[#e91e8c]">🔁 Buy Again</button>
          {canReturn(order) && <button onClick={() => { setReason(""); setDialog("return"); }} className="border-2 border-[#ef6c00] text-[#ef6c00] rounded-xl px-4 py-2 text-sm font-bold hover:bg-[#fff3e0]">↩️ Return</button>}
          {canCancel(order) && <button onClick={() => { setReason(""); setDialog("cancel"); }} className="border-2 border-red-200 text-red-500 rounded-xl px-4 py-2 text-sm font-bold hover:bg-red-50">Cancel Order</button>}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5 items-start">
        <div className="space-y-5">
          <OrderItemsCard order={order} />
          {status === "Delivered" && order.items.some((i) => !reviewed.has(i.productId)) && (
            <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
              <span className="text-sm font-semibold text-[#1a1a2e]">⭐ How did your little one like it? Share a quick review.</span>
              <Link href="/account/reviews" className="bg-[#f59e0b] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#d97706]">Write Reviews</Link>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <AddressCard order={order} onChange={status === "Processing" ? () => setDialog("address") : undefined} />
            <PaymentCard order={order} />
          </div>
        </div>
        <div className="space-y-4">
          <TrackingCard order={order} />
          <HelpCard />
        </div>
      </div>

      {(dialog === "cancel" || dialog === "return") && (
        <Modal title={dialog === "cancel" ? "Cancel this order?" : "Request a return"} onClose={() => setDialog(null)}>
          <p className="text-sm text-gray-500 mb-4">
            {dialog === "cancel"
              ? order.payment.status === "Paid" ? "Your payment will be refunded to the original payment method within 5-7 business days." : "No payment has been collected for this order."
              : "Our courier partner will pick up the item within 2-3 days. Refunds are processed after quality check."}
          </p>
          <div className="space-y-2 mb-5">
            {(dialog === "cancel" ? cancelReasons : returnReasons).map((r) => (
              <label key={r} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${reason === r ? "border-[#e91e8c] bg-[#fff0f7]" : "border-gray-100 hover:border-gray-200"}`}>
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="accent-[#e91e8c]" />
                <span className="text-sm font-semibold text-[#1a1a2e]">{r}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button disabled={!reason} onClick={() => { if (dialog === "cancel") cancelOrder(order.id); else requestReturn(order.id); setDialog(null); }}
              className={`flex-1 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-40 ${dialog === "cancel" ? "bg-red-500 hover:bg-red-600" : "bg-[#ef6c00] hover:bg-[#e65100]"}`}>
              {dialog === "cancel" ? "Yes, Cancel Order" : "Submit Return Request"}
            </button>
            <button onClick={() => setDialog(null)} className="px-5 border-2 border-gray-200 rounded-xl font-bold text-gray-600">Keep Order</button>
          </div>
        </Modal>
      )}

      {dialog === "address" && (
        <Modal title="Change Delivery Address" onClose={() => setDialog(null)}>
          <AddressForm initial={order.address} submitLabel="Update Address" onCancel={() => setDialog(null)}
            onSubmit={(v) => { updateOrderAddress(order.id, v); setDialog(null); }} />
        </Modal>
      )}
    </div>
  );
}
