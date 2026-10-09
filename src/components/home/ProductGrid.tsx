import Link from "next/link";
import ProductCard from "./ProductCard";
import { bestSellers, products } from "@/lib/catalog";

interface ProductGridProps {
  title: string;
  kind?: "featured" | "bestsellers";
}

export default function ProductGrid({ title, kind = "featured" }: ProductGridProps) {
  const list =
    kind === "bestsellers"
      ? bestSellers().slice(0, 6)
      : [...products].filter((p) => p.stock > 0).sort((a, b) => b.rating - a.rating || a.rank - b.rank).slice(0, 6);
  const href = kind === "bestsellers" ? "/best-sellers" : "/shop";

  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#1a1a2e] flex items-center gap-2">
            {title} <span>✨</span>
          </h2>
          <Link href={href} className="text-sm font-bold text-[#e91e8c] hover:underline flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
