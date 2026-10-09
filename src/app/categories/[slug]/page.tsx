import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory, productsIn } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";
import ProductListing from "@/components/shop/ProductListing";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  return { title: c ? c.label : "Category" };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) notFound();
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title={c.label} emoji={c.emoji} subtitle={c.blurb} crumbs={[{ label: "Categories", href: "/categories" }, { label: c.label }]} />
      <ProductListing base={productsIn(c.id)} showCategoryFilters={false} heading={`{count} ${c.label} Products`} />
    </div>
  );
}
