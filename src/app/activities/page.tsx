import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Activities" };

const activities = [
  { emoji: "🎨", title: "Color & Draw", desc: "Drawing prompts and colouring fun.", href: "/categories/art-craft", bg: "bg-[#fffde7]" },
  { emoji: "📖", title: "Story Corner", desc: "Illustrated stories for young readers.", href: "/categories/books", bg: "bg-[#e3f2fd]" },
  { emoji: "🧩", title: "Puzzles", desc: "Mazes, matching and logic games.", href: "/categories/puzzles", bg: "bg-[#e8f5e9]" },
  { emoji: "🔤", title: "Learn ABC & 123", desc: "Tracing books and flash cards.", href: "/categories/educational", bg: "bg-[#fce4ec]" },
  { emoji: "⚽", title: "Get Moving", desc: "Outdoor games to burn energy.", href: "/categories/outdoor", bg: "bg-[#fbe9e7]" },
  { emoji: "📝", title: "Parent Tips", desc: "Ideas and guides from our blog.", href: "/blog", bg: "bg-[#f3e5f5]" },
];

export default function ActivitiesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Activities" emoji="🎉" subtitle="Pick something that looks fun and dive in!" crumbs={[{ label: "Activities" }]} />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activities.map((a) => (
          <Link key={a.title} href={a.href} className={`${a.bg} rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center`}>
            <div className="text-5xl mb-3">{a.emoji}</div>
            <h2 className="text-xl font-black text-[#1a1a2e] mb-1">{a.title}</h2>
            <p className="text-gray-600 text-sm">{a.desc}</p>
            <span className="inline-block mt-4 text-sm font-bold px-5 py-2 rounded-full bg-white text-[#e91e8c]">Explore →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
