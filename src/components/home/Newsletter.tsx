"use client";

import { useState } from "react";
import { EMAIL_RE } from "@/lib/validate";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) { setState("error"); return; }
    try {
      const list: string[] = JSON.parse(localStorage.getItem("d4e:newsletter") ?? "[]");
      if (!list.includes(email.trim().toLowerCase())) list.push(email.trim().toLowerCase());
      localStorage.setItem("d4e:newsletter", JSON.stringify(list));
    } catch { /* ignore storage errors */ }
    setState("done");
  };

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
          {state === "done" ? (
            <div className="flex-1 max-w-md w-full bg-white rounded-full px-5 py-3 text-sm font-bold text-[#2e7d32] shadow-sm text-center">
              🎉 You&apos;re subscribed! Watch your inbox for goodies.
            </div>
          ) : (
            <form onSubmit={subscribe} noValidate className="flex flex-col w-full sm:w-auto flex-1 max-w-md">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (state === "error") setState("idle"); }}
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className={`flex-1 min-w-0 border bg-white rounded-full px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c] transition-colors ${state === "error" ? "border-red-400" : "border-gray-200"}`}
                />
                <button type="submit" className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors flex-shrink-0 shadow-sm">
                  Subscribe
                </button>
              </div>
              {state === "error" && <p className="text-xs text-red-500 font-semibold mt-1.5 ml-4">Please enter a valid email address.</p>}
            </form>
          )}

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
