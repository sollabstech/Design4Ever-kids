import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/content";
import { bestSellers } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui";
import { RecoCard } from "@/components/ui";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return { title: post?.title ?? "Blog", description: post?.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const others = posts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6 py-8">
        <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
        <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-5">
          <div className="relative aspect-[16/8]"><Image src={post.cover} alt={post.title} fill className="object-cover" sizes="860px" priority /></div>
          <div className="p-6 sm:p-10">
            <span className="text-xs font-bold text-[#e91e8c] bg-[#fce4ec] px-2.5 py-1 rounded-full">{post.tag}</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mt-3">{post.title}</h1>
            <p className="text-xs text-gray-400 mt-2">{post.date} · {post.read} read · Design4Ever Team</p>
            <div className="mt-6 space-y-4">
              {post.body.map((para, i) => <p key={i} className="text-gray-700 leading-relaxed">{para}</p>)}
            </div>
          </div>
        </article>

        <h2 className="text-lg font-black text-[#1a1a2e] mt-10 mb-4">Shop the picks ✨</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {bestSellers().slice(0, 3).map((p) => <RecoCard key={p.id} product={p} />)}
        </div>

        <h2 className="text-lg font-black text-[#1a1a2e] mt-10 mb-4">More from the blog</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {others.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-[#e91e8c] transition-colors">
              <span className="text-[11px] font-bold text-[#e91e8c]">{p.tag}</span>
              <div className="font-bold text-sm text-[#1a1a2e] mt-1">{p.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
