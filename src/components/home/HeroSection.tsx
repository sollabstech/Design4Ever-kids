"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1600&h=560&fit=crop&auto=format&q=85",
    badge: "NEW ARRIVALS 🎉",
    heading: "Discover the Joy of",
    headingPink: "Learning & Play!",
    sub: "Curated toys, books & games made for curious, creative kids.",
    cta1: { label: "Shop Now →", href: "/shop" },
    cta2: { label: "View Offers", href: "/offers" },
    overlay: "from-black/60 via-black/30 to-transparent",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1484820540004-14229fe36ca4?w=1600&h=560&fit=crop&auto=format&q=85",
    badge: "TOP PICKS 🌟",
    heading: "Build Bright Minds",
    headingPink: "Through Play!",
    sub: "Educational toys designed for every stage of growing up.",
    cta1: { label: "Explore Now →", href: "/categories/educational" },
    cta2: { label: "Best Sellers", href: "/best-sellers" },
    overlay: "from-black/55 via-black/25 to-transparent",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1617117206620-b01f2919ff86?w=1600&h=560&fit=crop&auto=format&q=85",
    badge: "ART & CRAFT 🎨",
    heading: "Spark Creativity",
    headingPink: "Every Single Day!",
    sub: "Art kits, coloring sets and craft supplies kids absolutely love.",
    cta1: { label: "Shop Art & Craft →", href: "/categories/art-craft" },
    cta2: { label: "Special Offers", href: "/offers" },
    overlay: "from-black/60 via-black/30 to-transparent",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(slides.map(() => false));

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    []
  );
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  const markLoaded = (i: number) =>
    setLoaded((prev) => { const n = [...prev]; n[i] = true; return n; });

  return (
    <section className="relative w-full overflow-hidden bg-[#e0f4fb]" style={{ height: "clamp(260px, 42vw, 560px)" }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {/* Background image */}
          <Image
            src={slide.image}
            alt={slide.headingPink}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
            onLoad={() => markLoaded(i)}
          />

          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-10 lg:px-16">
              <div className="max-w-xl">
                {/* Badge */}
                <span className="inline-block bg-[#e91e8c] text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full mb-3 sm:mb-4 tracking-wide">
                  {slide.badge}
                </span>

                {/* Heading */}
                <h1 className="font-black text-white leading-tight mb-1">
                  <span className="block text-2xl sm:text-4xl lg:text-5xl">{slide.heading}</span>
                  <span className="block text-2xl sm:text-4xl lg:text-5xl text-[#ffd23f] drop-shadow-sm">{slide.headingPink}</span>
                </h1>

                {/* Subtitle */}
                <p className="text-white/85 text-sm sm:text-base mt-2 sm:mt-3 mb-5 sm:mb-6 max-w-sm leading-relaxed">
                  {slide.sub}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={slide.cta1.href}
                    className="bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-lg transition-colors"
                  >
                    {slide.cta1.label}
                  </Link>
                  <Link
                    href={slide.cta2.href}
                    className="bg-white/90 hover:bg-white text-[#1a1a2e] font-bold text-sm px-6 py-2.5 rounded-full shadow transition-colors"
                  >
                    {slide.cta2.label}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/25 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/25 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "bg-white w-6 h-2.5"
                : "bg-white/50 w-2.5 h-2.5 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
