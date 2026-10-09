"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ageLabel, categoryLabel, discountOf, formatINR, FREE_SHIPPING_THRESHOLD, getProduct, relatedProducts } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Breadcrumbs, CART_PATH, HEART_PATH, RecoCard, SectionTitle, Stars, StarIcon, fmtDate } from "@/components/ui";
import { FeatureSVG, getFeatures } from "@/components/shop/features";

const sampleReviews = [
  { name: "Priya S.", date: "2 weeks ago", rating: 5, text: "My daughter absolutely loves this! The quality is excellent and she has been using it every day. Highly recommended for all parents!", verified: true },
  { name: "Rahul M.", date: "1 month ago", rating: 5, text: "Great product! The quality is superb and delivery was fast. My kids are very happy with it. Would definitely buy again.", verified: true },
  { name: "Anita K.", date: "3 months ago", rating: 4, text: "Good value for money. My son enjoys it a lot. Delivery was quick and packaging was nice. Will order more items soon.", verified: false },
];

type Tab = "description" | "specs" | "reviews" | "shipping";

export default function ProductDetail({ productId }: { productId: number }) {
  const product = getProduct(productId)!;
  const router = useRouter();
  const { addToCart, cart, isWished, toggleWishlist, toast, user, orders, productReviews, addReview } = useStore();

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [form, setForm] = useState({ rating: 5, title: "", text: "" });
  const [formError, setFormError] = useState("");

  const wished = isWished(product.id);
  const inCart = cart.find((c) => c.product.id === product.id)?.qty ?? 0;
  const out = product.stock <= 0;
  const maxQty = Math.max(0, product.stock - inCart);
  const related = relatedProducts(product, 5);
  const features = getFeatures(product.material);
  const category = categoryLabel(product.categoryId);
  const mine = productReviews(product.id);
  const purchased = orders.some((o) => o.items.some((i) => i.productId === product.id));
  const reviewCount = product.reviews + mine.length;

  const handleAddToCart = () => {
    if (qty > maxQty) { toast(`Only ${maxQty} more available`, "error"); return; }
    addToCart(product.id, qty);
  };

  const handleBuyNow = () => {
    if (!inCart) addToCart(product.id, qty);
    router.push("/checkout");
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: product.name, text: product.tagline, url }); return; }
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard", "info");
    } catch { /* user cancelled share */ }
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 3) { setFormError("Please add a short title."); return; }
    if (form.text.trim().length < 10) { setFormError("Please write at least 10 characters."); return; }
    addReview({ productId: product.id, rating: form.rating, title: form.title.trim(), text: form.text.trim() });
    setForm({ rating: 5, title: "", text: "" });
    setFormError("");
  };

  const tags = [
    { emoji: "⭐", label: `Age\n${ageLabel(product)}`, bg: "bg-[#fffde7]" },
    { emoji: "🎲", label: "Learning\nThrough Play", bg: "bg-[#e8f5e9]" },
    { emoji: "🍃", label: `Safe\n${product.material.split(" ").slice(-1)[0]}`, bg: "bg-[#e8f5e9]" },
    { emoji: "🎁", label: "Perfect\nGift Choice", bg: "bg-[#fce4ec]" },
  ];

  const tabLabels: Record<Tab, string> = { description: "Description", specs: "Specifications", reviews: `Reviews (${reviewCount})`, shipping: "Shipping & Returns" };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: category, href: `/categories/${product.categoryId}` }, { label: product.name }]} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* LEFT: Gallery + Tags */}
          <div>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <div className="flex sm:flex-col gap-2 shrink-0">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`relative rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${activeImg === i ? "border-[#e91e8c]" : "border-gray-200 hover:border-gray-300"}`}
                    style={{ width: 72, height: 72 }}
                  >
                    <Image src={src} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="72px" />
                  </button>
                ))}
              </div>
              <div className={`${product.bg} relative flex-1 rounded-2xl overflow-hidden`} style={{ minHeight: 360 }}>
                {(product.bestseller || product.isNew) && (
                  <span className={`absolute top-3 left-3 z-10 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm ${product.isNew ? "bg-[#4caf50]" : "bg-[#e91e8c]"}`}>
                    {product.isNew ? "New Arrival" : "Bestseller"}
                  </span>
                )}
                <Image src={product.images[activeImg]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              {tags.map((tag, i) => (
                <div key={i} className={`${tag.bg} rounded-2xl p-3 text-center`}>
                  <div className="text-2xl mb-1">{tag.emoji}</div>
                  <div className="text-[10px] font-semibold text-gray-600 leading-tight whitespace-pre-line">{tag.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div className="flex flex-col">
            <Link href={`/categories/${product.categoryId}`} className="inline-block bg-[#fce4ec] text-[#e91e8c] text-xs font-bold px-3 py-1 rounded-full mb-3 self-start hover:bg-[#f8bbd0] transition-colors">
              {category}
            </Link>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] leading-tight mb-1">{product.name}</h1>
            <p className="text-gray-400 text-sm mb-4">{product.tagline} · by {product.brand}</p>

            <div className="flex items-center gap-2 flex-wrap mb-5">
              <Stars rating={product.rating} size="md" />
              <button onClick={() => setActiveTab("reviews")} className="text-sm font-bold text-[#1a1a2e] hover:text-[#e91e8c]">
                {product.rating} ({reviewCount} reviews)
              </button>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 font-semibold">{product.sold} sold</span>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black text-[#1a1a2e]">{formatINR(product.price)}</span>
              <span className="text-lg text-gray-400 line-through">{formatINR(product.origPrice)}</span>
              <span className="bg-[#e0f7fa] text-[#00838f] text-sm font-bold px-2.5 py-1 rounded-lg">{discountOf(product)}% OFF</span>
            </div>
            <p className="text-xs text-gray-400 mb-5">Inclusive of all taxes · You save {formatINR(product.origPrice - product.price)}</p>

            <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`${f.iconColor} w-14 h-14 rounded-full flex items-center justify-center mb-1.5 mx-auto`}>
                    <FeatureSVG icon={f.icon} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-600 leading-tight whitespace-pre-line">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-100 mb-5" />

            {/* Qty + stock */}
            <div className="flex items-center gap-5 mb-5 flex-wrap">
              <div className={`flex items-center border-2 border-gray-200 rounded-xl overflow-hidden ${out ? "opacity-40" : ""}`}>
                <button disabled={out} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xl transition-colors">−</button>
                <span className="w-10 text-center text-sm font-bold text-[#1a1a2e]">{qty}</span>
                <button disabled={out} onClick={() => setQty((q) => Math.min(Math.max(1, maxQty), q + 1))} aria-label="Increase quantity" className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xl transition-colors">+</button>
              </div>
              {out ? (
                <div className="flex items-center gap-1.5 text-sm text-red-500 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock
                </div>
              ) : (
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${product.stock < 10 ? "text-[#ef6c00]" : "text-[#2e7d32]"}`}>
                  <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? "bg-[#ef6c00]" : "bg-[#4caf50]"}`} />
                  {product.stock < 10 ? `Hurry! Only ${product.stock} left` : `In Stock (${product.stock} available)`}
                </div>
              )}
              {inCart > 0 && <Link href="/cart" className="text-xs font-bold text-[#e91e8c] hover:underline">{inCart} in your cart →</Link>}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={handleAddToCart}
                disabled={out}
                className="flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all text-sm bg-[#e91e8c] hover:bg-[#c2187a] text-white shadow-lg shadow-pink-200 disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CART_PATH} /></svg>
                {out ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={out}
                className="flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl border-2 border-[#e91e8c] text-[#e91e8c] hover:bg-pink-50 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Buy Now
              </button>
            </div>

            <div className="flex items-center gap-6 mb-5">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${wished ? "text-[#e91e8c]" : "text-gray-500 hover:text-[#e91e8c]"}`}
              >
                <svg className={`w-4 h-4 ${wished ? "fill-[#e91e8c]" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={HEART_PATH} />
                </svg>
                {wished ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>
              <button onClick={handleShare} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a1a2e] font-semibold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share
              </button>
            </div>

            <div className="h-px bg-gray-100 mb-5" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#fce4ec] rounded-xl p-3 flex items-start gap-2.5">
                <svg className="w-5 h-5 shrink-0 mt-0.5 fill-[#e91e8c]" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-1 1.5l1.96 2.5H17V9.5h2zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                <div>
                  <div className="text-xs font-bold text-[#1a1a2e] leading-tight">Free Shipping on Orders Above {formatINR(FREE_SHIPPING_THRESHOLD)}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Across India</div>
                </div>
              </div>
              <div className="bg-[#e8f5e9] rounded-xl p-3 flex items-start gap-2.5">
                <svg className="w-5 h-5 shrink-0 mt-0.5 fill-[#4caf50]" viewBox="0 0 24 24"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>
                <div>
                  <div className="text-xs font-bold text-[#1a1a2e] leading-tight">Estimated Delivery</div>
                  <div className="text-xs text-gray-400 mt-0.5">3 - 7 Business Days</div>
                </div>
              </div>
              <div className="bg-[#e8eaf6] rounded-xl p-3 flex items-start gap-2.5">
                <svg className="w-5 h-5 shrink-0 mt-0.5 fill-[#3f51b5]" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L17 9l-8 8z"/></svg>
                <div>
                  <div className="text-xs font-bold text-[#1a1a2e] leading-tight">Easy Returns</div>
                  <div className="text-xs text-gray-400 mt-0.5">7 Days Return Policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-10 shadow-sm">
          <div className="flex border-b border-gray-100 overflow-x-auto" role="tablist">
            {(Object.keys(tabLabels) as Tab[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? "text-[#e91e8c] border-[#e91e8c]" : "text-gray-500 border-transparent hover:text-[#1a1a2e]"}`}
              >
                {tabLabels[tab]}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-black text-[#1a1a2e] text-base mb-3">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
                </div>
                <ul className="space-y-2.5">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
                      <svg className="w-5 h-5 text-[#4caf50] fill-[#4caf50] mt-0.5 shrink-0" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {Object.entries({ Brand: product.brand, ...product.specs }).map(([key, val], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-500 w-40 rounded-l-lg">{key}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#1a1a2e] rounded-r-lg">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center gap-8 p-5 bg-gray-50 rounded-2xl flex-wrap">
                  <div className="text-center shrink-0">
                    <div className="text-5xl font-black text-[#1a1a2e] mb-1">{product.rating}</div>
                    <Stars rating={product.rating} size="md" />
                    <div className="text-xs text-gray-400 mt-1">{reviewCount} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2 min-w-[180px]">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 72 : s === 4 ? 20 : s === 3 ? 6 : s === 2 ? 2 : 0;
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3 text-right shrink-0">{s}</span>
                          <StarIcon />
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#fbbf24] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8 shrink-0">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Write a review */}
                {user ? (
                  <form onSubmit={submitReview} className="border-2 border-dashed border-pink-100 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="font-black text-[#1a1a2e]">{mine.length ? "Update your review" : "Write a review"}</h4>
                      <Stars rating={form.rating} size="lg" onPick={(r) => setForm((f) => ({ ...f, rating: r }))} />
                    </div>
                    <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Give your review a title" maxLength={80}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c]" />
                    <textarea value={form.text} onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))} rows={3} placeholder="What did you and your little one think?" maxLength={600}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e91e8c] resize-none" />
                    {formError && <p className="text-xs text-red-500 font-semibold">{formError}</p>}
                    <button type="submit" className="bg-[#e91e8c] hover:bg-[#c2187a] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">Submit Review</button>
                  </form>
                ) : (
                  <div className="bg-[#fff0f7] rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
                    <span className="text-sm font-semibold text-[#1a1a2e]">Bought this item? Share your experience with other parents.</span>
                    <Link href={`/login?next=/shop/${product.id}`} className="bg-[#e91e8c] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#c2187a] transition-colors">Sign in to Review</Link>
                  </div>
                )}

                <div className="space-y-4">
                  {mine.map((r) => (
                    <div key={r.id} className="border-2 border-[#fce4ec] rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#e91e8c] flex items-center justify-center text-white font-bold text-sm shrink-0">{r.userName.charAt(0)}</div>
                          <div>
                            <div className="text-sm font-bold text-[#1a1a2e]">{r.userName} <span className="text-xs text-[#e91e8c]">(You)</span></div>
                            <div className="text-xs text-gray-400">{fmtDate(r.date)}</div>
                          </div>
                        </div>
                        {purchased && <span className="text-xs text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full font-semibold">✓ Verified Purchase</span>}
                      </div>
                      <Stars rating={r.rating} />
                      <p className="text-sm font-bold text-[#1a1a2e] mt-2">{r.title}</p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{r.text}</p>
                    </div>
                  ))}
                  {sampleReviews.map((review, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold text-sm shrink-0">{review.name.charAt(0)}</div>
                          <div>
                            <div className="text-sm font-bold text-[#1a1a2e]">{review.name}</div>
                            <div className="text-xs text-gray-400">{review.date}</div>
                          </div>
                        </div>
                        {review.verified && <span className="text-xs text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full font-semibold">✓ Verified Purchase</span>}
                      </div>
                      <Stars rating={review.rating} />
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-5">
                {[
                  { icon: "🚚", title: "Free Shipping", body: "Enjoy free standard delivery on all orders above ₹499 across India. Orders below ₹499 are subject to a shipping fee of ₹60." },
                  { icon: "⚡", title: "Estimated Delivery", body: "Standard delivery takes 3–7 business days. Express delivery (1–3 business days) is available at checkout for ₹120." },
                  { icon: "🔄", title: "Easy Returns", body: "Not satisfied? Return within 7 days of delivery for a full refund or exchange. Items must be unused and in original packaging. Start a return from My Orders." },
                  { icon: "🎁", title: "Gift Ready", body: "Every order ships in kid-friendly packaging. Add a note at checkout and we will include a greeting card." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-[#1a1a2e] mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
                <Link href="/shipping" className="inline-block text-sm font-bold text-[#e91e8c] hover:underline">Read full shipping & returns policy →</Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <SectionTitle title="You May Also Like" href={`/categories/${product.categoryId}`} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {related.map((p) => <RecoCard key={p.id} product={p} height={180} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
