import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";
import VendorForms from "./VendorForms";

export const metadata: Metadata = { title: "Sell With Us" };

const perks = [
  { emoji: "👨‍👩‍👧", title: "50,000+ families", text: "Reach parents actively shopping for kids across India." },
  { emoji: "💰", title: "Weekly payouts", text: "Get paid every 7 days for delivered orders." },
  { emoji: "🚚", title: "Shipping handled", text: "Pan-India pickup and delivery through our courier partners." },
  { emoji: "📈", title: "Growth tools", text: "Dashboard with sales, inventory and customer insights." },
];

const steps = ["Register your business", "Get verified in 2–3 days", "List your products", "Start receiving orders"];

export default function SellWithUsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Sell With Us" emoji="🤝" subtitle="Bring your toys, books and kids' products to thousands of happy families." crumbs={[{ label: "Sell With Us" }]} />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="text-3xl mb-2">{p.emoji}</div>
              <div className="font-black text-[#1a1a2e]">{p.title}</div>
              <p className="text-sm text-gray-500 mt-1">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap items-center justify-between gap-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-[#e91e8c] text-white font-black flex items-center justify-center">{i + 1}</span>
              <span className="text-sm font-bold text-[#1a1a2e]">{s}</span>
            </div>
          ))}
        </div>
        <VendorForms />
        <p className="text-sm text-gray-500 text-center">Before applying, please read our <Link href="/partner-guidelines" className="font-bold text-[#e91e8c] hover:underline">Partner Guidelines</Link>.</p>
      </div>
    </div>
  );
}
