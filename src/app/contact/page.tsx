import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

const channels = [
  { emoji: "📧", title: "Email", value: "support@design4ever.com", sub: "Replies within 24 hours" },
  { emoji: "📞", title: "Phone", value: "+91 44 4000 1234", sub: "Mon–Sat, 9 AM – 7 PM" },
  { emoji: "💬", title: "WhatsApp", value: "+91 98765 00000", sub: "Quick order help" },
  { emoji: "📍", title: "Office", value: "Anna Nagar, Chennai", sub: "Tamil Nadu 600040" },
];

export default function ContactPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Say Hello!" emoji="👋" subtitle="Questions about an order, a product or a partnership? We're here to help." crumbs={[{ label: "Contact Us" }]} />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <ContactForm />
        <div className="space-y-3">
          {channels.map((c) => (
            <div key={c.title} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#fce4ec] flex items-center justify-center text-2xl shrink-0">{c.emoji}</div>
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase">{c.title}</div>
                <div className="font-bold text-[#1a1a2e]">{c.value}</div>
                <div className="text-xs text-gray-500">{c.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
