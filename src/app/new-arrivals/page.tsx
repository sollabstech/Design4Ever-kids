import type { Metadata } from "next";
import { newArrivals } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";
import ProductListing from "@/components/shop/ProductListing";

export const metadata: Metadata = { title: "New Arrivals" };

export default function NewArrivalsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="New Arrivals" emoji="🆕" subtitle="Fresh picks added in the last few weeks." crumbs={[{ label: "New Arrivals" }]} />
      <ProductListing base={newArrivals()} heading="{count} New Products" defaultSort="Newest First" />
    </div>
  );
}
