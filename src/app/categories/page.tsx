import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { categories, productsIn } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Shop by Category" emoji="🧩" subtitle="Find the perfect pick for every age and interest." crumbs={[{ label: "Categories" }]} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Link key={c.id} href={`/categories/${c.id}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`${c.bg} relative aspect-[4/3] overflow-hidden`}>
                <Image src={c.image} alt={c.label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                <span className="absolute top-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">{c.emoji}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-black text-[#1a1a2e] group-hover:text-[#e91e8c] transition-colors">{c.label}</h2>
                  <span className="text-xs font-bold text-[#e91e8c] bg-[#fce4ec] px-2 py-0.5 rounded-full">{productsIn(c.id).length} items</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
