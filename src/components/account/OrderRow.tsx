"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatINR, getProduct } from "@/lib/catalog";
import { orderStatus, useStore, type Order } from "@/lib/store";
import { fmtDate, StatusPill } from "@/components/ui";

export function useBuyAgain() {
  const { addToCart } = useStore();
  const router = useRouter();
  return (order: Order) => {
    for (const i of order.items) {
      const p = getProduct(i.productId);
      if (p && p.stock > 0) addToCart(i.productId, i.qty);
    }
    router.push("/cart");
  };
}

export function OrderAction({ order }: { order: Order }) {
  const buyAgain = useBuyAgain();
  const s = orderStatus(order);
  const cls = "inline-flex justify-center min-w-[120px] border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-[#1a1a2e] hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors whitespace-nowrap";
  if (s === "Delivered") return <button onClick={() => buyAgain(order)} className={cls}>Buy Again</button>;
  if (s === "Cancelled" || s === "Return Requested") return <Link href={`/account/orders/${order.id}`} className={cls}>View Details</Link>;
  return <Link href={`/account/orders/${order.id}`} className={cls}>Track Order</Link>;
}

export function OrderRow({ order }: { order: Order }) {
  const first = order.items[0];
  const more = order.items.length - 1;
  const qty = order.items.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="grid grid-cols-[auto_1fr] sm:grid-cols-[110px_72px_1fr_auto_auto] gap-x-4 gap-y-2 items-center py-4">
      <Link href={`/account/orders/${order.id}`} className="col-span-2 sm:col-span-1 group">
        <div className="text-sm font-black text-[#1a1a2e] group-hover:text-[#e91e8c]">#{order.id}</div>
        <div className="text-xs text-gray-400">{fmtDate(order.placedAt)}</div>
      </Link>
      <Link href={`/account/orders/${order.id}`} className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
        <Image src={first.image} alt={first.name} fill className="object-cover" sizes="72px" />
        {more > 0 && <span className="absolute bottom-1 right-1 bg-[#1a1a2e]/80 text-white text-[10px] font-bold px-1.5 rounded">+{more}</span>}
      </Link>
      <div className="min-w-0">
        <Link href={`/account/orders/${order.id}`} className="text-sm font-bold text-[#1a1a2e] hover:text-[#e91e8c] line-clamp-1">
          {first.name}{more > 0 ? ` & ${more} more` : ""}
        </Link>
        <div className="text-xs text-gray-500 mt-0.5">Qty: {qty} | {formatINR(order.total)}</div>
        <div className="sm:hidden mt-2 flex items-center gap-2 flex-wrap"><StatusPill status={orderStatus(order)} /><OrderAction order={order} /></div>
      </div>
      <div className="hidden sm:block"><StatusPill status={orderStatus(order)} /></div>
      <div className="hidden sm:block"><OrderAction order={order} /></div>
    </div>
  );
}
