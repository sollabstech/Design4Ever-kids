"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-10" style={{ background: "linear-gradient(135deg, #e8f5e9 0%, #f1f8f1 100%)" }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Left: plane + text */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#e3f2fd] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg className="w-7 h-7 text-[#1976d2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1a1a2e]">
                Join Our Happy Community!
              </h3>
              <p className="text-sm text-gray-600 mt-0.5">
                Get the latest offers, new arrivals and parenting tips.
              </p>
            </div>
          </div>

          {/* Center: Input */}
          <div className="flex w-full sm:w-auto gap-2 flex-1 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 border border-gray-200 bg-white rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c] transition-colors"
            />
            <button className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors flex-shrink-0 shadow-sm">
              Subscribe
            </button>
          </div>

          {/* Right: Star character */}
          <div className="hidden lg:flex flex-col items-center gap-1 flex-shrink-0">
            <span className="text-5xl select-none">⭐</span>
            <p className="text-xs font-bold text-[#1a1a2e] text-center whitespace-nowrap">
              Big Dreams Start Small ❤️
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
