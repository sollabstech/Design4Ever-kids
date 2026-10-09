"use client";

import Image from "next/image";
import Link from "next/link";
import { formatINR, getProduct } from "@/lib/catalog";
import { orderStatus, useStore } from "@/lib/store";
import { OrderRow } from "@/components/account/OrderRow";

const statCards = [
  { key: "active", label: "Active Orders", emoji: "🛍️", bg: "bg-[#fff0f5]", ring: "bg-[#fce4ec]", href: "/account/orders?tab=active" },
  { key: "delivered", label: "Delivered Orders", emoji: "📦", bg: "bg-[#effaf3]", ring: "bg-[#d7f5e1]", href: "/account/orders?tab=delivered" },
  { key: "wishlist", label: "Wishlist Items", emoji: "💜", bg: "bg-[#f5f3ff]", ring: "bg-[#ece7ff]", href: "/account/wishlist" },
  { key: "reviews", label: "Product Reviews", emoji: "⭐", bg: "bg-[#fffbeb]", ring: "bg-[#fff3c4]", href: "/account/reviews" },
] as const;

export default function DashboardPage() {
  const { orders, wishlist, reviews, addresses, addToCart } = useStore();
  const counts = {
    active: orders.filter((o) => ["Processing", "Shipped", "Out for Delivery"].includes(orderStatus(o))).length,
    delivered: orders.filter((o) => orderStatus(o) === "Delivered").length,
    wishlist: wishlist.length,
    reviews: reviews.length,
  };
  const def = addresses.find((a) => a.isDefault) ?? addresses[0];
  const wishProducts = wishlist.map(getProduct).filter((p) => !!p).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((c) => (
          <Link key={c.key} href={c.href} className={`${c.bg} rounded-3xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow border border-white`}>
            <div className={`${c.ring} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl sm:text-3xl shrink-0`}>{c.emoji}</div>
            <div className="min-w-0">
              <div className="text-2xl sm:text-3xl font-black text-[#1a1a2e]">{counts[c.key]}</div>
              <div className="text-xs sm:text-sm font-semibold text-gray-600 leading-tight">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Recent orders */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-gray-100">
            <h2 className="text-xl font-black text-[#1a1a2e]">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-bold text-[#1e88e5] hover:underline">View All →</Link>
          </div>
          <div className="px-5 sm:px-6 divide-y divide-gray-100">
            {orders.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-3">🛒</div>
                <p className="font-bold text-[#1a1a2e]">No orders yet</p>
                <p className="text-sm text-gray-500 mb-4">Your orders will show up here.</p>
                <Link href="/shop" className="inline-block bg-[#e91e8c] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#c2187a]">Start Shopping</Link>
              </div>
            ) : orders.slice(0, 5).map((o) => <OrderRow key={o.id} order={o} />)}
          </div>
        </div>

        <div className="space-y-6">
          {/* Address */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#1a1a2e] flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#e91e8c] flex items-center justify-center text-white text-sm">📍</span>
                My Addresses
              </h3>
              <Link href="/account/addresses" className="text-sm font-bold text-[#1e88e5] hover:underline">Manage</Link>
            </div>
            {def ? (
              <Link href="/account/addresses" className="flex items-start gap-3 group">
                <span className="text-lg">🏠</span>
                <div className="flex-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1a1a2e]">{def.label}</span>
                    {def.isDefault && <span className="text-[10px] font-bold bg-[#e91e8c] text-white px-2 py-0.5 rounded">Default</span>}
                  </div>
                  {def.line1}<br />{def.line2 ? `${def.line2}, ` : ""}{def.city} - {def.pincode}<br />{def.state}, India
                </div>
                <span className="text-gray-400 group-hover:text-[#e91e8c] self-center text-xl">›</span>
              </Link>
            ) : (
              <Link href="/account/addresses" className="block text-center text-sm font-bold text-[#e91e8c] border-2 border-dashed border-pink-200 rounded-2xl py-5 hover:bg-pink-50">+ Add an address</Link>
            )}
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#1a1a2e] flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#e91e8c] flex items-center justify-center text-white text-sm">❤</span>
                My Wishlist
              </h3>
              <Link href="/account/wishlist" className="text-sm font-bold text-[#1e88e5] hover:underline">View All</Link>
            </div>
            {wishProducts.length ? (
              <div className="grid grid-cols-3 gap-3">
                {wishProducts.map((p) => (
                  <div key={p!.id} className="group">
                    <Link href={`/shop/${p!.id}`} className={`${p!.bg} relative block aspect-square rounded-2xl overflow-hidden border border-gray-100`}>
                      <Image src={p!.images[0]} alt={p!.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="100px" />
                    </Link>
                    <div className="text-xs font-semibold text-[#1a1a2e] mt-1.5 line-clamp-1">{p!.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1a1a2e]">{formatINR(p!.price)}</span>
                      <button onClick={() => addToCart(p!.id)} disabled={p!.stock <= 0} aria-label={`Add ${p!.name} to cart`} className="text-[#e91e8c] hover:scale-110 transition-transform disabled:opacity-30 text-sm">🛒</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Tap the ♡ on any product to save it here.</p>
            )}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { e: "🛡️", t: "Safe & Secure\nShopping" },
          { e: "🚚", t: "Pan India\nDelivery" },
          { e: "⭐", t: "Curated\nFor Kids" },
          { e: "❤️", t: "Happy\nCustomers" },
        ].map((x, i) => (
          <div key={i} className={`flex items-center gap-3 justify-center ${i > 0 ? "md:border-l md:border-gray-100" : ""}`}>
            <span className="text-3xl">{x.e}</span>
            <span className="text-sm font-bold text-[#1a1a2e] whitespace-pre-line leading-tight">{x.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
