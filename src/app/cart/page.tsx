"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryLabel, coupons, formatINR, FREE_SHIPPING_THRESHOLD, products, shippingCost } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { RecoCard, Spinner } from "@/components/ui";

export default function CartPage() {
  const { ready, cart: items, subtotal, setQty, removeFromCart, clearCart, toggleWishlist, isWished, couponCode, couponDiscount, couponError, applyCoupon, removeCoupon } = useStore();
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");

  const shipping = shippingCost("standard", subtotal);
  const total = subtotal + shipping - couponDiscount;
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const itemCount = items.reduce((s, i) => s + i.qty, 0);
  const recoProducts = products.filter((p) => !items.some((i) => i.product.id === p.id) && p.stock > 0).sort((a, b) => a.rank - b.rank).slice(0, 5);

  const submitCoupon = () => {
    if (!coupon.trim()) return;
    const r = applyCoupon(coupon);
    setCouponMsg(r.ok ? "" : r.error);
    if (r.ok) setCoupon("");
  };

  const saveForLater = (id: number) => {
    if (!isWished(id)) toggleWishlist(id);
    removeFromCart(id);
  };

  if (!ready) return <Spinner label="Loading your cart…" />;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Pink top section */}
      <div className="bg-gradient-to-br from-[#fce4ec] to-[#fdf6fb] py-6 border-b border-pink-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-[#e91e8c] flex items-center gap-1 transition-colors">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
              Home
            </Link>
            <span>›</span>
            <span className="text-[#1a1a2e] font-semibold">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-black text-[#1a1a2e] mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/shop" className="inline-block bg-[#e91e8c] text-white font-bold px-8 py-3 rounded-full hover:bg-[#c2187a] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

            {/* LEFT: Cart table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h1 className="font-black text-[#1a1a2e] text-lg">
                  Shopping Cart <span className="text-gray-400 font-semibold text-base">({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                </h1>
                <button
                  onClick={() => { if (window.confirm("Remove all items from your cart?")) clearCart(); }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </button>
              </div>

              {/* Column headers */}
              <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                {["Product", "Price", "Quantity", "Total", ""].map((h, i) => (
                  <div key={i} className={`text-xs font-black text-gray-500 uppercase tracking-wide ${i > 0 ? "text-center" : ""}`}>{h}</div>
                ))}
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {items.map(({ product: item, qty }) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 items-center px-6 py-4">
                    {/* Product */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <Image src={item.images[0]} alt={item.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div>
                        <Link href={`/shop/${item.id}`} className="text-sm font-bold text-[#1a1a2e] hover:text-[#e91e8c] transition-colors leading-tight line-clamp-2">{item.name}</Link>
                        <div className="text-xs text-gray-400 mt-0.5">{categoryLabel(item.categoryId)}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${item.stock < 10 ? "bg-[#ef6c00]" : "bg-[#4caf50]"}`} />
                            <span className={`text-xs font-semibold ${item.stock < 10 ? "text-[#ef6c00]" : "text-[#4caf50]"}`}>{item.stock < 10 ? `Only ${item.stock} left` : "In Stock"}</span>
                          </span>
                          <button onClick={() => saveForLater(item.id)} className="text-xs font-semibold text-gray-400 hover:text-[#e91e8c]">Save for later</button>
                        </div>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="text-center font-bold text-[#1a1a2e] text-sm"><span className="sm:hidden text-gray-400 font-semibold">Price: </span>{formatINR(item.price)}</div>
                    {/* Qty */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => setQty(item.id, qty - 1)} disabled={qty <= 1} aria-label="Decrease quantity" className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold transition-colors">−</button>
                        <span className="w-8 text-center text-sm font-bold text-[#1a1a2e]">{qty}</span>
                        <button onClick={() => setQty(item.id, qty + 1)} disabled={qty >= item.stock} aria-label="Increase quantity" className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold transition-colors">+</button>
                      </div>
                    </div>
                    {/* Total */}
                    <div className="text-center font-black text-[#1a1a2e]">{formatINR(item.price * qty)}</div>
                    {/* Delete */}
                    <div className="flex justify-center">
                      <button onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 flex-wrap gap-3">
                <Link href="/shop" className="flex items-center gap-1.5 border-2 border-gray-200 text-[#1a1a2e] font-bold text-sm px-5 py-2.5 rounded-xl hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Continue Shopping
                </Link>
                <Link href="/account/wishlist" className="flex items-center gap-1.5 text-[#e91e8c] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-pink-50 transition-colors">
                  ❤️ View Wishlist
                </Link>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-black text-[#1a1a2e] text-lg mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    <span className="font-bold text-[#1a1a2e]">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-start">
                    <div>
                      <div className="text-gray-500">Shipping Charge</div>
                      <div className="text-xs text-gray-400">(Standard · express available at checkout)</div>
                    </div>
                    <span className={`font-bold ${shipping === 0 ? "text-[#4caf50]" : "text-[#1a1a2e]"}`}>{shipping === 0 ? "FREE" : formatINR(shipping)}</span>
                  </div>
                  {couponCode && (
                    <div className={`flex justify-between items-center text-sm font-semibold ${couponError ? "text-[#ef6c00]" : "text-[#4caf50]"}`}>
                      <span className="flex items-center gap-1.5">
                        Coupon ({couponCode})
                        <button onClick={removeCoupon} className="text-xs text-gray-400 hover:text-red-500 underline">Remove</button>
                      </span>
                      <span>{couponError ? "Not applied" : `−${formatINR(couponDiscount)}`}</span>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-[#ef6c00]">{couponError}</p>}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[#1a1a2e] text-base">Total Amount</span>
                    <span className="font-black text-[#e91e8c] text-2xl">{formatINR(total)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="w-full bg-[#e91e8c] hover:bg-[#c2187a] text-white font-black text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-pink-200 mb-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Proceed to Checkout →
                </Link>

                {/* Free shipping progress */}
                {remainingForFree > 0 ? (
                  <div className="bg-[#e8f5e9] rounded-xl p-3 flex items-center gap-2.5 mb-4">
                    <span className="text-xl shrink-0">🚚</span>
                    <div>
                      <div className="text-xs font-bold text-[#2e7d32]">Free Shipping on Orders Above {formatINR(FREE_SHIPPING_THRESHOLD)}</div>
                      <div className="text-xs text-[#4caf50]">Add {formatINR(remainingForFree)} more to get free shipping!</div>
                      <div className="h-1.5 bg-white rounded-full mt-1.5 overflow-hidden"><div className="h-full bg-[#4caf50] rounded-full" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }} /></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#e8f5e9] rounded-xl p-3 flex items-center gap-2.5 mb-4">
                    <span className="text-xl shrink-0">🎉</span>
                    <div className="text-xs font-bold text-[#2e7d32]">You qualify for FREE standard shipping!</div>
                  </div>
                )}

                {/* Coupon */}
                <div className="mb-4">
                  <div className="text-xs font-bold text-[#1a1a2e] mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-[#e91e8c]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    Have a Coupon Code?
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onKeyDown={e => { if (e.key === "Enter") submitCoupon(); }}
                      onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(""); }}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e91e8c] transition-colors"
                    />
                    <button
                      onClick={submitCoupon}
                      className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && <p className="text-xs text-red-500 font-semibold mt-1.5">{couponMsg}</p>}
                  {!couponCode && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {coupons.map((c) => (
                        <button key={c.code} onClick={() => { setCoupon(c.code); setCouponMsg(""); }} className="text-[10px] font-bold border border-dashed border-[#e91e8c] text-[#e91e8c] px-2 py-1 rounded-lg hover:bg-pink-50" title={c.description}>
                          {c.code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-xl p-2.5 flex flex-col items-center">
                    <svg className="w-5 h-5 mb-1 fill-[#4caf50]" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L17 9l-8 8z"/></svg>
                    <div className="text-[10px] font-bold text-[#4caf50] leading-tight">Secure<br/>Payment</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 flex flex-col items-center">
                    <svg className="w-5 h-5 mb-1 fill-[#e91e8c]" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-1 1.5l1.96 2.5H17V9.5h2zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                    <div className="text-[10px] font-bold text-[#e91e8c] leading-tight">Fast<br/>Delivery</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5 flex flex-col items-center">
                    <svg className="w-5 h-5 mb-1 fill-[#ff9800]" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                    <div className="text-[10px] font-bold text-[#ff9800] leading-tight">Easy<br/>Returns</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-[#1a1a2e] flex items-center gap-2">
              You May Also Like <span>✨</span>
            </h2>
            <Link href="/shop" className="text-sm font-bold text-[#e91e8c] hover:underline flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recoProducts.map((p) => <RecoCard key={p.id} product={p} />)}
          </div>
        </div>

      </div>
    </div>
  );
}
