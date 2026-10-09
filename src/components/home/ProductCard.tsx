"use client";

import Image from "next/image";
import Link from "next/link";
import { categoryLabel, formatINR, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { CART_PATH, Stars, WishButton } from "@/components/ui";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const out = product.stock <= 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Image area */}
      <Link href={`/shop/${product.id}`} className={`${product.bg} relative flex items-center justify-center overflow-hidden`} style={{ height: 150 }}>
        <WishButton productId={product.id} className="absolute top-2 right-2 w-7 h-7" />
        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 16vw" />
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-[11px] text-[#e91e8c] font-semibold mb-0.5">{categoryLabel(product.categoryId)}</p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-sm font-bold text-[#1a1a2e] leading-tight mb-1 hover:text-[#e91e8c] transition-colors line-clamp-2">{product.name}</h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Stars rating={product.rating} />
          <span className="text-[11px] text-gray-500">({product.reviews})</span>
        </div>

        <p className="text-base font-black text-[#1a1a2e] mb-3">
          {formatINR(product.price)} <span className="text-xs font-semibold text-gray-400 line-through">{formatINR(product.origPrice)}</span>
        </p>

        <button
          disabled={out}
          onClick={() => addToCart(product.id)}
          className="mt-auto w-full bg-[#e91e8c] hover:bg-[#c2187a] text-white text-xs font-bold py-2 rounded-full flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CART_PATH} />
          </svg>
          {out ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
