import type { Metadata } from "next";
import { bestSellers } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";
import ProductListing from "@/components/shop/ProductListing";

export const metadata: Metadata = { title: "Best Sellers" };

export default function BestSellersPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Best Sellers" emoji="🏆" subtitle="The toys and books parents love most." crumbs={[{ label: "Best Sellers" }]} />
      <ProductListing base={bestSellers()} heading="{count} Best Selling Products" />
    </div>
  );
}
