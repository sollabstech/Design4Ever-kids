"use client";

import { useState } from "react";
import type { Coupon } from "@/lib/catalog";
import { useStore } from "@/lib/store";

const palettes = [
  "from-[#e91e8c] to-[#ff6fb5]",
  "from-[#4caf50] to-[#81c784]",
  "from-[#7c4dff] to-[#b388ff]",
];

export default function CouponCard({ coupon, index }: { coupon: Coupon; index: number }) {
  const { applyCoupon, couponCode, toast } = useStore();
  const [copied, setCopied] = useState(false);
  const applied = couponCode === coupon.code;

  const copy = async () => {
    try { await navigator.clipboard.writeText(coupon.code); } catch { /* clipboard blocked */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const apply = () => {
    const r = applyCoupon(coupon.code);
    if (!r.ok) toast(r.error, "error");
  };

  return (
    <div className={`bg-gradient-to-br ${palettes[index % palettes.length]} rounded-2xl p-5 text-white shadow-sm relative overflow-hidden`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/15" />
      <div className="text-xs font-bold uppercase tracking-wide opacity-90">Coupon</div>
      <h3 className="text-xl font-black mt-1">{coupon.title}</h3>
      <p className="text-sm opacity-90 mt-1">{coupon.description}</p>
      <div className="flex items-center gap-2 mt-4">
        <button onClick={copy} className="flex-1 border-2 border-dashed border-white/70 rounded-xl px-3 py-2 font-black tracking-widest text-sm hover:bg-white/10 transition-colors">
          {copied ? "Copied!" : coupon.code}
        </button>
        <button onClick={apply} disabled={applied} className="bg-white text-[#1a1a2e] font-bold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-colors disabled:opacity-80">
          {applied ? "Applied ✓" : "Apply"}
        </button>
      </div>
    </div>
  );
}
