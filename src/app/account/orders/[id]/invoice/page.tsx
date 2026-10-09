"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatINR, shippingMethods } from "@/lib/catalog";
import { orderStatus, useStore } from "@/lib/store";
import { EmptyState, fmtDate } from "@/components/ui";

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useStore();
  const order = getOrder(id);

  if (!order) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><EmptyState emoji="🧾" title="Invoice not found" text="This order doesn't exist on your account." href="/account/orders" cta="My Orders" /></div>;
  }

  // Prices are GST-inclusive; show the 18% component for reference.
  const taxable = Math.round((order.total / 1.18) * 100) / 100;
  const gst = Math.round((order.total - taxable) * 100) / 100;

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto mb-4 flex items-center justify-between no-print">
        <Link href={`/account/orders/${order.id}`} className="text-sm font-bold text-gray-500 hover:text-[#e91e8c]">← Back to order</Link>
        <button onClick={() => window.print()} className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-sm font-bold px-5 py-2.5 rounded-xl">🖨️ Print / Save PDF</button>
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-8 print:shadow-none print:rounded-none">
        <div className="flex items-start justify-between gap-6 border-b border-gray-100 pb-6">
          <div>
            <Image src="/logo.png" alt="Design4EverKids" width={160} height={54} className="h-12 w-auto object-contain" />
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Design4EverKids Pvt. Ltd.<br />Chennai, Tamil Nadu, India<br />support@design4ever.com</p>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-black text-[#1a1a2e]">TAX INVOICE</h1>
            <p className="text-sm text-gray-500 mt-1">Invoice # INV-{order.id.slice(2)}</p>
            <p className="text-sm text-gray-500">Order # {order.id}</p>
            <p className="text-sm text-gray-500">Date: {fmtDate(order.placedAt)}</p>
            <p className="text-xs font-bold mt-1 text-[#e91e8c]">{orderStatus(order)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 py-6 text-sm">
          <div>
            <div className="text-xs font-black text-gray-400 uppercase mb-1">Bill & Ship To</div>
            <div className="font-bold text-[#1a1a2e]">{order.address.name}</div>
            <div className="text-gray-600">{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />{order.address.city}, {order.address.state} - {order.address.pincode}<br />Phone: {order.address.phone}<br />{order.email}</div>
          </div>
          <div>
            <div className="text-xs font-black text-gray-400 uppercase mb-1">Payment</div>
            <div className="text-gray-600">{order.payment.detail}<br />Status: <b>{order.payment.status}</b>{order.payment.txnId && <><br />Txn: {order.payment.txnId}</>}<br />Shipping: {shippingMethods[order.shippingMethod].label}</div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500">
              <th className="text-left px-3 py-2 font-black">#</th>
              <th className="text-left px-3 py-2 font-black">Item</th>
              <th className="text-center px-3 py-2 font-black">Qty</th>
              <th className="text-right px-3 py-2 font-black">Price</th>
              <th className="text-right px-3 py-2 font-black">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i, n) => (
              <tr key={i.productId} className="border-b border-gray-100">
                <td className="px-3 py-3 text-gray-400">{n + 1}</td>
                <td className="px-3 py-3"><div className="font-bold text-[#1a1a2e]">{i.name}</div><div className="text-xs text-gray-400">{i.category}</div></td>
                <td className="px-3 py-3 text-center">{i.qty}</td>
                <td className="px-3 py-3 text-right">{formatINR(i.price)}</td>
                <td className="px-3 py-3 text-right font-bold">{formatINR(i.price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <div className="w-64 text-sm space-y-1.5">
            <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>{order.shipping ? formatINR(order.shipping) : "FREE"}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount ({order.couponCode})</span><span>−{formatINR(order.discount)}</span></div>}
            <div className="flex justify-between text-xs text-gray-400"><span>Incl. GST (18%)</span><span>₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
            <div className="flex justify-between border-t-2 border-[#1a1a2e] pt-2 font-black text-base"><span>Grand Total</span><span>{formatINR(order.total)}</span></div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-10">Thank you for shopping with Design4EverKids! This is a computer-generated invoice and does not require a signature.</p>
      </div>
    </div>
  );
}
