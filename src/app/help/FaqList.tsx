"use client";

import { useState } from "react";
import { faqs } from "@/lib/content";

export default function FaqList() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState<number | null>(0);
  const cats = ["All", ...Array.from(new Set(faqs.map((f) => f.cat)))];
  const s = q.trim().toLowerCase();
  const list = faqs.map((f, i) => ({ ...f, i })).filter((f) => (cat === "All" || f.cat === cat) && (!s || `${f.q} ${f.a}`.toLowerCase().includes(s)));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles…" aria-label="Search FAQs"
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e91e8c] mb-4" />
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap border ${cat === c ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "border-gray-200 text-[#1a1a2e]"}`}>{c}</button>
        ))}
      </div>
      <div className="divide-y divide-gray-100">
        {list.length === 0 && <p className="text-sm text-gray-500 py-6 text-center">No articles match &ldquo;{q}&rdquo;.</p>}
        {list.map((f) => (
          <div key={f.i}>
            <button onClick={() => setOpen(open === f.i ? null : f.i)} aria-expanded={open === f.i} className="w-full flex items-center justify-between gap-4 py-4 text-left">
              <span className="text-sm font-bold text-[#1a1a2e]">{f.q}</span>
              <span className={`text-[#e91e8c] text-xl transition-transform ${open === f.i ? "rotate-45" : ""}`}>+</span>
            </button>
            {open === f.i && <p className="text-sm text-gray-600 pb-4 -mt-1 leading-relaxed">{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
