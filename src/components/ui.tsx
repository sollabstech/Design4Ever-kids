"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { discountOf, formatINR, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";

const STAR_PATH =
  "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z";

export const HEART_PATH =
  "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z";

export const CART_PATH =
  "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z";

export function Stars({ rating, size = "sm", onPick }: { rating: number; size?: "xs" | "sm" | "md" | "lg"; onPick?: (r: number) => void }) {
  const sz = { xs: "w-3 h-3", sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-7 h-7" }[size];
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const cls = `${sz} ${i < filled ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-200 fill-gray-200"}`;
        return onPick ? (
          <button key={i} type="button" onClick={() => onPick(i + 1)} aria-label={`${i + 1} star${i ? "s" : ""}`} className="hover:scale-110 transition-transform">
            <svg className={cls} viewBox="0 0 20 20"><path d={STAR_PATH} /></svg>
          </button>
        ) : (
          <svg key={i} className={cls} viewBox="0 0 20 20"><path d={STAR_PATH} /></svg>
        );
      })}
    </div>
  );
}

export function StarIcon({ className = "w-3 h-3 text-[#fbbf24] fill-[#fbbf24]" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 20 20"><path d={STAR_PATH} /></svg>;
}

export function WishButton({ productId, className = "" }: { productId: number; className?: string }) {
  const { isWished, toggleWishlist } = useStore();
  const on = isWished(productId);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(productId); }}
      className={`z-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${className}`}
      aria-label={on ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={on}
    >
      <svg className={`w-4 h-4 transition-colors ${on ? "fill-[#e91e8c] stroke-[#e91e8c]" : "fill-none stroke-gray-400"}`} strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d={HEART_PATH} />
      </svg>
    </button>
  );
}

function CartGlyph({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CART_PATH} />
    </svg>
  );
}

/** Grid card used on shop, category, offers, search and home sections. */
export function ProductCard({ product, imageHeight = 200 }: { product: Product; imageHeight?: number }) {
  const { addToCart } = useStore();
  const router = useRouter();
  const out = product.stock <= 0;
  const off = discountOf(product);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col group">
      <Link href={`/shop/${product.id}`} className="block">
        <div className={`${product.bg} relative overflow-hidden`} style={{ height: imageHeight }}>
          {(product.bestseller || product.isNew) && (
            <span className={`absolute top-2.5 left-2.5 z-10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm ${product.isNew ? "bg-[#4caf50]" : "bg-[#e91e8c]"}`}>
              {product.isNew ? "New" : "Bestseller"}
            </span>
          )}
          <WishButton productId={product.id} className="absolute top-2.5 right-2.5 w-7 h-7" />
          <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
          {out && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-[#1a1a2e] text-white text-xs font-bold px-3 py-1.5 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link href={`/shop/${product.id}`}>
          <h3 className="text-sm font-bold text-[#1a1a2e] leading-tight mb-1.5 line-clamp-2 hover:text-[#e91e8c] transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-2">
          <Stars rating={product.rating} />
          <span className="text-xs font-semibold text-[#1a1a2e]">{product.rating}</span>
          <span className="text-[11px] text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="text-base font-black text-[#1a1a2e]">{formatINR(product.price)}</span>
          <span className="text-xs text-gray-400 line-through">{formatINR(product.origPrice)}</span>
          <span className="text-[10px] font-bold text-[#00897b] bg-[#e0f2f1] px-1.5 py-0.5 rounded">{off}% OFF</span>
        </div>
        <div className="mt-auto flex gap-2">
          <button
            disabled={out}
            onClick={() => addToCart(product.id)}
            className="flex-1 flex items-center justify-center gap-1 border border-[#e91e8c] text-[#e91e8c] text-[11px] font-bold py-2 rounded-full hover:bg-pink-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CartGlyph className="w-3.5 h-3.5 shrink-0" />
            Add to Cart
          </button>
          <button
            disabled={out}
            onClick={() => { addToCart(product.id); router.push("/checkout"); }}
            className="flex-1 bg-[#e91e8c] hover:bg-[#c2187a] text-white text-[11px] font-bold py-2 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

/** Compact recommendation card ("You May Also Like"). */
export function RecoCard({ product, height = 170 }: { product: Product; height?: number }) {
  const { addToCart, cart } = useStore();
  const inCart = cart.some((c) => c.product.id === product.id);
  const out = product.stock <= 0;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="relative shrink-0" style={{ height }}>
        <Link href={`/shop/${product.id}`} className="block absolute inset-0">
          <div className={`${product.bg} absolute inset-0`} />
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 20vw" />
        </Link>
        <WishButton productId={product.id} className="absolute top-2.5 right-2.5 w-8 h-8 shadow" />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/shop/${product.id}`}>
          <h4 className="text-sm font-bold text-[#1a1a2e] line-clamp-2 mb-1 hover:text-[#e91e8c] transition-colors">{product.name}</h4>
        </Link>
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <span className="font-black text-sm text-[#1a1a2e]">{formatINR(product.price)}</span>
          <span className="text-xs text-gray-400 line-through">{formatINR(product.origPrice)}</span>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <Stars rating={product.rating} size="xs" />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <button
          disabled={out}
          onClick={() => addToCart(product.id)}
          className={`mt-auto w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
            inCart ? "bg-[#e8f5e9] text-[#4caf50] hover:bg-[#dcedc8]" : "bg-[#e91e8c] text-white hover:bg-[#c2187a]"
          }`}
        >
          {out ? "Out of Stock" : inCart ? (
            <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>In Cart · Add More</>
          ) : (
            <><CartGlyph />Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

export function SectionTitle({ title, emoji = "✨", href, linkLabel = "View All" }: { title: string; emoji?: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl sm:text-2xl font-black text-[#1a1a2e] flex items-center gap-2">
        {title} <span>{emoji}</span>
      </h2>
      {href && (
        <Link href={href} className="text-sm font-bold text-[#e91e8c] hover:underline flex items-center gap-1">
          {linkLabel} <span>→</span>
        </Link>
      )}
    </div>
  );
}

export interface Crumb { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-[#e91e8c] flex items-center gap-1 transition-colors">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
        Home
      </Link>
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <span>›</span>
          {c.href ? (
            <Link href={c.href} className="hover:text-[#e91e8c] transition-colors">{c.label}</Link>
          ) : (
            <span className="text-[#1a1a2e] font-semibold truncate max-w-[220px]">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Pink gradient header strip shared by inner pages (same style as the cart page). */
export function PageHeader({ title, subtitle, crumbs, emoji, children }: { title: string; subtitle?: string; crumbs: Crumb[]; emoji?: string; children?: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-[#fce4ec] to-[#fdf6fb] py-6 sm:py-8 border-b border-pink-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={crumbs} />
        <div className="flex items-end justify-between gap-4 flex-wrap mt-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] flex items-center gap-2">
              {title} {emoji && <span>{emoji}</span>}
            </h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1 max-w-2xl">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ emoji, title, text, href, cta }: { emoji: string; title: string; text: string; href?: string; cta?: string }) {
  return (
    <div className="bg-white rounded-2xl p-10 sm:p-12 text-center border border-gray-100 shadow-sm">
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-xl sm:text-2xl font-black text-[#1a1a2e] mb-2">{title}</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">{text}</p>
      {href && cta && (
        <Link href={href} className="inline-block bg-[#e91e8c] text-white font-bold px-8 py-3 rounded-full hover:bg-[#c2187a] transition-colors">
          {cta}
        </Link>
      )}
    </div>
  );
}

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-gray-400">
      <div className="w-10 h-10 rounded-full border-4 border-pink-100 border-t-[#e91e8c] animate-spin" />
      <span className="text-sm font-semibold">{label}</span>
    </div>
  );
}

export const inputCls =
  "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#e91e8c] transition-colors bg-white";

export function Field({ label, required, error, children, hint }: { label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
        {label} {required && <span className="text-[#e91e8c]">*</span>}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500 font-semibold mt-1">{error}</p> : hint ? <p className="text-xs text-gray-400 mt-1">{hint}</p> : null}
    </div>
  );
}

export const statusStyles: Record<string, { cls: string; icon: string }> = {
  Processing: { cls: "bg-[#fff7e6] text-[#f59e0b]", icon: "⏳" },
  Shipped: { cls: "bg-[#e3f2fd] text-[#1e88e5]", icon: "📦" },
  "Out for Delivery": { cls: "bg-[#f3e5f5] text-[#8e24aa]", icon: "🚚" },
  Delivered: { cls: "bg-[#e8f5e9] text-[#2e7d32]", icon: "✅" },
  Cancelled: { cls: "bg-[#fdecec] text-[#ef4444]", icon: "⛔" },
  "Return Requested": { cls: "bg-[#fff3e0] text-[#ef6c00]", icon: "↩️" },
};

export function StatusPill({ status }: { status: string }) {
  const s = statusStyles[status] ?? statusStyles.Processing;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap ${s.cls}`}>
      <span className="text-[11px]">{s.icon}</span>
      {status}
    </span>
  );
}

export const fmtDate = (iso: string, withTime = false) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  if (!withTime) return date;
  return `${date}, ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
};

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className={`relative bg-white w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 pt-5 pb-3 sticky top-0 bg-white z-10">
          <h3 className="font-black text-[#1a1a2e] text-lg">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">✕</button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
