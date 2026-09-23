"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const BASE = "https://images.unsplash.com";
const Q = "?w=200&h=200&fit=crop&auto=format&q=80";

const categories = [
  {
    label: "Toys",
    bg: "bg-[#fff3e0]",
    href: "/categories/toys",
    image: `${BASE}/photo-1602734846297-9299fc2d4703${Q}`,
    fallback: "🧸",
  },
  {
    label: "Books",
    bg: "bg-[#e3f2fd]",
    href: "/categories/books",
    image: `${BASE}/photo-1455884981818-54cb785db6fc${Q}`,
    fallback: "📚",
  },
  {
    label: "Art & Craft",
    bg: "bg-[#fffde7]",
    href: "/categories/art-craft",
    image: `${BASE}/photo-1560421683-6856ea585c78${Q}`,
    fallback: "🎨",
  },
  {
    label: "Educational",
    bg: "bg-[#fce4ec]",
    href: "/categories/educational",
    image: `${BASE}/photo-1618842676088-c4d48a6a7c9d${Q}`,
    fallback: "🔤",
  },
  {
    label: "Baby & Kids",
    bg: "bg-[#e0f7fa]",
    href: "/categories/baby-kids",
    image: `${BASE}/photo-1545558014-8692077e9b5c${Q}`,
    fallback: "👶",
  },
  {
    label: "Gifts",
    bg: "bg-[#f3e5f5]",
    href: "/categories/gifts",
    image: `${BASE}/photo-1549465220-1a8b9238cd48${Q}`,
    fallback: "🎁",
  },
  {
    label: "Outdoor Play",
    bg: "bg-[#fbe9e7]",
    href: "/categories/outdoor",
    image: `${BASE}/photo-1532330393533-443990a51d10${Q}`,
    fallback: "🚗",
  },
  {
    label: "Puzzles & Games",
    bg: "bg-[#e8f5e9]",
    href: "/categories/puzzles",
    image: `${BASE}/photo-1589495374906-b7f5ca5de879${Q}`,
    fallback: "🧩",
  },
];

function CategoryTile({ cat }: { cat: (typeof categories)[0] }) {
  const [failed, setFailed] = useState(false);

  return (
    <Link href={cat.href} className="flex flex-col items-center gap-2 group">
      <div
        className={`${cat.bg} rounded-2xl w-full overflow-hidden aspect-square hover:scale-105 transition-transform shadow-sm relative flex items-center justify-center`}
      >
        {failed ? (
          <span className="text-4xl">{cat.fallback}</span>
        ) : (
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 25vw, 12.5vw"
            onError={() => setFailed(true)}
          />
        )}
      </div>
      <span className="text-xs sm:text-sm font-semibold text-[#1a1a2e] text-center leading-tight group-hover:text-[#e91e8c] transition-colors">
        {cat.label}
      </span>
    </Link>
  );
}

export default function CategorySection() {
  return (
    <section className="w-full bg-white py-6 border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <CategoryTile key={cat.label} cat={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
