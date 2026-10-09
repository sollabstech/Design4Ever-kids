import type { Metadata } from "next";
import { coupons, discountOf, products } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";
import ProductListing from "@/components/shop/ProductListing";
import CouponCard from "./CouponCard";

export const metadata: Metadata = { title: "Offers & Deals" };

export default function OffersPage() {
  const deals = products.filter((p) => discountOf(p) >= 33);
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="Special Offers" emoji="⭐" subtitle="Coupon codes and our biggest discounts, all in one place." crumbs={[{ label: "Offers" }]} />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((c, i) => <CouponCard key={c.code} coupon={c} index={i} />)}
        </div>
        <div className="mt-4 bg-[#e8f5e9] rounded-2xl px-5 py-3 text-sm font-semibold text-[#2e7d32] flex items-center gap-2">
          🚚 Free standard delivery on every order above ₹499 — no code needed.
        </div>
      </div>
      <ProductListing base={deals} heading="{count} Deals Up To 40% Off" defaultSort="Biggest Discount" />
    </div>
  );
}
