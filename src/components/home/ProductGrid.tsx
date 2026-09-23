import Link from "next/link";
import ProductCard from "./ProductCard";

const BASE = "https://images.unsplash.com";

const products = [
  {
    id: 1,
    name: "Wooden Puzzle",
    category: "Educational Toys",
    price: 450,
    rating: 5,
    reviews: 124,
    image: `${BASE}/photo-1589495374906-b7f5ca5de879?w=300&h=300&fit=crop&auto=format&q=80`,
    bg: "bg-[#fff8f0]",
  },
  {
    id: 2,
    name: "Coloring Art Kit",
    category: "Art & Craft",
    price: 299,
    rating: 5,
    reviews: 98,
    image: `${BASE}/photo-1560421683-6856ea585c78?w=300&h=300&fit=crop&auto=format&q=80`,
    bg: "bg-[#fff0f7]",
  },
  {
    id: 3,
    name: "Building Blocks",
    category: "Toys",
    price: 590,
    rating: 5,
    reviews: 76,
    image: `${BASE}/photo-1587654780291-39c9404d746b?w=300&h=300&fit=crop&auto=format&q=80`,
    bg: "bg-[#f0f4ff]",
  },
  {
    id: 4,
    name: "Story Books Set",
    category: "Books",
    price: 499,
    rating: 5,
    reviews: 112,
    image: `${BASE}/photo-1455884981818-54cb785db6fc?w=300&h=300&fit=crop&auto=format&q=80`,
    bg: "bg-[#f0fff4]",
  },
  {
    id: 5,
    name: "Montessori Stacking Toy",
    category: "Educational Toys",
    price: 699,
    rating: 4,
    reviews: 64,
    image: `${BASE}/photo-1629583908828-2cb711a77327?w=300&h=300&fit=crop&auto=format&q=80`,
    bg: "bg-[#fffbf0]",
  },
  {
    id: 6,
    name: "Kids Backpack",
    category: "Baby & Kids",
    price: 899,
    rating: 4,
    reviews: 52,
    image: `${BASE}/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop&auto=format&q=80`,
    bg: "bg-[#f7f0ff]",
  },
];

interface ProductGridProps {
  title: string;
}

export default function ProductGrid({ title }: ProductGridProps) {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#1a1a2e] flex items-center gap-2">
            {title} <span>✨</span>
          </h2>
          <Link
            href="/shop"
            className="text-sm font-bold text-[#e91e8c] hover:underline flex items-center gap-1"
          >
            View All <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
