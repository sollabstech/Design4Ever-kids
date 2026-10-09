import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import FaqList from "./FaqList";

export const metadata: Metadata = { title: "Help Center" };

const quick = [
  { emoji: "📦", label: "Track Order", href: "/track-order" },
  { emoji: "🔄", label: "Returns & Refunds", href: "/returns" },
  { emoji: "🚚", label: "Shipping Info", href: "/shipping" },
  { emoji: "👤", label: "My Account", href: "/account" },
];

export default function HelpPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Help Center" emoji="💁" subtitle="Answers to common questions about orders, payments and returns." crumbs={[{ label: "Help Center" }]} />
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quick.map((q) => (
            <Link key={q.href} href={q.href} className="bg-white rounded-2xl border border-gray-100 p-5 text-center hover:border-[#e91e8c] hover:shadow-md transition-all">
              <div className="text-3xl mb-2">{q.emoji}</div>
              <div className="text-sm font-bold text-[#1a1a2e]">{q.label}</div>
            </Link>
          ))}
        </div>
        <FaqList />
        <div className="bg-[#e91e8c] rounded-2xl p-6 text-white flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="text-lg font-black">Didn&apos;t find your answer?</div>
            <div className="text-sm opacity-90">Write to us and we&apos;ll get back within 24 hours.</div>
          </div>
          <Link href="/contact" className="bg-white text-[#e91e8c] font-black px-6 py-3 rounded-full hover:bg-pink-50">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
