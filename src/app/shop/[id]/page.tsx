"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const BASE = "https://images.unsplash.com";

interface ProductDetail {
  id: number;
  name: string;
  tagline: string;
  category: string;
  categoryId: string;
  price: number;
  origPrice: number;
  discount: number;
  rating: number;
  reviews: number;
  sold: string;
  stock: number;
  bg: string;
  ageGroup: string;
  material: string;
  brand: string;
  images: string[];
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  relatedIds: number[];
}

const allProducts: ProductDetail[] = [
  {
    id: 1, name: "Alphabet Tracing Workbook", tagline: "Trace · Learn · Grow",
    category: "Books", categoryId: "books",
    price: 299, origPrice: 499, discount: 40, rating: 4.9, reviews: 128, sold: "1.2k+", stock: 50,
    bg: "bg-[#fef9ef]", ageGroup: "3 - 6 Years", material: "Premium Paper", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Help your little one master the alphabet with this beautifully designed tracing workbook. Each page features large, clear letters with dotted guidelines for easy tracing, colorful illustrations to keep children engaged, and fun activities to reinforce letter recognition.",
    highlights: ["52 pages of guided alphabet tracing", "Upper & lowercase letters with clear guidelines", "Colorful illustrations for each letter", "Develops fine motor skills and hand-eye coordination", "Builds school-ready writing confidence"],
    specs: { Pages: "52", Dimensions: "21 × 29.7 cm (A4)", Material: "Premium Matte Paper", "Age Group": "3 - 6 Years", Language: "English", Publisher: "Design4EverKids", Weight: "280g" },
    relatedIds: [4, 9, 10, 2],
  },
  {
    id: 2, name: "Wooden Stacking Rings", tagline: "Stack · Sort · Discover",
    category: "Toys", categoryId: "toys",
    price: 499, origPrice: 799, discount: 38, rating: 4.8, reviews: 96, sold: "800+", stock: 35,
    bg: "bg-[#fef0f7]", ageGroup: "1 - 4 Years", material: "Natural Rubberwood", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Our beautifully crafted Wooden Stacking Rings are a classic toy designed to develop your child's fine motor skills, color recognition, and problem-solving abilities. Made from natural, child-safe wood with non-toxic paint, this timeless toy grows with your child.",
    highlights: ["8 colorful wooden rings in different sizes", "Non-toxic, child-safe paint and materials", "Promotes size sequencing and color recognition", "Enhances fine motor skills and hand-eye coordination", "Smooth, rounded edges for safe play"],
    specs: { Pieces: "8 rings + 1 base", Dimensions: "15 × 15 × 18 cm", Material: "Natural Rubberwood", "Age Group": "1 - 4 Years", Finish: "Non-toxic Paint", Weight: "320g" },
    relatedIds: [5, 8, 11, 3],
  },
  {
    id: 3, name: "Mega Art & Craft Kit", tagline: "Create · Imagine · Express",
    category: "Art & Craft", categoryId: "art-craft",
    price: 699, origPrice: 1099, discount: 36, rating: 4.8, reviews: 112, sold: "950+", stock: 28,
    bg: "bg-[#fef3e2]", ageGroup: "4 - 10 Years", material: "Mixed Non-Toxic Materials", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1560421683-6856ea585c78?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1617117206620-b01f2919ff86?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1572375992501-4b0892d50c69?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Unleash your child's inner artist with our Mega Art & Craft Kit! This all-in-one creative set comes packed with premium quality art supplies to inspire hours of creativity. Whether painting, drawing, or crafting, this kit has everything a young artist needs.",
    highlights: ["100+ pieces of premium art supplies", "Includes crayons, paints, markers, and craft materials", "Non-toxic and washable paints", "Comes in a handy storage case", "Encourages creativity and self-expression"],
    specs: { "Total Pieces": "100+", Includes: "Crayons, Paints, Markers, Stencils", Material: "Non-toxic, Child-safe", "Age Group": "4 - 10 Years", Storage: "Includes carry case", Weight: "680g" },
    relatedIds: [12, 10, 1, 6],
  },
  {
    id: 4, name: "Number Tracing Workbook", tagline: "Count · Write · Learn",
    category: "Books", categoryId: "books",
    price: 299, origPrice: 499, discount: 40, rating: 4.9, reviews: 104, sold: "1.0k+", stock: 60,
    bg: "bg-[#e3f4fd]", ageGroup: "3 - 6 Years", material: "Premium Paper", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Give your child a head start in mathematics with our Number Tracing Workbook! Designed to make learning numbers fun and engaging, this workbook helps children aged 3-6 develop number recognition, counting skills, and pre-writing abilities through guided tracing activities.",
    highlights: ["Numbers 1-20 with guided tracing", "Counting activities with colorful pictures", "Number words for early literacy", "Progressive difficulty to build confidence", "Perfect companion to Alphabet Tracing Workbook"],
    specs: { Pages: "48", "Numbers Covered": "1 - 20", Dimensions: "21 × 29.7 cm (A4)", Material: "Premium Matte Paper", "Age Group": "3 - 6 Years", Weight: "260g" },
    relatedIds: [1, 9, 10, 5],
  },
  {
    id: 5, name: "Educational Wooden Blocks", tagline: "Build · Learn · Explore",
    category: "Educational", categoryId: "educational",
    price: 599, origPrice: 899, discount: 33, rating: 4.8, reviews: 89, sold: "700+", stock: 42,
    bg: "bg-[#fff8f0]", ageGroup: "2 - 6 Years", material: "Natural Pinewood", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Build, learn and explore with our Educational Wooden Blocks set! These beautifully crafted blocks feature letters, numbers, and shapes to make learning a hands-on adventure. Perfect for open-ended play that sparks imagination while teaching fundamental concepts.",
    highlights: ["50 wooden blocks with letters, numbers & shapes", "Made from natural, child-safe wood", "Teaches alphabet, counting and shape recognition", "Develops spatial reasoning and creativity", "Includes educational activity guide"],
    specs: { Pieces: "50", "Block Size": "3.5 × 3.5 × 3.5 cm", Material: "Natural Pinewood", "Age Group": "2 - 6 Years", Finish: "Non-toxic Paint", Weight: "850g" },
    relatedIds: [2, 8, 1, 10],
  },
  {
    id: 6, name: "Kids Water Bottle", tagline: "Sip · Play · Stay Fresh",
    category: "Baby & Kids", categoryId: "baby-kids",
    price: 399, origPrice: 599, discount: 33, rating: 4.7, reviews: 76, sold: "600+", stock: 80,
    bg: "bg-[#fce4ec]", ageGroup: "2 - 10 Years", material: "BPA-Free Tritan Plastic", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1545558014-8692077e9b5c?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Keep your little one hydrated all day with our adorable Kids Water Bottle! Featuring fun, colorful designs and a leak-proof lid, this bottle is perfect for school, sports, and outdoor adventures. Made from BPA-free materials for safe, healthy hydration.",
    highlights: ["500ml capacity, perfect size for kids", "BPA-free, food-grade materials", "Leak-proof flip-top lid", "Easy-grip design for small hands", "Dishwasher safe for easy cleaning"],
    specs: { Capacity: "500ml", Material: "BPA-Free Tritan Plastic", Lid: "Flip-top with Lock", "Age Group": "2 - 10 Years", "Dishwasher Safe": "Yes", Weight: "140g" },
    relatedIds: [11, 7, 2, 5],
  },
  {
    id: 7, name: "Outdoor Play Ball Set", tagline: "Roll · Bounce · Play",
    category: "Outdoor Play", categoryId: "outdoor",
    price: 499, origPrice: 799, discount: 38, rating: 4.8, reviews: 92, sold: "750+", stock: 55,
    bg: "bg-[#e8f5e9]", ageGroup: "3 - 12 Years", material: "Natural Rubber", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1532330393533-443990a51d10?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Get the kids moving with our Outdoor Play Ball Set! This vibrant collection includes balls in different sizes for a variety of outdoor games. Perfect for solo play or group activities, these durable rubber balls encourage physical activity, coordination, and social skills.",
    highlights: ["Set of 5 balls in assorted sizes and colors", "High-quality, durable rubber construction", "Great for football, basketball, and dodgeball", "Promotes physical activity and teamwork", "Suitable for indoor and outdoor use"],
    specs: { "Set Contains": "5 balls", Sizes: "10cm, 15cm, 18cm, 20cm, 22cm", Material: "Natural Rubber", "Age Group": "3 - 12 Years", Surface: "Indoor & Outdoor", Weight: "480g" },
    relatedIds: [6, 2, 11, 8],
  },
  {
    id: 8, name: "Animal Puzzle Set", tagline: "Fit · Match · Discover",
    category: "Puzzles & Games", categoryId: "puzzles",
    price: 399, origPrice: 599, discount: 33, rating: 4.8, reviews: 108, sold: "900+", stock: 38,
    bg: "bg-[#f3e5f5]", ageGroup: "2 - 5 Years", material: "Natural Plywood", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1589495374906-b7f5ca5de879?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Introduce your toddler to the wonderful world of animals with our charming Animal Puzzle Set! These chunky wooden puzzles feature cute animal pieces with easy-to-grip knobs, making them perfect for little hands. An ideal first puzzle that teaches animal names and problem-solving skills.",
    highlights: ["6 different animal puzzle boards", "Large, chunky pieces with easy-grip knobs", "Teaches animal recognition and names", "Made from smooth, child-safe wood", "Bright, engaging colors and illustrations"],
    specs: { "Puzzle Boards": "6", "Pieces per Board": "3-5 pieces", Material: "Natural Plywood", "Age Group": "2 - 5 Years", Finish: "Non-toxic Paint", Weight: "520g" },
    relatedIds: [5, 2, 1, 7],
  },
  {
    id: 9, name: "Story Books Set (5 Books)", tagline: "Read · Dream · Explore",
    category: "Books", categoryId: "books",
    price: 699, origPrice: 1099, discount: 36, rating: 4.9, reviews: 145, sold: "1.5k+", stock: 45,
    bg: "bg-[#fff3e0]", ageGroup: "3 - 8 Years", material: "Premium Hardcover", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1509266272358-7701da638078?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Ignite a lifelong love of reading with our enchanting Story Books Set! This collection of 5 beautifully illustrated hardcover books features captivating stories that delight children and parents alike. With rich illustrations and simple, engaging text, perfect for bedtime reading.",
    highlights: ["Set of 5 beautifully illustrated hardcover books", "Age-appropriate stories with positive messages", "Vibrant, full-color illustrations on every page", "Sturdy hardcover for long-lasting use", "Includes adventure, friendship & nature themes"],
    specs: { "Number of Books": "5", "Pages per Book": "24-32", Format: "Hardcover", "Age Group": "3 - 8 Years", Language: "English", Weight: "720g" },
    relatedIds: [1, 4, 10, 3],
  },
  {
    id: 10, name: "Learning Flash Cards", tagline: "Learn · Practice · Master",
    category: "Educational", categoryId: "educational",
    price: 399, origPrice: 599, discount: 33, rating: 4.8, reviews: 98, sold: "820+", stock: 65,
    bg: "bg-[#e8f5e9]", ageGroup: "2 - 6 Years", material: "300gsm Cardboard", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1509266272358-7701da638078?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Make learning fun with our comprehensive Learning Flash Cards! This set covers alphabets, numbers, shapes, colors, animals, and fruits with clear images and bold text. Perfect for quick learning sessions, these cards reinforce concepts through repetition in a fun, engaging way.",
    highlights: ["100 double-sided flash cards", "Covers alphabets, numbers, shapes & animals", "Bold, clear text with vibrant illustrations", "Thick, durable cardboard with rounded corners", "Includes instruction booklet with learning games"],
    specs: { "Total Cards": "100", "Card Size": "10 × 7.5 cm", Material: "300gsm Cardboard", "Age Group": "2 - 6 Years", Topics: "ABC, 123, Shapes, Colors, Animals", Weight: "380g" },
    relatedIds: [1, 4, 5, 9],
  },
  {
    id: 11, name: "Teddy Bear (Soft Toy)", tagline: "Soft · Cuddly · Loveable",
    category: "Toys", categoryId: "toys",
    price: 599, origPrice: 899, discount: 33, rating: 4.9, reviews: 121, sold: "1.1k+", stock: 30,
    bg: "bg-[#fff8f0]", ageGroup: "0+ Years", material: "Premium Plush Fabric", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Give the gift of a forever friend with our super soft Teddy Bear! Made from premium plush fabric that's irresistibly soft and perfect for cuddles. With safety-stitched features and hypoallergenic filling, it's a safe and comforting companion for children of all ages.",
    highlights: ["Ultra-soft premium plush fabric", "Hypoallergenic polyester filling", "Safety-stitched eyes and nose", "Machine washable for easy care", "30 cm tall — perfect hugging size"],
    specs: { Height: "30 cm", Material: "Premium Plush Fabric", Filling: "Hypoallergenic Polyester", "Age Group": "0+ Years", Washable: "Machine Washable", Weight: "220g" },
    relatedIds: [6, 2, 7, 8],
  },
  {
    id: 12, name: "Kids Drawing Board", tagline: "Draw · Erase · Repeat",
    category: "Art & Craft", categoryId: "art-craft",
    price: 699, origPrice: 999, discount: 30, rating: 4.7, reviews: 84, sold: "680+", stock: 22,
    bg: "bg-[#e3f4fd]", ageGroup: "3 - 10 Years", material: "ABS Plastic", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1560421683-6856ea585c78?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1617117206620-b01f2919ff86?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Spark creativity and save on paper with our Kids Drawing Board! This magnetic drawing board lets children draw, write, and erase endlessly without any mess. The easy-erase slider clears the board in seconds — perfect for home, travel, and restaurants.",
    highlights: ["Mess-free magnetic drawing technology", "Erase with one swipe of the slider", "Includes 2 drawing stencils and 1 stylus", "Lightweight and portable for travel", "Suitable for drawing, writing, and doodling"],
    specs: { "Board Size": "28 × 20 cm", Material: "ABS Plastic + Magnetic Layer", "Age Group": "3 - 10 Years", Includes: "Board, Stylus, 2 Stencils", Erase: "Magnetic Slider", Weight: "320g" },
    relatedIds: [3, 10, 5, 1],
  },
];

const sampleReviews = [
  { name: "Priya S.", date: "2 weeks ago", rating: 5, text: "My daughter absolutely loves this! The quality is excellent and she has been using it every day. Highly recommended for all parents!", verified: true },
  { name: "Rahul M.", date: "1 month ago", rating: 5, text: "Great product! The quality is superb and delivery was fast. My kids are very happy with it. Would definitely buy again.", verified: true },
  { name: "Anita K.", date: "3 months ago", rating: 4, text: "Good value for money. My son enjoys it a lot. Delivery was quick and packaging was nice. Will order more items soon.", verified: false },
];

function getFeatures(material: string) {
  const m = material.toLowerCase();
  if (m.includes("wood") || m.includes("plywood") || m.includes("rubberwood") || m.includes("pinewood")) {
    return [
      { emoji: "🌿", label: "Safe &\nNon-Toxic", bg: "bg-[#e8f5e9]" },
      { emoji: "🧠", label: "Boosts\nThinking Skills", bg: "bg-[#f3e5f5]" },
      { emoji: "🤲", label: "Improves\nMotor Skills", bg: "bg-[#fce4ec]" },
      { emoji: "🛡️", label: "Durable &\nLong Lasting", bg: "bg-[#fffde7]" },
    ];
  }
  if (m.includes("plush") || m.includes("polyester")) {
    return [
      { emoji: "🧸", label: "Ultra\nSoft Plush", bg: "bg-[#fce4ec]" },
      { emoji: "🛡️", label: "Safe for\nAll Ages", bg: "bg-[#e8f5e9]" },
      { emoji: "🧺", label: "Machine\nWashable", bg: "bg-[#e3f2fd]" },
      { emoji: "❤️", label: "Perfect\nCompanion", bg: "bg-[#f3e5f5]" },
    ];
  }
  if (m.includes("paper") || m.includes("cardboard") || m.includes("hardcover")) {
    return [
      { emoji: "📚", label: "Educational\nValue", bg: "bg-[#e8f5e9]" },
      { emoji: "🌈", label: "Vibrant\nIllustrations", bg: "bg-[#fce4ec]" },
      { emoji: "✍️", label: "Develops\nWriting Skills", bg: "bg-[#f3e5f5]" },
      { emoji: "🎓", label: "School-Ready\nLearning", bg: "bg-[#fffde7]" },
    ];
  }
  if (m.includes("rubber")) {
    return [
      { emoji: "🌿", label: "Eco-Friendly\nRubber", bg: "bg-[#e8f5e9]" },
      { emoji: "💪", label: "Super\nDurable", bg: "bg-[#fffde7]" },
      { emoji: "🤸", label: "Active\nPlay", bg: "bg-[#fce4ec]" },
      { emoji: "✅", label: "Safe\nMaterials", bg: "bg-[#e3f2fd]" },
    ];
  }
  return [
    { emoji: "🌿", label: "Safe &\nNon-Toxic", bg: "bg-[#e8f5e9]" },
    { emoji: "🧠", label: "Boosts\nCreativity", bg: "bg-[#f3e5f5]" },
    { emoji: "🎉", label: "Hours\nof Fun", bg: "bg-[#fffde7]" },
    { emoji: "🛡️", label: "Durable\n& Safe", bg: "bg-[#fce4ec]" },
  ];
}

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${sz} ${i < filled ? "text-[#fbbf24] fill-[#fbbf24]" : "text-gray-200 fill-gray-200"}`} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function RelatedCard({ product }: { product: ProductDetail }) {
  const [cartAdded, setCartAdded] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <Link href={`/shop/${product.id}`} className="block relative shrink-0" style={{ height: 180 }}>
        <div className={`${product.bg} absolute inset-0`} />
        <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="20vw" />
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/shop/${product.id}`}>
          <h4 className="text-sm font-bold text-[#1a1a2e] line-clamp-2 mb-1 hover:text-[#e91e8c] transition-colors">{product.name}</h4>
        </Link>
        <div className="flex items-center gap-1 mb-1">
          <Stars rating={product.rating} size="sm" />
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="font-black text-sm text-[#1a1a2e]">₹{product.price}</span>
          <span className="text-xs text-gray-400 line-through">₹{product.origPrice}</span>
          <span className="text-[10px] font-bold text-[#00897b] bg-[#e0f2f1] px-1.5 py-0.5 rounded">{product.discount}% OFF</span>
        </div>
        <button
          className="mt-auto"
          onClick={() => { setCartAdded(true); setTimeout(() => setCartAdded(false), 2000); }}
        >
          <span className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${cartAdded ? "bg-[#e8f5e9] text-[#4caf50]" : "bg-[#e91e8c] text-white hover:bg-[#c2187a]"}`}>
            {cartAdded ? (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Added!</>
            ) : (
              <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Add to Cart</>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = allProducts.find((p) => p.id === productId);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews" | "shipping">("description");

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-2xl font-black text-[#1a1a2e] mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-6">This product doesn&apos;t exist or has been removed.</p>
          <Link href="/shop" className="bg-[#e91e8c] text-white font-bold px-6 py-3 rounded-full hover:bg-[#c2187a] transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = (() => {
    const from = product.relatedIds.map(id => allProducts.find(p => p.id === id)).filter(Boolean) as ProductDetail[];
    if (from.length < 5) {
      const extras = allProducts.filter(p => p.id !== product.id && !product.relatedIds.includes(p.id));
      return [...from, ...extras].slice(0, 5);
    }
    return from.slice(0, 5);
  })();

  const features = getFeatures(product.material);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tags = [
    { emoji: "⭐", label: `Age ${product.ageGroup}`, bg: "bg-[#fffde7]" },
    { emoji: "🎓", label: "Learning\nThrough Play", bg: "bg-[#e8f5e9]" },
    { emoji: "🌱", label: "Eco-Friendly\nProduct", bg: "bg-[#e8f5e9]" },
    { emoji: "🎁", label: "Perfect\nGift Choice", bg: "bg-[#fce4ec]" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#e91e8c] flex items-center gap-1 transition-colors">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            Home
          </Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[#e91e8c] transition-colors">{product.category}</Link>
          <span>›</span>
          <Link href={`/categories/${product.categoryId}`} className="hover:text-[#e91e8c] transition-colors">{product.category}</Link>
          <span>›</span>
          <span className="text-[#1a1a2e] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">

          {/* LEFT: Gallery + Tags */}
          <div>
            {/* Gallery: thumbnails left (vertical), main image right */}
            <div className="flex gap-3">
              <div className="flex flex-col gap-2 shrink-0">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-colors shrink-0 ${activeImg === i ? "border-[#e91e8c]" : "border-gray-200 hover:border-gray-300"}`}
                    style={{ width: 72, height: 72 }}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="72px" />
                  </button>
                ))}
              </div>
              <div className={`${product.bg} relative flex-1 rounded-2xl overflow-hidden`} style={{ minHeight: 360 }}>
                <span className="absolute top-3 left-3 z-10 bg-[#e91e8c] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">Bestseller</span>
                <Image
                  src={product.images[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>

            {/* Feature tag cards */}
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
            <span className="inline-block bg-[#e91e8c] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">Bestseller</span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] leading-tight mb-1">{product.name}</h1>
            <p className="text-gray-400 text-sm mb-4">{product.tagline}</p>

            <div className="flex items-center gap-2 flex-wrap mb-5">
              <Stars rating={product.rating} />
              <span className="text-sm font-bold text-[#1a1a2e]">{product.rating} ({product.reviews} reviews)</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-500 font-semibold">{product.sold} sold</span>
            </div>

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black text-[#1a1a2e]">₹{product.price}</span>
              <span className="text-lg text-gray-400 line-through">₹{product.origPrice}</span>
              <span className="bg-[#e0f7fa] text-[#00838f] text-sm font-bold px-2.5 py-1 rounded-lg">{product.discount}% OFF</span>
            </div>
            <p className="text-xs text-gray-400 mb-5">Inclusive of all taxes</p>

            <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>

            {/* Feature circles */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`${f.bg} w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-1.5 mx-auto`}>{f.emoji}</div>
                  <span className="text-[10px] font-semibold text-gray-600 leading-tight whitespace-pre-line">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gray-100 mb-5" />

            {/* Qty + stock */}
            <div className="flex items-center gap-5 mb-5 flex-wrap">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xl transition-colors">−</button>
                <span className="w-10 text-center text-sm font-bold text-[#1a1a2e]">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 font-bold text-xl transition-colors">+</button>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#2e7d32] font-semibold">
                <div className="w-2 h-2 rounded-full bg-[#4caf50]" />
                In Stock ({product.stock} available)
              </div>
            </div>

            {/* Add to Cart + Buy Now */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all text-sm ${addedToCart ? "bg-[#4caf50] text-white" : "bg-[#e91e8c] hover:bg-[#c2187a] text-white shadow-lg shadow-pink-200"}`}
              >
                {addedToCart ? (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>Added to Cart!</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>Add to Cart</>
                )}
              </button>
              <button className="flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl border-2 border-[#e91e8c] text-[#e91e8c] hover:bg-pink-50 transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Buy Now
              </button>
            </div>

            {/* Wishlist + Share */}
            <div className="flex items-center gap-6 mb-5">
              <button
                onClick={() => setWished(w => !w)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${wished ? "text-[#e91e8c]" : "text-gray-500 hover:text-[#e91e8c]"}`}
              >
                <svg className={`w-4 h-4 ${wished ? "fill-[#e91e8c]" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Wishlist
              </button>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a1a2e] font-semibold transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                Share
              </button>
            </div>

            <div className="h-px bg-gray-100 mb-5" />

            {/* Delivery info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: "🚚", title: "Free Shipping on Orders Above ₹499", sub: "Across India" },
                { icon: "📦", title: "Estimated Delivery", sub: "3 - 7 Business Days" },
                { icon: "🔄", title: "Easy Returns", sub: "7 Days Return Policy" },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-start gap-2.5">
                  <span className="text-xl leading-none mt-0.5">{item.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-[#1a1a2e] leading-tight">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-10 shadow-sm">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {(["description", "specs", "reviews", "shipping"] as const).map((tab) => {
              const labels: Record<string, string> = { description: "Description", specs: "Specifications", reviews: `Reviews (${product.reviews})`, shipping: "Shipping & Returns" };
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? "text-[#e91e8c] border-[#e91e8c]" : "text-gray-500 border-transparent hover:text-[#1a1a2e]"}`}
                >
                  {labels[tab]}
                </button>
              );
            })}
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
                    {Object.entries(product.specs).map(([key, val], i) => (
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
                    <Stars rating={product.rating} />
                    <div className="text-xs text-gray-400 mt-1">{product.reviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2 min-w-[180px]">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 72 : s === 4 ? 20 : s === 3 ? 6 : s === 2 ? 2 : 0;
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3 text-right shrink-0">{s}</span>
                          <svg className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24] shrink-0" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#fbbf24] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8 shrink-0">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
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
                      <Stars rating={review.rating} size="sm" />
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
                  { icon: "⚡", title: "Estimated Delivery", body: "Standard delivery takes 3–7 business days. Express delivery (1–3 business days) is available at checkout for an additional charge." },
                  { icon: "🔄", title: "Easy Returns", body: "Not satisfied? Return within 7 days for a full refund or exchange. Items must be unused and in original packaging. Initiate returns from your account dashboard." },
                  { icon: "🎁", title: "Gift Wrapping", body: "Add a personal touch — select gift wrapping at checkout for just ₹49. Includes a greeting card where you can write your personal message." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <div>
                      <h4 className="font-bold text-[#1a1a2e] mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-[#1a1a2e] flex items-center gap-2">
              You May Also Like <span>✨</span>
            </h2>
            <Link href="/shop" className="text-sm font-bold text-[#e91e8c] hover:underline flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedProducts.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
