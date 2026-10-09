"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProduct } from "@/lib/catalog";
import { orderStatus, useStore } from "@/lib/store";
import { fmtDate, Modal, Stars } from "@/components/ui";

export default function ReviewsPage() {
  const { reviews, orders, addReview, deleteReview } = useStore();
  const [writing, setWriting] = useState<number | null>(null);
  const [form, setForm] = useState({ rating: 5, title: "", text: "" });
  const [error, setError] = useState("");

  const reviewed = new Set(reviews.map((r) => r.productId));
  const pending = Array.from(
    new Set(orders.filter((o) => orderStatus(o) === "Delivered").flatMap((o) => o.items.map((i) => i.productId))),
  ).filter((id) => !reviewed.has(id)).map(getProduct).filter((p) => !!p);

  const open = (productId: number) => {
    const existing = reviews.find((r) => r.productId === productId);
    setForm(existing ? { rating: existing.rating, title: existing.title, text: existing.text } : { rating: 5, title: "", text: "" });
    setError("");
    setWriting(productId);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 3) return setError("Please add a short title.");
    if (form.text.trim().length < 10) return setError("Please write at least 10 characters.");
    addReview({ productId: writing!, rating: form.rating, title: form.title.trim(), text: form.text.trim() });
    setWriting(null);
  };

  const product = writing ? getProduct(writing) : undefined;

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <h2 className="text-lg font-black text-[#1a1a2e] mb-1">Waiting for your review ⭐</h2>
          <p className="text-sm text-gray-500 mb-4">Products from your delivered orders.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pending.map((p) => (
              <div key={p!.id} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-3">
                <div className={`${p!.bg} relative w-14 h-14 rounded-xl overflow-hidden shrink-0`}><Image src={p!.images[0]} alt={p!.name} fill className="object-cover" sizes="56px" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-[#1a1a2e] line-clamp-1">{p!.name}</div>
                  <Stars rating={0} onPick={(r) => { open(p!.id); setForm((f) => ({ ...f, rating: r })); }} />
                </div>
                <button onClick={() => open(p!.id)} className="text-xs font-bold text-[#e91e8c] border border-[#e91e8c] px-3 py-1.5 rounded-lg hover:bg-pink-50 shrink-0">Review</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
          <h1 className="text-xl font-black text-[#1a1a2e]">My Reviews <span className="text-gray-400 text-base font-semibold">({reviews.length})</span></h1>
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📝</div>
              <p className="font-bold text-[#1a1a2e]">No reviews yet</p>
              <p className="text-sm text-gray-500">Reviews you write will appear here.</p>
            </div>
          ) : reviews.map((r) => {
            const p = getProduct(r.productId);
            return (
              <div key={r.id} className="flex gap-4 border border-gray-100 rounded-2xl p-4">
                {p && <Link href={`/shop/${p.id}`} className={`${p.bg} relative w-16 h-16 rounded-xl overflow-hidden shrink-0`}><Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="64px" /></Link>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <Link href={`/shop/${r.productId}`} className="text-sm font-bold text-[#1a1a2e] hover:text-[#e91e8c]">{p?.name ?? "Product"}</Link>
                    <span className="text-xs text-gray-400">{fmtDate(r.date)}</span>
                  </div>
                  <Stars rating={r.rating} />
                  <p className="text-sm font-bold text-[#1a1a2e] mt-1.5">{r.title}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{r.text}</p>
                  <div className="flex gap-4 mt-2 text-xs font-bold">
                    <button onClick={() => open(r.productId)} className="text-[#1e88e5] hover:underline">Edit</button>
                    <button onClick={() => { if (window.confirm("Delete this review?")) deleteReview(r.id); }} className="text-gray-400 hover:text-red-500">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {writing && product && (
        <Modal title={`Review: ${product.name}`} onClose={() => setWriting(null)}>
          <form onSubmit={submit} className="space-y-3">
            <div className="flex justify-center py-2"><Stars rating={form.rating} size="lg" onPick={(r) => setForm((f) => ({ ...f, rating: r }))} /></div>
            <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Give your review a title" maxLength={80} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e91e8c]" />
            <textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} rows={4} placeholder="What did you and your little one think?" maxLength={600} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e91e8c] resize-none" />
            {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
            <button type="submit" className="w-full bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold py-3 rounded-xl">Submit Review</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
