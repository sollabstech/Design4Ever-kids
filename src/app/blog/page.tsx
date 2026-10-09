import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/content";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  const [feature, ...rest] = posts;
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="The Playroom Blog" emoji="📝" subtitle="Ideas, tips and activities for happy, curious kids." crumbs={[{ label: "Blog" }]} />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link href={`/blog/${feature.slug}`} className="group grid md:grid-cols-2 bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative aspect-[16/10] md:aspect-auto"><Image src={feature.cover} alt={feature.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority /></div>
          <div className="p-6 sm:p-8 flex flex-col justify-center">
            <span className="text-xs font-bold text-[#e91e8c] bg-[#fce4ec] px-2.5 py-1 rounded-full self-start">{feature.tag}</span>
            <h2 className="text-2xl font-black text-[#1a1a2e] mt-3 group-hover:text-[#e91e8c] transition-colors">{feature.title}</h2>
            <p className="text-sm text-gray-500 mt-2">{feature.excerpt}</p>
            <p className="text-xs text-gray-400 mt-4">{feature.date} · {feature.read} read</p>
          </div>
        </Link>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/10]"><Image src={p.cover} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" /></div>
              <div className="p-5">
                <span className="text-[11px] font-bold text-[#e91e8c]">{p.tag}</span>
                <h3 className="font-black text-[#1a1a2e] mt-1 group-hover:text-[#e91e8c] transition-colors">{p.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{p.excerpt}</p>
                <p className="text-xs text-gray-400 mt-3">{p.date} · {p.read} read</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
