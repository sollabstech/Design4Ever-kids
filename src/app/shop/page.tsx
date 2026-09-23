"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const BASE = "https://images.unsplash.com";

const tabs = [
  { id: "all", label: "All", emoji: null },
  { id: "toys", label: "Toys", emoji: "🧸" },
  { id: "books", label: "Books", emoji: "📚" },
  { id: "art-craft", label: "Art & Craft", emoji: "🎨" },
  { id: "educational", label: "Educational", emoji: "🔤" },
  { id: "baby-kids", label: "Baby & Kids", emoji: "👶" },
  { id: "gifts", label: "Gifts", emoji: "🎁" },
  { id: "outdoor", label: "Outdoor Play", emoji: "🚗" },
  { id: "puzzles", label: "Puzzles & Games", emoji: "🧩" },
];

const filterCategories = [
  { label: "Toys", count: 12 },
  { label: "Books", count: 18 },
  { label: "Art & Craft", count: 10 },
  { label: "Educational", count: 16 },
  { label: "Baby & Kids", count: 8 },
  { label: "Gifts", count: 12 },
  { label: "Outdoor Play", count: 6 },
  { label: "Puzzles & Games", count: 14 },
];

const ageGroups = ["0 - 2 Years", "3 - 5 Years", "6 - 8 Years", "9 - 12 Years"];

interface Product {
  id: number;
  name: string;
  price: number;
  origPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  bg: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "Alphabet Tracing Workbook",
    price: 299,
    origPrice: 499,
    discount: 40,
    rating: 4.9,
    reviews: 128,
    image: `${BASE}/photo-1481627834876-b7833e8f5570?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#fef9ef]",
  },
  {
    id: 2,
    name: "Wooden Stacking Rings",
    price: 499,
    origPrice: 799,
    discount: 38,
    rating: 4.8,
    reviews: 96,
    image: `${BASE}/photo-1629583908828-2cb711a77327?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#fef0f7]",
  },
  {
    id: 3,
    name: "Mega Art & Craft Kit",
    price: 699,
    origPrice: 1099,
    discount: 36,
    rating: 4.8,
    reviews: 112,
    image: `${BASE}/photo-1560421683-6856ea585c78?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#fef3e2]",
  },
  {
    id: 4,
    name: "Number Tracing Workbook",
    price: 299,
    origPrice: 499,
    discount: 40,
    rating: 4.9,
    reviews: 104,
    image: `${BASE}/photo-1455884981818-54cb785db6fc?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#e3f4fd]",
  },
  {
    id: 5,
    name: "Educational Wooden Blocks",
    price: 599,
    origPrice: 899,
    discount: 33,
    rating: 4.8,
    reviews: 89,
    image: `${BASE}/photo-1587654780291-39c9404d746b?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#fff8f0]",
  },
  {
    id: 6,
    name: "Kids Water Bottle",
    price: 399,
    origPrice: 599,
    discount: 33,
    rating: 4.7,
    reviews: 76,
    image: `${BASE}/photo-1602143407151-7111542de6e8?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#fce4ec]",
  },
  {
    id: 7,
    name: "Outdoor Play Ball Set",
    price: 499,
    origPrice: 799,
    discount: 38,
    rating: 4.8,
    reviews: 92,
    image: `${BASE}/photo-1558618666-fcd25c85cd64?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#e8f5e9]",
  },
  {
    id: 8,
    name: "Animal Puzzle Set",
    price: 399,
    origPrice: 599,
    discount: 33,
    rating: 4.8,
    reviews: 108,
    image: `${BASE}/photo-1589495374906-b7f5ca5de879?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#f3e5f5]",
  },
  {
    id: 9,
    name: "Story Books Set (5 Books)",
    price: 699,
    origPrice: 1099,
    discount: 36,
    rating: 4.9,
    reviews: 145,
    image: `${BASE}/photo-1509266272358-7701da638078?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#fff3e0]",
  },
  {
    id: 10,
    name: "Learning Flash Cards",
    price: 399,
    origPrice: 599,
    discount: 33,
    rating: 4.8,
    reviews: 98,
    image: `${BASE}/photo-1434030216411-0b793f4b4173?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#e8f5e9]",
  },
  {
    id: 11,
    name: "Teddy Bear (Soft Toy)",
    price: 599,
    origPrice: 899,
    discount: 33,
    rating: 4.9,
    reviews: 121,
    image: `${BASE}/photo-1602734846297-9299fc2d4703?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#fff8f0]",
  },
  {
    id: 12,
    name: "Kids Drawing Board",
    price: 699,
    origPrice: 999,
    discount: 30,
    rating: 4.7,
    reviews: 84,
    image: `${BASE}/photo-1513364776144-60967b0f800f?w=320&h=260&fit=crop&auto=format&q=80`,
    bg: "bg-[#e3f4fd]",
  },
];

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < filled ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-200 fill-gray-200"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <Link href={`/shop/${product.id}`} className="block">
        <div className={`${product.bg} relative overflow-hidden`} style={{ height: 200 }}>
          <span className="absolute top-2.5 left-2.5 z-10 bg-[#e91e8c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
            Bestseller
          </span>
          <button
            onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
            className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"
            aria-label="Wishlist"
          >
            <svg
              className={`w-4 h-4 ${wished ? "text-[#e91e8c] fill-[#e91e8c]" : "text-gray-400"}`}
              fill={wished ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Info */}
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
          <span className="text-base font-black text-[#1a1a2e]">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.origPrice}</span>
          <span className="text-[10px] font-bold text-[#00897b] bg-[#e0f2f1] px-1.5 py-0.5 rounded">
            {product.discount}% OFF
          </span>
        </div>

        <div className="mt-auto flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1 border border-[#e91e8c] text-[#e91e8c] text-[11px] font-bold py-2 rounded-full hover:bg-pink-50 transition-colors">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
          <button className="flex-1 bg-[#e91e8c] hover:bg-[#c2187a] text-white text-[11px] font-bold py-2 rounded-full transition-colors">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full mb-0"
      >
        <h4 className="font-bold text-[#1a1a2e] text-sm">{title}</h4>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [checkedCats, setCheckedCats] = useState<string[]>([]);
  const [checkedAges, setCheckedAges] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(5000);
  const [checkedRatings, setCheckedRatings] = useState<number[]>([]);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [page, setPage] = useState(1);

  const toggleCat = (l: string) =>
    setCheckedCats((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));
  const toggleAge = (a: string) =>
    setCheckedAges((p) => (p.includes(a) ? p.filter((x) => x !== a) : [...p, a]));
  const toggleRating = (r: number) =>
    setCheckedRatings((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));

  const clearAll = () => {
    setCheckedCats([]);
    setCheckedAges([]);
    setCheckedRatings([]);
    setInStock(false);
    setOnSale(false);
    setPriceMax(5000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                activeTab === tab.id
                  ? "bg-[#e91e8c] text-white border-[#e91e8c] shadow-sm"
                  : "bg-white text-[#1a1a2e] border-gray-200 hover:border-[#e91e8c] hover:text-[#e91e8c]"
              }`}
            >
              {tab.emoji && <span className="text-base leading-none">{tab.emoji}</span>}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex gap-5 items-start">

          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-[240px] shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-black text-[#1a1a2e] text-base">Filters</h3>
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-[#e91e8c] hover:underline"
                >
                  Clear All
                </button>
              </div>

              <FilterSection title="Category">
                {filterCategories.map((cat) => (
                  <label key={cat.label} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedCats.includes(cat.label)}
                      onChange={() => toggleCat(cat.label)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#e91e8c]"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#1a1a2e] flex-1 leading-none">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-gray-400">({cat.count})</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Age Group">
                {ageGroups.map((age) => (
                  <label key={age} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedAges.includes(age)}
                      onChange={() => toggleAge(age)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#e91e8c]"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-[#1a1a2e]">{age}</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Price Range">
                <input
                  type="range"
                  min={0}
                  max={5000}
                  step={100}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#e91e8c] h-1.5"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                  <span>₹0</span>
                  <span>₹{priceMax.toLocaleString("en-IN")}</span>
                </div>
              </FilterSection>

              <FilterSection title="Rating">
                {[5, 4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={checkedRatings.includes(r)}
                      onChange={() => toggleRating(r)}
                      className="w-4 h-4 rounded border-gray-300 accent-[#e91e8c]"
                    />
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r }).map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">& above</span>
                  </label>
                ))}
              </FilterSection>

              <FilterSection title="Availability">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={() => setInStock((v) => !v)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#e91e8c]"
                  />
                  <span className="text-sm text-gray-600">In Stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onSale}
                    onChange={() => setOnSale((v) => !v)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#e91e8c]"
                  />
                  <span className="text-sm text-gray-600">On Sale</span>
                </label>
              </FilterSection>
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-[#1a1a2e] text-lg">
                {products.length} Best Selling Products
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm font-semibold text-[#1a1a2e] border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#e91e8c] cursor-pointer"
                >
                  <option>Most Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors text-sm font-bold"
              >
                «
              </button>
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    page === n
                      ? "bg-[#e91e8c] text-white border border-[#e91e8c]"
                      : "border border-gray-200 text-gray-600 hover:border-[#e91e8c] hover:text-[#e91e8c]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(3, p + 1))}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors text-sm font-bold"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
