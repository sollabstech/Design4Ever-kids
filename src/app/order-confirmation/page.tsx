"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BASE = "https://images.unsplash.com";

const ORDER_ITEMS = [
  { id: 11, name: "Teddy Bear Soft Toy",     category: "Toys",             qty: 1, price: 499, image: `${BASE}/photo-1602734846297-9299fc2d4703?w=80&h=80&fit=crop&auto=format&q=80` },
  { id: 5,  name: "Wooden Building Blocks",  category: "Educational Toys", qty: 1, price: 590, image: `${BASE}/photo-1587654780291-39c9404d746b?w=80&h=80&fit=crop&auto=format&q=80` },
  { id: 9,  name: "Coloring Books Set (5)",  category: "Books",            qty: 1, price: 299, image: `${BASE}/photo-1455884981818-54cb785db6fc?w=80&h=80&fit=crop&auto=format&q=80` },
];

const TRACKING = [
  { label: "Order Placed",      sub: "04 Sep 2026, 10:24 AM", desc: "We've received your order.",             done: true,  active: false },
  { label: "Processing",        sub: "",                        desc: "Your order is being prepared by our team.", done: false, active: true  },
  { label: "Shipped",           sub: "",                        desc: "Tracking details will be shared soon.", done: false, active: false },
  { label: "Out for Delivery",  sub: "",                        desc: "On the way to your location.",          done: false, active: false },
  { label: "Delivered",         sub: "",                        desc: "Enjoy your purchase!\nWe hope it brings a smile 😊", done: false, active: false },
];

const RECO = [
  { id: 2,  name: "Montessori Stacking Toy", price: 699, origPrice: 999,  rating: 4.5, reviews: 64,  image: `${BASE}/photo-1629583908828-2cb711a77327?w=300&h=240&fit=crop&auto=format&q=80`, bg: "bg-[#fef0f7]" },
  { id: 7,  name: "Remote Control Car",       price: 799, origPrice: 1199, rating: 4.5, reviews: 89,  image: `${BASE}/photo-1566576912321-d58ddd7a6088?w=300&h=240&fit=crop&auto=format&q=80`, bg: "bg-[#e8f5e9]" },
  { id: 6,  name: "Kids Backpack",            price: 899, origPrice: 1299, rating: 4.5, reviews: 52,  image: `${BASE}/photo-1553062407-98eeb64c6a62?w=300&h=240&fit=crop&auto=format&q=80`, bg: "bg-[#fce4ec]" },
  { id: 8,  name: "Alphabet Puzzle",          price: 499, origPrice: 699,  rating: 4.0, reviews: 120, image: `${BASE}/photo-1589495374906-b7f5ca5de879?w=300&h=240&fit=crop&auto=format&q=80`, bg: "bg-[#f3e5f5]" },
  { id: 3,  name: "Kitchen Play Set",         price: 899, origPrice: 1299, rating: 4.5, reviews: 74,  image: `${BASE}/photo-1617117206620-b01f2919ff86?w=300&h=240&fit=crop&auto=format&q=80`, bg: "bg-[#fff3e0]" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const full = i < Math.floor(rating);
        const half = !full && i < rating;
        return (
          <svg key={i} className={`w-3.5 h-3.5 ${full || half ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        );
      })}
    </div>
  );
}

export default function OrderConfirmationPage() {
  const [recoAdded, setRecoAdded] = useState<Record<number, boolean>>({});
  const [recoWished, setRecoWished] = useState<Record<number, boolean>>({});

  const total = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Main content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-5">

            {/* Thank you card */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#4caf50] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-6 h-6 text-white fill-none stroke-white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-black text-[#1a1a2e] mb-0.5">Thank you, Priya!</h1>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Your order has been placed successfully.</p>
                  <p className="text-xs text-gray-500">We&apos;ve sent an order confirmation to <span className="font-semibold text-gray-700">priya@example.com</span></p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">Order Number</div>
                <div className="text-base font-black text-[#1a1a2e]">#DK100328</div>
                <div className="text-[10px] text-gray-400 mt-1">Placed on</div>
                <div className="text-xs font-semibold text-gray-600">04 Sep 2026, 10:24 AM</div>
              </div>
            </div>

            {/* Order details card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-black text-[#1a1a2e] text-base">Order Details</h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 font-semibold">{ORDER_ITEMS.length} items</span>
                  <span className="font-black text-[#1a1a2e]">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wide">
                <div>Product</div>
                <div className="text-center w-20">Quantity</div>
                <div className="text-center w-16">Price</div>
                <div className="text-center w-16">Total</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {ORDER_ITEMS.map(item => (
                  <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px"/>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1a1a2e] leading-tight">{item.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.category}</div>
                      </div>
                    </div>
                    <div className="w-20 text-center text-sm font-semibold text-gray-700">{item.qty}</div>
                    <div className="w-16 text-center text-sm font-bold text-[#1a1a2e]">₹{item.price}</div>
                    <div className="w-16 text-center text-sm font-black text-[#1a1a2e]">₹{item.price * item.qty}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping + Payment row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-[#fce4ec] rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 fill-[#e91e8c]" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <h3 className="font-black text-[#1a1a2e] text-sm">Shipping Address</h3>
                </div>
                <div className="text-sm space-y-0.5 text-gray-600">
                  <div className="font-bold text-[#1a1a2e]">Priya S</div>
                  <div>12, Rose Garden Street</div>
                  <div>Anna Nagar, Chennai - 600040</div>
                  <div>Tamil Nadu, India</div>
                  <div className="mt-1">Phone: +91 98765 43210</div>
                </div>
                <button className="mt-4 border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors">
                  Change Address
                </button>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-[#fce4ec] rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-4.5 h-4.5 fill-[#e91e8c]" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                      <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                    </svg>
                  </div>
                  <h3 className="font-black text-[#1a1a2e] text-sm">Payment Information</h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1.5">
                  <div>Paid via UPI (Google Pay)</div>
                  <div className="text-xs text-gray-400">Transaction ID: 6HDB29374628</div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <svg className="w-4 h-4 fill-[#4caf50]" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <span className="text-sm font-semibold">Payment Status: <span className="text-[#4caf50] font-bold">Successful</span></span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm font-semibold text-gray-600">Paid Amount: <span className="text-lg font-black text-[#1a1a2e]">₹{total.toLocaleString("en-IN")}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-4">

            {/* Order Tracking */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-black text-[#1a1a2e] text-base mb-5">Order Tracking</h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-5 bottom-5 w-0.5 bg-gray-200"/>
                <div className="space-y-0">
                  {TRACKING.map((step, i) => (
                    <div key={i} className="relative flex items-start gap-3.5 pb-5 last:pb-0">
                      {/* Circle */}
                      <div className={`relative z-10 w-9 h-9 rounded-full shrink-0 flex items-center justify-center border-2 transition-all ${
                        step.done
                          ? "bg-[#4caf50] border-[#4caf50]"
                          : step.active
                          ? "bg-white border-[#e91e8c]"
                          : "bg-white border-gray-200"
                      }`}>
                        {step.done ? (
                          <svg className="w-4 h-4 fill-none stroke-white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
                        ) : step.active ? (
                          <div className="w-3 h-3 bg-[#e91e8c] rounded-full"/>
                        ) : (
                          <div className="w-2 h-2 bg-gray-300 rounded-full"/>
                        )}
                      </div>
                      {/* Text */}
                      <div className="pt-1.5 flex-1">
                        <div className={`text-sm font-bold ${step.active ? "text-[#e91e8c]" : step.done ? "text-[#1a1a2e]" : "text-gray-400"}`}>
                          {step.label}
                        </div>
                        {step.sub && <div className="text-[10px] text-gray-400 mt-0.5">{step.sub}</div>}
                        <div className={`text-xs mt-0.5 whitespace-pre-line ${step.done || step.active ? "text-gray-500" : "text-gray-300"}`}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#e3f2fd] rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 fill-[#1e88e5]" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-9 10H9V9h2v3zm4 0h-2V9h2v3z"/></svg>
                </div>
                <div>
                  <div className="text-sm font-black text-[#1a1a2e]">Need Help?</div>
                  <div className="text-xs text-gray-400">Our support team is always here for you.</div>
                </div>
              </div>
              <button className="border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-[#1a1a2e] hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors whitespace-nowrap">
                Contact Us
              </button>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Track Order", icon: <svg className="w-6 h-6 fill-[#e91e8c]" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-1 1.5l1.96 2.5H17V9.5h2zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg> },
                { label: "View Invoice", icon: <svg className="w-6 h-6 fill-[#1e88e5]" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg> },
                { label: "Continue Shopping", icon: <svg className="w-6 h-6 fill-[#e91e8c]" viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/></svg> },
              ].map(a => (
                <Link key={a.label} href={a.label === "Continue Shopping" ? "/shop" : "#"}
                  className="bg-white border border-gray-100 rounded-2xl p-3 flex flex-col items-center gap-2 hover:border-[#e91e8c] hover:shadow-md transition-all text-center shadow-sm">
                  {a.icon}
                  <span className="text-[10px] font-bold text-[#1a1a2e] leading-tight">{a.label}</span>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Pink banner */}
      <div className="w-full bg-[#e91e8c]" style={{ height: 120 }} />

      {/* You May Also Like */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[#1a1a2e] flex items-center gap-2">
            You May Also Like <span className="text-yellow-400">✦</span>
          </h2>
          <Link href="/shop" className="text-sm font-bold text-[#1e88e5] hover:underline flex items-center gap-1">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {RECO.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="relative shrink-0" style={{ height: 170 }}>
                <Link href={`/shop/${p.id}`} className="block absolute inset-0">
                  <div className={`${p.bg} absolute inset-0`}/>
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="20vw"/>
                </Link>
                <button
                  onClick={() => setRecoWished(prev => ({ ...prev, [p.id]: !prev[p.id] }))}
                  className="absolute top-2.5 right-2.5 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                >
                  <svg className={`w-4 h-4 transition-colors ${recoWished[p.id] ? "fill-[#e91e8c] stroke-[#e91e8c]" : "fill-none stroke-gray-400"}`} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>
              <div className="p-3 flex flex-col flex-1">
                <Link href={`/shop/${p.id}`}>
                  <h4 className="text-sm font-bold text-[#1a1a2e] line-clamp-2 mb-1 hover:text-[#e91e8c] transition-colors">{p.name}</h4>
                </Link>
                <div className="font-black text-sm text-[#1a1a2e] mb-1">₹{p.price}</div>
                <div className="flex items-center gap-1 mb-3">
                  <Stars rating={p.rating}/>
                  <span className="text-xs text-gray-400">({p.reviews})</span>
                </div>
                <button
                  className="mt-auto"
                  onClick={() => { setRecoAdded(prev => ({ ...prev, [p.id]: true })); setTimeout(() => setRecoAdded(prev => ({ ...prev, [p.id]: false })), 2000); }}
                >
                  <span className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${recoAdded[p.id] ? "bg-[#e8f5e9] text-[#4caf50]" : "bg-[#e91e8c] text-white hover:bg-[#c2187a]"}`}>
                    {recoAdded[p.id] ? (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>Added!</>
                    ) : (
                      <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>Add to Cart</>
                    )}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
