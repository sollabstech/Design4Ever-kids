"use client";

import Image from "next/image";
import Link from "next/link";
import { formatINR, shippingMethods } from "@/lib/catalog";
import { expectedDelivery, orderStatus, orderTimeline, type Order } from "@/lib/store";
import { fmtDate } from "@/components/ui";

const stepDesc: Record<string, string> = {
  "Order Placed": "We've received your order.",
  Processing: "Your order is being prepared by our team.",
  Shipped: "Your package is on its way to the delivery hub.",
  "Out for Delivery": "On the way to your location.",
  Delivered: "Enjoy your purchase!\nWe hope it brings a smile 😊",
};

export function OrderItemsCard({ order }: { order: Order }) {
  const count = order.items.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-black text-[#1a1a2e] text-base">Order Details</h2>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-400 font-semibold">{count} {count === 1 ? "item" : "items"}</span>
          <span className="w-px h-4 bg-gray-200" />
          <span className="font-black text-[#1a1a2e]">{formatINR(order.total)}</span>
        </div>
      </div>

      <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wide">
        <div>Product</div>
        <div className="text-center w-20">Quantity</div>
        <div className="text-center w-16">Price</div>
        <div className="text-center w-16">Total</div>
      </div>

      <div className="divide-y divide-gray-50">
        {order.items.map((item) => (
          <div key={item.productId} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4">
            <div className="flex items-center gap-3 min-w-0">
              <Link href={`/shop/${item.productId}`} className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </Link>
              <div className="min-w-0">
                <Link href={`/shop/${item.productId}`} className="text-sm font-bold text-[#1a1a2e] leading-tight hover:text-[#e91e8c] line-clamp-2">{item.name}</Link>
                <div className="text-xs text-gray-400 mt-0.5">{item.category}<span className="sm:hidden"> · Qty {item.qty} × {formatINR(item.price)}</span></div>
              </div>
            </div>
            <div className="hidden sm:block w-20 text-center text-sm font-semibold text-gray-700">{item.qty}</div>
            <div className="hidden sm:block w-16 text-center text-sm font-bold text-[#1a1a2e]">{formatINR(item.price)}</div>
            <div className="w-16 text-center text-sm font-black text-[#1a1a2e]">{formatINR(item.price * item.qty)}</div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 px-5 py-4 space-y-1.5 text-sm bg-gray-50/50">
        <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">{formatINR(order.subtotal)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Shipping ({shippingMethods[order.shippingMethod].label})</span><span className="font-semibold">{order.shipping === 0 ? "FREE" : formatINR(order.shipping)}</span></div>
        {order.discount > 0 && <div className="flex justify-between text-[#4caf50] font-semibold"><span>Coupon ({order.couponCode})</span><span>−{formatINR(order.discount)}</span></div>}
        <div className="flex justify-between pt-1.5 border-t border-gray-200"><span className="font-black text-[#1a1a2e]">Total</span><span className="font-black text-[#e91e8c]">{formatINR(order.total)}</span></div>
      </div>
    </div>
  );
}

export function TrackingCard({ order }: { order: Order }) {
  const status = orderStatus(order);
  const steps = orderTimeline(order);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5 gap-2">
        <h2 className="font-black text-[#1a1a2e] text-base">Order Tracking</h2>
        {status !== "Cancelled" && status !== "Delivered" && (
          <span className="text-[11px] font-semibold text-gray-500">ETA {fmtDate(expectedDelivery(order).toISOString())}</span>
        )}
      </div>
      {status === "Cancelled" && (
        <div className="mb-4 bg-[#fdecec] text-[#ef4444] rounded-xl px-3 py-2 text-xs font-bold">
          ⛔ This order was cancelled{order.manualStatusAt ? ` on ${fmtDate(order.manualStatusAt)}` : ""}.{order.payment.status === "Refunded" ? " Your refund has been initiated." : ""}
        </div>
      )}
      {status === "Return Requested" && (
        <div className="mb-4 bg-[#fff3e0] text-[#ef6c00] rounded-xl px-3 py-2 text-xs font-bold">
          ↩️ Return requested{order.manualStatusAt ? ` on ${fmtDate(order.manualStatusAt)}` : ""}. Our courier partner will pick it up in 2-3 days.
        </div>
      )}
      <div className="relative">
        <div className="absolute left-[18px] top-5 bottom-5 w-0.5 bg-gray-200" />
        <div>
          {steps.map((step, i) => (
            <div key={i} className="relative flex items-start gap-3.5 pb-5 last:pb-0">
              <div className={`relative z-10 w-9 h-9 rounded-full shrink-0 flex items-center justify-center border-2 transition-all ${
                step.done ? "bg-[#4caf50] border-[#4caf50]" : step.active ? "bg-[#e91e8c] border-[#e91e8c]" : "bg-white border-gray-200"
              }`}>
                {step.done ? (
                  <svg className="w-4 h-4 fill-none stroke-white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                ) : step.active ? (
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
                ) : (
                  <div className="w-2 h-2 bg-gray-300 rounded-full" />
                )}
              </div>
              <div className="pt-1 flex-1 grid grid-cols-1 sm:grid-cols-[1fr_1.2fr] gap-x-3">
                <div>
                  <div className={`text-sm font-bold ${step.active ? "text-[#e91e8c]" : step.done ? "text-[#1a1a2e]" : "text-gray-400"}`}>{step.label}</div>
                  {step.at && (step.done || step.active) && <div className="text-[10px] text-gray-400 mt-0.5">{fmtDate(step.at, true)}</div>}
                </div>
                <div className={`text-xs mt-0.5 whitespace-pre-line ${step.done || step.active ? "text-gray-500" : "text-gray-300"}`}>{stepDesc[step.label]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AddressCard({ order, onChange }: { order: Order; onChange?: () => void }) {
  const a = order.address;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 bg-[#fce4ec] rounded-xl flex items-center justify-center shrink-0">
          <svg className="fill-[#e91e8c]" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
        </div>
        <h3 className="font-black text-[#1a1a2e] text-sm">Shipping Address</h3>
      </div>
      <div className="text-sm space-y-0.5 text-gray-600">
        <div className="font-bold text-[#1a1a2e]">{a.name}</div>
        <div>{a.line1}</div>
        <div>{a.line2 ? `${a.line2}, ` : ""}{a.city} - {a.pincode}</div>
        <div>{a.state}, India</div>
        <div className="mt-1">Phone: {a.phone}</div>
      </div>
      {onChange && (
        <button onClick={onChange} className="mt-4 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors">
          Change Address
        </button>
      )}
    </div>
  );
}

export function PaymentCard({ order }: { order: Order }) {
  const p = order.payment;
  const tone = p.status === "Paid" ? "text-[#4caf50]" : p.status === "Refunded" ? "text-[#1e88e5]" : "text-[#f59e0b]";
  const label = p.status === "Paid" ? "Successful" : p.status === "Refunded" ? "Refunded" : "Pay on Delivery";
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 bg-[#fce4ec] rounded-xl flex items-center justify-center shrink-0">
          <svg className="fill-[#e91e8c]" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}><path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" /></svg>
        </div>
        <h3 className="font-black text-[#1a1a2e] text-sm">Payment Information</h3>
      </div>
      <div className="text-sm text-gray-600 space-y-1.5">
        <div>{p.method === "cod" ? "Cash on Delivery" : `Paid via ${p.detail}`}</div>
        {p.txnId && <div className="text-xs text-gray-400">Transaction ID: {p.txnId}</div>}
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-sm font-semibold">Payment Status: <span className={`${tone} font-bold`}>{label}</span></span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-sm font-semibold text-gray-600">{p.method === "cod" && p.status === "Pending" ? "Amount Payable" : "Paid Amount"}: <span className="text-lg font-black text-[#1a1a2e]">{formatINR(order.total)}</span></div>
        </div>
      </div>
    </div>
  );
}

export function HelpCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#e3f2fd] rounded-xl flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 fill-[#1e88e5]" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 10H9V9h2v3zm4 0h-2V9h2v3z" /></svg>
        </div>
        <div>
          <div className="text-sm font-black text-[#1a1a2e]">Need Help?</div>
          <div className="text-xs text-gray-400">Our support team is always here for you.</div>
        </div>
      </div>
      <Link href="/contact" className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#1a1a2e] hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors whitespace-nowrap">Contact Us</Link>
    </div>
  );
}

export function QuickActions({ order }: { order: Order }) {
  const actions = [
    { label: "Track Order", href: `/account/orders/${order.id}`, icon: <svg className="w-6 h-6 fill-[#e91e8c]" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-1 1.5l1.96 2.5H17V9.5h2zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg> },
    { label: "View Invoice", href: `/account/orders/${order.id}/invoice`, icon: <svg className="w-6 h-6 fill-[#1e88e5]" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" /></svg> },
    { label: "Continue Shopping", href: "/shop", icon: <svg className="w-6 h-6 fill-[#e91e8c]" viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z" /></svg> },
  ];
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map((a) => (
        <Link key={a.label} href={a.href} className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-[#e91e8c] hover:shadow-md transition-all text-center shadow-sm">
          {a.icon}
          <span className="text-[11px] font-bold text-[#1a1a2e] leading-tight">{a.label}</span>
        </Link>
      ))}
    </div>
  );
}
