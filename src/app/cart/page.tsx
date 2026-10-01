"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BASE = "https://images.unsplash.com";

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  qty: number;
  image: string;
}

interface RecoProduct {
  id: number;
  name: string;
  price: number;
  origPrice: number;
  rating: number;
  reviews: number;
  image: string;
  bg: string;
}

const initialItems: CartItem[] = [
  { id: 11, name: "Teddy Bear Soft Toy", category: "Toys", price: 499, qty: 1, image: `${BASE}/photo-1602734846297-9299fc2d4703?w=200&h=200&fit=crop&auto=format&q=80` },
  { id: 5,  name: "Wooden Building Blocks", category: "Educational Toys", price: 590, qty: 1, image: `${BASE}/photo-1587654780291-39c9404d746b?w=200&h=200&fit=crop&auto=format&q=80` },
  { id: 9,  name: "Coloring Books Set (5)", category: "Books", price: 299, qty: 1, image: `${BASE}/photo-1455884981818-54cb785db6fc?w=200&h=200&fit=crop&auto=format&q=80` },
];

const recoProducts: RecoProduct[] = [
  { id: 2,  name: "Montessori Stacking Toy", price: 699, origPrice: 999, rating: 4.5, reviews: 64,  image: `${BASE}/photo-1629583908828-2cb711a77327?w=300&h=300&fit=crop&auto=format&q=80`, bg: "bg-[#fef0f7]" },
  { id: 7,  name: "Remote Control Car",      price: 799, origPrice: 1199, rating: 4.5, reviews: 89, image: `${BASE}/photo-1566576912321-d58ddd7a6088?w=300&h=300&fit=crop&auto=format&q=80`, bg: "bg-[#e8f5e9]" },
  { id: 6,  name: "Kids Backpack",           price: 899, origPrice: 1299, rating: 4.5, reviews: 52, image: `${BASE}/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&auto=format&q=80`, bg: "bg-[#fce4ec]" },
  { id: 8,  name: "Alphabet Puzzle",         price: 499, origPrice: 699,  rating: 4.5, reviews: 120,image: `${BASE}/photo-1589495374906-b7f5ca5de879?w=300&h=300&fit=crop&auto=format&q=80`, bg: "bg-[#f3e5f5]" },
  { id: 3,  name: "Kitchen Play Set",        price: 899, origPrice: 1299, rating: 4.5, reviews: 74, image: `${BASE}/photo-1617117206620-b01f2919ff86?w=300&h=300&fit=crop&auto=format&q=80`, bg: "bg-[#fff3e0]" },
];

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < filled ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [recoAdded, setRecoAdded] = useState<Record<number, boolean>>({});
  const [recoWished, setRecoWished] = useState<Record<number, boolean>>({});

  const updateQty = (id: number, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setItems([]);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 60;
  const couponDiscount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + shipping - couponDiscount;
  const freeShippingThreshold = 499;
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const addReco = (id: number) => {
    setRecoAdded(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setRecoAdded(prev => ({ ...prev, [id]: false })), 2000);
  };

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
                  Shopping Cart <span className="text-gray-400 font-semibold text-base">({items.length} items)</span>
                </h1>
                <button
                  onClick={clearCart}
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
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1fr_40px] gap-4 items-center px-6 py-4">
                    {/* Product */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                      </div>
                      <div>
                        <Link href={`/shop/${item.id}`} className="text-sm font-bold text-[#1a1a2e] hover:text-[#e91e8c] transition-colors leading-tight line-clamp-2">{item.name}</Link>
                        <div className="text-xs text-gray-400 mt-0.5">{item.category}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#4caf50]" />
                          <span className="text-xs text-[#4caf50] font-semibold">In Stock</span>
                        </div>
                      </div>
                    </div>
                    {/* Price */}
                    <div className="text-center font-bold text-[#1a1a2e] text-sm">₹{item.price}</div>
                    {/* Qty */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold transition-colors">−</button>
                        <span className="w-8 text-center text-sm font-bold text-[#1a1a2e]">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold transition-colors">+</button>
                      </div>
                    </div>
                    {/* Total */}
                    <div className="text-center font-black text-[#1a1a2e]">₹{item.price * item.qty}</div>
                    {/* Delete */}
                    <div className="flex justify-center">
                      <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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
                <button className="flex items-center gap-1.5 bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Update Cart
                </button>
              </div>
            </div>

            {/* RIGHT: Order Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-black text-[#1a1a2e] text-lg mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({items.length} items)</span>
                    <span className="font-bold text-[#1a1a2e]">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm items-start">
                    <div>
                      <div className="text-gray-500">Shipping Charge</div>
                      <div className="text-xs text-gray-400">(Calculated at checkout)</div>
                    </div>
                    <span className="font-bold text-[#1a1a2e]">₹{shipping}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm text-[#4caf50] font-semibold">
                      <span>Coupon (KIDS10)</span>
                      <span>−₹{couponDiscount}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-[#1a1a2e] text-base">Total Amount</span>
                    <span className="font-black text-[#e91e8c] text-2xl">₹{total.toLocaleString("en-IN")}</span>
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
                      <div className="text-xs font-bold text-[#2e7d32]">Free Shipping on Orders Above ₹499</div>
                      <div className="text-xs text-[#4caf50]">Add ₹{remainingForFree} more to get free shipping!</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#e8f5e9] rounded-xl p-3 flex items-center gap-2.5 mb-4">
                    <span className="text-xl shrink-0">🎉</span>
                    <div className="text-xs font-bold text-[#2e7d32]">You qualify for FREE shipping!</div>
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
                      onChange={e => setCoupon(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#e91e8c] transition-colors"
                    />
                    <button
                      onClick={() => { if (coupon === "KIDS10") setCouponApplied(true); }}
                      className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
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
            {recoProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="relative shrink-0" style={{ height: 170 }}>
                  <Link href={`/shop/${p.id}`} className="block absolute inset-0">
                    <div className={`${p.bg} absolute inset-0`} />
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="20vw" />
                  </Link>
                  <button
                    onClick={() => setRecoWished(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                    className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition-colors"
                  >
                    <svg className={`w-4 h-4 transition-colors ${recoWished[p.id] ? "fill-[#e91e8c] stroke-[#e91e8c]" : "fill-none stroke-gray-400"}`} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <Link href={`/shop/${p.id}`}>
                    <h4 className="text-sm font-bold text-[#1a1a2e] line-clamp-2 mb-1 hover:text-[#e91e8c] transition-colors">{p.name}</h4>
                  </Link>
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="font-black text-sm text-[#1a1a2e]">₹{p.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{p.origPrice}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <Stars rating={p.rating} />
                    <span className="text-xs text-gray-400">({p.reviews})</span>
                  </div>
                  <button
                    className="mt-auto"
                    onClick={() => addReco(p.id)}
                  >
                    <span className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${recoAdded[p.id] ? "bg-[#e8f5e9] text-[#4caf50]" : "bg-[#e91e8c] text-white hover:bg-[#c2187a]"}`}>
                      {recoAdded[p.id] ? (
                        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Added!</>
                      ) : (
                        <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Add to Cart</>
                      )}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
