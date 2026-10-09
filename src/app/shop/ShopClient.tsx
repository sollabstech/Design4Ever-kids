"use client";

import { useSearchParams } from "next/navigation";
import ProductListing from "@/components/shop/ProductListing";
import { getCategory, products } from "@/lib/catalog";

export default function ShopClient() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const cat = params.get("category") ?? "all";
  return (
    <ProductListing
      base={products}
      heading={q ? "{count} Products Found" : "{count} Products"}
      initialQuery={q}
      initialCategory={getCategory(cat) ? cat : "all"}
    />
  );
}
