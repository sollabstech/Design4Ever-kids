import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";
import { Spinner } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse toys, books, art & craft, educational toys and more for kids.",
};

export default function ShopPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Suspense fallback={<Spinner label="Loading products…" />}>
        <ShopClient />
      </Suspense>
    </div>
  );
}
