"use client";

import Image from "next/image";
import Link from "next/link";
import { categoryLabel, discountOf, formatINR, getProduct, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { EmptyState, Stars } from "@/components/ui";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart, cart } = useStore();
  const items = wishlist.map(getProduct).filter((p): p is Product => !!p);
  const inStock = items.filter((p) => p.stock > 0 && !cart.some((c) => c.product.id === p.id));

  const moveToCart = (p: Product) => { addToCart(p.id); toggleWishlist(p.id); };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="px-5 sm:px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-black text-[#1a1a2e]">My Wishlist <span className="text-gray-400 text-base font-semibold">({items.length})</span></h1>
        {inStock.length > 1 && (
          <button onClick={() => inStock.forEach((p) => addToCart(p.id))} className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-sm font-bold px-4 py-2 rounded-xl">
            Add All to Cart ({inStock.length})
          </button>
        )}
      </div>
      <div className="p-5 sm:p-6">
        {items.length === 0 ? (
          <EmptyState emoji="💝" title="Your wishlist is empty" text="Tap the heart on any product to save it for later." href="/shop" cta="Explore Products" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
            {items.map((p) => {
              const out = p.stock <= 0;
              return (
                <div key={p.id} className="border border-gray-100 rounded-2xl overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className={`${p.bg} relative`} style={{ height: 170 }}>
                    <Link href={`/shop/${p.id}`} className="absolute inset-0"><Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" /></Link>
                    <button onClick={() => toggleWishlist(p.id)} aria-label={`Remove ${p.name} from wishlist`} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-400 hover:text-red-500">✕</button>
                    {out && <span className="absolute bottom-2 left-2 bg-[#1a1a2e] text-white text-[10px] font-bold px-2 py-1 rounded-full">Out of Stock</span>}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-[11px] text-[#e91e8c] font-semibold">{categoryLabel(p.categoryId)}</p>
                    <Link href={`/shop/${p.id}`} className="text-sm font-bold text-[#1a1a2e] hover:text-[#e91e8c] line-clamp-2">{p.name}</Link>
                    <div className="flex items-center gap-1 my-1"><Stars rating={p.rating} size="xs" /><span className="text-[11px] text-gray-400">({p.reviews})</span></div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      <span className="font-black text-[#1a1a2e]">{formatINR(p.price)}</span>
                      <span className="text-xs text-gray-400 line-through">{formatINR(p.origPrice)}</span>
                      <span className="text-[10px] font-bold text-[#00897b] bg-[#e0f2f1] px-1.5 py-0.5 rounded">{discountOf(p)}% OFF</span>
                    </div>
                    <button disabled={out} onClick={() => moveToCart(p)} className="mt-auto w-full bg-[#e91e8c] hover:bg-[#c2187a] text-white text-xs font-bold py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
                      {out ? "Out of Stock" : "Move to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
