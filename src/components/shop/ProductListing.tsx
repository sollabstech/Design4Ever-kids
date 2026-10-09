"use client";

import { useEffect, useMemo, useState } from "react";
import { ageGroups, categories, discountOf, inCategory, type Product } from "@/lib/catalog";
import { ProductCard, StarIcon } from "@/components/ui";

const PAGE_SIZE = 8;

const sortOptions = ["Most Popular", "Price: Low to High", "Price: High to Low", "Newest First", "Top Rated", "Biggest Discount"] as const;
type SortOption = (typeof sortOptions)[number];

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between w-full mb-0" aria-expanded={open}>
        <h4 className="font-bold text-[#1a1a2e] text-sm">{title}</h4>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? "" : "rotate-180"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

const checkboxCls = "w-4 h-4 rounded border-gray-300 accent-[#e91e8c]";

export interface ProductListingProps {
  /** Pool of products this listing works on (already scoped by page). */
  base: Product[];
  /** Heading shown above the grid; `{count}` is replaced with the result count. */
  heading?: string;
  /** Show the category pill tabs and category filter. */
  showCategoryFilters?: boolean;
  initialCategory?: string;
  initialQuery?: string;
  defaultSort?: SortOption;
}

export default function ProductListing({
  base,
  heading = "{count} Products",
  showCategoryFilters = true,
  initialCategory = "all",
  initialQuery = "",
  defaultSort = "Most Popular",
}: ProductListingProps) {
  const [activeTab, setActiveTab] = useState(initialCategory);
  const [checkedCats, setCheckedCats] = useState<string[]>([]);
  const [checkedAges, setCheckedAges] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(2000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStock, setInStock] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>(defaultSort);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(initialQuery);
  const [drawer, setDrawer] = useState(false);

  // Follow URL changes (e.g. a new search from the navbar).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => { setQuery(initialQuery); setPage(1); }, [initialQuery]);
  useEffect(() => { setActiveTab(initialCategory); setPage(1); }, [initialCategory]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const reset = <T,>(fn: (v: T) => void) => (v: T) => { fn(v); setPage(1); };
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const clearAll = () => {
    setCheckedCats([]); setCheckedAges([]); setMinRating(null); setInStock(false); setOnSale(false); setPriceMax(2000); setQuery(""); setActiveTab("all"); setPage(1);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = base.filter((p) => {
      if (activeTab !== "all" && !inCategory(p, activeTab)) return false;
      if (checkedCats.length && !checkedCats.some((c) => inCategory(p, c))) return false;
      if (checkedAges.length) {
        const ok = checkedAges.some((label) => {
          const g = ageGroups.find((a) => a.label === label)!;
          return p.ageMin <= g.max && p.ageMax >= g.min;
        });
        if (!ok) return false;
      }
      if (p.price > priceMax) return false;
      if (minRating && p.rating < minRating) return false;
      if (inStock && p.stock <= 0) return false;
      if (onSale && discountOf(p) < 35) return false;
      if (q && !(`${p.name} ${p.tagline} ${p.description} ${p.categoryId}`.toLowerCase().includes(q))) return false;
      return true;
    });
    const sorted = [...list];
    switch (sortBy) {
      case "Price: Low to High": sorted.sort((a, b) => a.price - b.price); break;
      case "Price: High to Low": sorted.sort((a, b) => b.price - a.price); break;
      case "Newest First": sorted.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo); break;
      case "Top Rated": sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case "Biggest Discount": sorted.sort((a, b) => discountOf(b) - discountOf(a)); break;
      default: sorted.sort((a, b) => a.rank - b.rank);
    }
    return sorted;
  }, [base, activeTab, checkedCats, checkedAges, priceMax, minRating, inStock, onSale, query, sortBy]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const activeFilterCount = checkedCats.length + checkedAges.length + (minRating ? 1 : 0) + (inStock ? 1 : 0) + (onSale ? 1 : 0) + (priceMax < 2000 ? 1 : 0);

  const goTo = (n: number) => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const filters = (
    <>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-black text-[#1a1a2e] text-base">Filters</h3>
        <button onClick={clearAll} className="text-xs font-bold text-[#e91e8c] hover:underline">Clear All</button>
      </div>

      {showCategoryFilters && (
        <FilterSection title="Category">
          {categories.map((cat) => {
            const count = base.filter((p) => inCategory(p, cat.id)).length;
            return (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={checkedCats.includes(cat.id)} onChange={() => reset(setCheckedCats)(toggle(checkedCats, cat.id))} className={checkboxCls} />
                <span className="text-sm text-gray-600 group-hover:text-[#1a1a2e] flex-1 leading-none">{cat.label}</span>
                <span className="text-[11px] text-gray-400">({count})</span>
              </label>
            );
          })}
        </FilterSection>
      )}

      <FilterSection title="Age Group">
        {ageGroups.map((age) => (
          <label key={age.label} className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={checkedAges.includes(age.label)} onChange={() => reset(setCheckedAges)(toggle(checkedAges, age.label))} className={checkboxCls} />
            <span className="text-sm text-gray-600 group-hover:text-[#1a1a2e]">{age.label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Price Range">
        <input type="range" min={100} max={2000} step={50} value={priceMax} onChange={(e) => reset(setPriceMax)(Number(e.target.value))} className="w-full accent-[#e91e8c] h-1.5" aria-label="Maximum price" />
        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
          <span>₹0</span>
          <span className="font-bold text-[#1a1a2e]">Up to ₹{priceMax.toLocaleString("en-IN")}</span>
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        {[4.8, 4.5, 4].map((r) => (
          <label key={r} className="flex items-center gap-2 cursor-pointer group">
            <input type="radio" name="min-rating" checked={minRating === r} onChange={() => reset(setMinRating)(r)} className={checkboxCls} />
            <StarIcon className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
            <span className="text-xs text-gray-600 font-semibold">{r} & above</span>
          </label>
        ))}
        {minRating && <button onClick={() => reset(setMinRating)(null)} className="text-xs text-gray-400 hover:text-[#e91e8c]">Any rating</button>}
      </FilterSection>

      <FilterSection title="Availability">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={inStock} onChange={() => reset(setInStock)(!inStock)} className={checkboxCls} />
          <span className="text-sm text-gray-600">In Stock</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={onSale} onChange={() => reset(setOnSale)(!onSale)} className={checkboxCls} />
          <span className="text-sm text-gray-600">Big Sale (35%+ off)</span>
        </label>
      </FilterSection>
    </>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Category Tabs */}
      {showCategoryFilters && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {[{ id: "all", label: "All", emoji: "" }, ...categories].map((tab) => (
            <button
              key={tab.id}
              onClick={() => reset(setActiveTab)(tab.id)}
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
      )}

      <div className="flex gap-5 items-start">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block w-[240px] shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-32">{filters}</div>
        </aside>

        {/* Mobile filter drawer */}
        {drawer && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDrawer(false)} />
            <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white p-5 overflow-y-auto shadow-xl">
              {filters}
              <button onClick={() => setDrawer(false)} className="w-full mt-4 bg-[#e91e8c] text-white font-bold py-3 rounded-xl">
                Show {filtered.length} Products
              </button>
            </div>
          </div>
        )}

        {/* Products area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div>
              <h2 className="font-black text-[#1a1a2e] text-lg">{heading.replace("{count}", String(filtered.length))}</h2>
              {query && (
                <p className="text-sm text-gray-500 mt-0.5">
                  Results for <span className="font-bold text-[#1a1a2e]">&ldquo;{query}&rdquo;</span>{" "}
                  <button onClick={() => reset(setQuery)("")} className="text-[#e91e8c] font-bold hover:underline ml-1">Clear</button>
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setDrawer(true)} className="lg:hidden text-sm font-bold text-[#1a1a2e] border border-gray-200 rounded-xl px-3 py-1.5 bg-white flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 12h12M10 20h4" /></svg>
                Filters{activeFilterCount ? ` (${activeFilterCount})` : ""}
              </button>
              <span className="text-sm text-gray-500 hidden sm:block">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => reset(setSortBy)(e.target.value as SortOption)}
                aria-label="Sort products"
                className="text-sm font-semibold text-[#1a1a2e] border border-gray-200 rounded-xl px-3 py-1.5 bg-white focus:outline-none focus:border-[#e91e8c] cursor-pointer"
              >
                {sortOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-black text-[#1a1a2e] text-lg mb-1">No products match your filters</h3>
              <p className="text-sm text-gray-500 mb-5">Try removing a filter or searching for something else.</p>
              <button onClick={clearAll} className="bg-[#e91e8c] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#c2187a] transition-colors">Clear All Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {pages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button onClick={() => goTo(Math.max(1, current - 1))} disabled={current === 1} aria-label="Previous page"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors text-sm font-bold disabled:opacity-40">«</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => goTo(n)} aria-current={current === n ? "page" : undefined}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    current === n ? "bg-[#e91e8c] text-white border border-[#e91e8c]" : "border border-gray-200 text-gray-600 hover:border-[#e91e8c] hover:text-[#e91e8c]"
                  }`}>{n}</button>
              ))}
              <button onClick={() => goTo(Math.min(pages, current + 1))} disabled={current === pages} aria-label="Next page"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors text-sm font-bold disabled:opacity-40">»</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
