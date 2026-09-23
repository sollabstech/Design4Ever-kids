"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const BASE = "https://images.unsplash.com";

interface ProductDetail {
  id: number;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  origPrice: number;
  discount: number;
  rating: number;
  reviews: number;
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
    id: 1,
    name: "Alphabet Tracing Workbook",
    category: "Books", categoryId: "books",
    price: 299, origPrice: 499, discount: 40, rating: 4.9, reviews: 128,
    bg: "bg-[#fef9ef]", ageGroup: "3 - 6 Years", material: "Premium Paper", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Help your little one master the alphabet with this beautifully designed tracing workbook. Each page features large, clear letters with dotted guidelines for easy tracing, colorful illustrations to keep children engaged, and fun activities to reinforce letter recognition. Perfect for preschoolers and kindergarteners beginning their writing journey.",
    highlights: ["52 pages of guided alphabet tracing", "Upper & lowercase letters with clear guidelines", "Colorful illustrations for each letter", "Develops fine motor skills and hand-eye coordination", "Builds school-ready writing confidence"],
    specs: { "Pages": "52", "Dimensions": "21 × 29.7 cm (A4)", "Material": "Premium Matte Paper", "Age Group": "3 - 6 Years", "Language": "English", "Publisher": "Design4EverKids", "Weight": "280g" },
    relatedIds: [4, 9, 10, 2],
  },
  {
    id: 2,
    name: "Wooden Stacking Rings",
    category: "Toys", categoryId: "toys",
    price: 499, origPrice: 799, discount: 38, rating: 4.8, reviews: 96,
    bg: "bg-[#fef0f7]", ageGroup: "1 - 4 Years", material: "Natural Wood", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Our beautifully crafted Wooden Stacking Rings are a classic toy designed to develop your child's fine motor skills, color recognition, and problem-solving abilities. Made from natural, child-safe wood with non-toxic paint, this timeless toy grows with your child from infant to toddler years.",
    highlights: ["8 colorful wooden rings in different sizes", "Non-toxic, child-safe paint and materials", "Promotes size sequencing and color recognition", "Enhances fine motor skills and hand-eye coordination", "Smooth, rounded edges for safe play"],
    specs: { "Pieces": "8 rings + 1 base", "Dimensions": "15 × 15 × 18 cm", "Material": "Natural Rubberwood", "Age Group": "1 - 4 Years", "Finish": "Non-toxic Paint", "Weight": "320g" },
    relatedIds: [5, 8, 11, 3],
  },
  {
    id: 3,
    name: "Mega Art & Craft Kit",
    category: "Art & Craft", categoryId: "art-craft",
    price: 699, origPrice: 1099, discount: 36, rating: 4.8, reviews: 112,
    bg: "bg-[#fef3e2]", ageGroup: "4 - 10 Years", material: "Mixed Media", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1560421683-6856ea585c78?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1617117206620-b01f2919ff86?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1572375992501-4b0892d50c69?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Unleash your child's inner artist with our Mega Art & Craft Kit! This all-in-one creative set comes packed with premium quality art supplies to inspire hours of creativity. Whether painting, drawing, or crafting, this kit has everything a young artist needs to create masterpieces.",
    highlights: ["100+ pieces of premium art supplies", "Includes crayons, paints, markers, and craft materials", "Non-toxic and washable paints", "Comes in a handy storage case", "Encourages creativity and self-expression"],
    specs: { "Total Pieces": "100+", "Includes": "Crayons, Paints, Markers, Stencils", "Material": "Non-toxic, Child-safe", "Age Group": "4 - 10 Years", "Storage": "Includes carry case", "Weight": "680g" },
    relatedIds: [12, 10, 1, 6],
  },
  {
    id: 4,
    name: "Number Tracing Workbook",
    category: "Books", categoryId: "books",
    price: 299, origPrice: 499, discount: 40, rating: 4.9, reviews: 104,
    bg: "bg-[#e3f4fd]", ageGroup: "3 - 6 Years", material: "Premium Paper", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Give your child a head start in mathematics with our Number Tracing Workbook! Designed to make learning numbers fun and engaging, this workbook helps children aged 3-6 develop number recognition, counting skills, and pre-writing abilities through guided tracing activities.",
    highlights: ["Numbers 1-20 with guided tracing", "Counting activities with colorful pictures", "Number words for early literacy", "Progressive difficulty to build confidence", "Perfect companion to Alphabet Tracing Workbook"],
    specs: { "Pages": "48", "Numbers Covered": "1 - 20", "Dimensions": "21 × 29.7 cm (A4)", "Material": "Premium Matte Paper", "Age Group": "3 - 6 Years", "Weight": "260g" },
    relatedIds: [1, 9, 10, 5],
  },
  {
    id: 5,
    name: "Educational Wooden Blocks",
    category: "Educational", categoryId: "educational",
    price: 599, origPrice: 899, discount: 33, rating: 4.8, reviews: 89,
    bg: "bg-[#fff8f0]", ageGroup: "2 - 6 Years", material: "Natural Wood", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Build, learn and explore with our Educational Wooden Blocks set! These beautifully crafted blocks feature letters, numbers, and shapes to make learning a hands-on adventure. Perfect for open-ended play that sparks imagination while teaching fundamental concepts in a fun, engaging way.",
    highlights: ["50 wooden blocks with letters, numbers & shapes", "Made from natural, child-safe wood", "Teaches alphabet, counting and shape recognition", "Develops spatial reasoning and creativity", "Includes educational activity guide"],
    specs: { "Pieces": "50", "Block Size": "3.5 × 3.5 × 3.5 cm", "Material": "Natural Pinewood", "Age Group": "2 - 6 Years", "Finish": "Non-toxic Paint", "Weight": "850g" },
    relatedIds: [2, 8, 1, 10],
  },
  {
    id: 6,
    name: "Kids Water Bottle",
    category: "Baby & Kids", categoryId: "baby-kids",
    price: 399, origPrice: 599, discount: 33, rating: 4.7, reviews: 76,
    bg: "bg-[#fce4ec]", ageGroup: "2 - 10 Years", material: "BPA-Free Plastic", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1545558014-8692077e9b5c?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Keep your little one hydrated all day with our adorable Kids Water Bottle! Featuring fun, colorful designs and a leak-proof lid, this bottle is perfect for school, sports, and outdoor adventures. Made from BPA-free materials for safe, healthy hydration.",
    highlights: ["500ml capacity, perfect size for kids", "BPA-free, food-grade materials", "Leak-proof flip-top lid", "Easy-grip design for small hands", "Dishwasher safe for easy cleaning"],
    specs: { "Capacity": "500ml", "Material": "BPA-Free Tritan Plastic", "Lid": "Flip-top with Lock", "Age Group": "2 - 10 Years", "Dishwasher Safe": "Yes", "Weight": "140g" },
    relatedIds: [11, 7, 2, 5],
  },
  {
    id: 7,
    name: "Outdoor Play Ball Set",
    category: "Outdoor Play", categoryId: "outdoor",
    price: 499, origPrice: 799, discount: 38, rating: 4.8, reviews: 92,
    bg: "bg-[#e8f5e9]", ageGroup: "3 - 12 Years", material: "Natural Rubber", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1568702846914-96b305d2aaeb?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1532330393533-443990a51d10?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Get the kids moving with our Outdoor Play Ball Set! This vibrant collection includes balls in different sizes for a variety of outdoor games. Perfect for solo play or group activities, these durable rubber balls encourage physical activity, coordination, and social skills.",
    highlights: ["Set of 5 balls in assorted sizes and colors", "High-quality, durable rubber construction", "Great for football, basketball, and dodgeball", "Promotes physical activity and teamwork", "Suitable for indoor and outdoor use"],
    specs: { "Set Contains": "5 balls", "Sizes": "10cm, 15cm, 18cm, 20cm, 22cm", "Material": "Natural Rubber", "Age Group": "3 - 12 Years", "Surface": "Indoor & Outdoor", "Weight": "480g" },
    relatedIds: [6, 2, 11, 8],
  },
  {
    id: 8,
    name: "Animal Puzzle Set",
    category: "Puzzles & Games", categoryId: "puzzles",
    price: 399, origPrice: 599, discount: 33, rating: 4.8, reviews: 108,
    bg: "bg-[#f3e5f5]", ageGroup: "2 - 5 Years", material: "Natural Wood", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1589495374906-b7f5ca5de879?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Introduce your toddler to the wonderful world of animals with our charming Animal Puzzle Set! These chunky wooden puzzles feature cute animal pieces with easy-to-grip knobs, making them perfect for little hands. An ideal first puzzle that teaches animal names, colors, and problem-solving skills.",
    highlights: ["6 different animal puzzle boards", "Large, chunky pieces with easy-grip knobs", "Teaches animal recognition and names", "Made from smooth, child-safe wood", "Bright, engaging colors and illustrations"],
    specs: { "Puzzle Boards": "6", "Pieces per Board": "3-5 pieces", "Material": "Natural Plywood", "Age Group": "2 - 5 Years", "Finish": "Non-toxic Paint", "Weight": "520g" },
    relatedIds: [5, 2, 1, 7],
  },
  {
    id: 9,
    name: "Story Books Set (5 Books)",
    category: "Books", categoryId: "books",
    price: 699, origPrice: 1099, discount: 36, rating: 4.9, reviews: 145,
    bg: "bg-[#fff3e0]", ageGroup: "3 - 8 Years", material: "Premium Hardcover", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1509266272358-7701da638078?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Ignite a lifelong love of reading with our enchanting Story Books Set! This collection of 5 beautifully illustrated hardcover books features captivating stories that delight children and parents alike. With rich illustrations and simple, engaging text, these stories are perfect for bedtime or any reading time.",
    highlights: ["Set of 5 beautifully illustrated hardcover books", "Age-appropriate stories with positive messages", "Vibrant, full-color illustrations on every page", "Sturdy hardcover for long-lasting use", "Includes adventure, friendship & nature themes"],
    specs: { "Number of Books": "5", "Pages per Book": "24-32", "Format": "Hardcover", "Age Group": "3 - 8 Years", "Language": "English", "Weight": "720g" },
    relatedIds: [1, 4, 10, 3],
  },
  {
    id: 10,
    name: "Learning Flash Cards",
    category: "Educational", categoryId: "educational",
    price: 399, origPrice: 599, discount: 33, rating: 4.8, reviews: 98,
    bg: "bg-[#e8f5e9]", ageGroup: "2 - 6 Years", material: "Thick Cardboard", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1455884981818-54cb785db6fc?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1509266272358-7701da638078?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Make learning fun with our comprehensive Learning Flash Cards! This set covers alphabets, numbers, shapes, colors, animals, and fruits with clear images and bold text. Perfect for quick learning sessions, these cards help reinforce concepts through repetition in a fun, engaging way.",
    highlights: ["100 double-sided flash cards", "Covers alphabets, numbers, shapes & animals", "Bold, clear text with vibrant illustrations", "Thick, durable cardboard with rounded corners", "Includes instruction booklet with learning games"],
    specs: { "Total Cards": "100", "Card Size": "10 × 7.5 cm", "Material": "300gsm Cardboard", "Age Group": "2 - 6 Years", "Topics": "ABC, 123, Shapes, Colors, Animals", "Weight": "380g" },
    relatedIds: [1, 4, 5, 9],
  },
  {
    id: 11,
    name: "Teddy Bear (Soft Toy)",
    category: "Toys", categoryId: "toys",
    price: 599, origPrice: 899, discount: 33, rating: 4.9, reviews: 121,
    bg: "bg-[#fff8f0]", ageGroup: "0+ Years", material: "Premium Plush", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1602734846297-9299fc2d4703?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1629583908828-2cb711a77327?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Give the gift of a forever friend with our super soft Teddy Bear! This adorable companion is made from premium plush fabric that's irresistibly soft and perfect for cuddles. With safety-stitched features and hypoallergenic filling, it's a safe and comforting companion for children of all ages.",
    highlights: ["Ultra-soft premium plush fabric", "Hypoallergenic polyester filling", "Safety-stitched eyes and nose", "Machine washable for easy care", "30 cm tall — perfect hugging size"],
    specs: { "Height": "30 cm", "Material": "Premium Plush Fabric", "Filling": "Hypoallergenic Polyester", "Age Group": "0+ Years", "Washable": "Machine Washable", "Weight": "220g" },
    relatedIds: [6, 2, 7, 8],
  },
  {
    id: 12,
    name: "Kids Drawing Board",
    category: "Art & Craft", categoryId: "art-craft",
    price: 699, origPrice: 999, discount: 30, rating: 4.7, reviews: 84,
    bg: "bg-[#e3f4fd]", ageGroup: "3 - 10 Years", material: "ABS Plastic", brand: "Design4EverKids",
    images: [
      `${BASE}/photo-1513364776144-60967b0f800f?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1560421683-6856ea585c78?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1617117206620-b01f2919ff86?w=600&h=600&fit=crop&auto=format&q=85`,
      `${BASE}/photo-1434030216411-0b793f4b4173?w=600&h=600&fit=crop&auto=format&q=85`,
    ],
    description: "Spark creativity and save on paper with our Kids Drawing Board! This magnetic drawing board lets children draw, write, and erase endlessly without any mess. The easy-erase slider clears the board in seconds, making it perfect for home, travel, and restaurants to keep little hands busy.",
    highlights: ["Mess-free magnetic drawing technology", "Erase with one swipe of the slider", "Includes 2 drawing stencils and 1 stylus", "Lightweight and portable for travel", "Suitable for drawing, writing, and doodling"],
    specs: { "Board Size": "28 × 20 cm", "Material": "ABS Plastic + Magnetic Layer", "Age Group": "3 - 10 Years", "Includes": "Board, Stylus, 2 Stencils", "Erase": "Magnetic Slider", "Weight": "320g" },
    relatedIds: [3, 10, 5, 1],
  },
];

const sampleReviews = [
  { name: "Priya S.", date: "2 weeks ago", rating: 5, text: "My daughter absolutely loves this! The quality is excellent and she has been using it every day. Highly recommended for all parents!", verified: true },
  { name: "Rahul M.", date: "1 month ago", rating: 5, text: "Great product! The quality is superb and delivery was fast. My kids are very happy with it. Would definitely buy again.", verified: true },
  { name: "Anita K.", date: "3 months ago", rating: 4, text: "Good value for money. My son enjoys it a lot. Delivery was quick and packaging was nice. Will order more items soon.", verified: false },
];

function Stars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
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
  const [wished, setWished] = useState(false);
  return (
    <Link href={`/shop/${product.id}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        <div className={`${product.bg} relative`} style={{ height: 160 }}>
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="25vw" />
          <button
            onClick={(e) => { e.preventDefault(); setWished((w) => !w); }}
            className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            <svg className={`w-4 h-4 ${wished ? "text-[#e91e8c] fill-[#e91e8c]" : "text-gray-400"}`} fill={wished ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        <div className="p-3">
          <h4 className="text-sm font-bold text-[#1a1a2e] line-clamp-2 mb-1.5">{product.name}</h4>
          <div className="flex items-center gap-1 mb-1.5">
            <Stars rating={product.rating} size="sm" />
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-black text-sm text-[#1a1a2e]">₹{product.price}</span>
            <span className="text-xs text-gray-400 line-through">₹{product.origPrice}</span>
            <span className="text-[10px] font-bold text-[#00897b] bg-[#e0f2f1] px-1.5 py-0.5 rounded">{product.discount}% OFF</span>
          </div>
        </div>
      </div>
    </Link>
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
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

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

  const relatedProducts = product.relatedIds
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean) as ProductDetail[];

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#e91e8c] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-[#e91e8c] transition-colors">Shop</Link>
          <span>›</span>
          <Link href={`/categories/${product.categoryId}`} className="hover:text-[#e91e8c] transition-colors">{product.category}</Link>
          <span>›</span>
          <span className="text-[#1a1a2e] font-medium truncate">{product.name}</span>
        </nav>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* Left: Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className={`${product.bg} relative rounded-2xl overflow-hidden`} style={{ height: 420 }}>
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative flex-1 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImg === i ? "border-[#e91e8c]" : "border-gray-200 hover:border-[#f472b6]"
                  }`}
                  style={{ height: 80 }}
                >
                  <Image src={img} alt={`${product.name} view ${i + 1}`} fill className="object-cover" sizes="15vw" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <span className="inline-block bg-[#fce4ec] text-[#e91e8c] text-xs font-bold px-3 py-1 rounded-full mb-3 self-start">
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] leading-tight mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <Stars rating={product.rating} size="md" />
              <span className="text-sm font-bold text-[#1a1a2e]">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
              <span className="text-xs font-bold text-[#2e7d32] bg-[#e8f5e9] px-2.5 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                In Stock
              </span>
            </div>

            <div className="border-t border-gray-100 mb-4" />

            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black text-[#1a1a2e]">₹{product.price}</span>
              <span className="text-lg text-gray-400 line-through">₹{product.origPrice}</span>
              <span className="bg-[#e0f2f1] text-[#00897b] text-sm font-bold px-2.5 py-1 rounded-lg">
                {product.discount}% OFF
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-4">Inclusive of all taxes. Free shipping on orders above ₹499.</p>

            <div className="border-t border-gray-100 mb-4" />

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-semibold text-[#1a1a2e]">Quantity:</span>
              <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-bold text-[#1a1a2e]">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-lg leading-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-5">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 border-2 font-bold text-sm py-3 rounded-full transition-all ${
                  addedToCart
                    ? "border-[#4caf50] text-[#4caf50] bg-[#f1f8e9]"
                    : "border-[#e91e8c] text-[#e91e8c] hover:bg-pink-50"
                }`}
              >
                {addedToCart ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
              <button className="flex-1 bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold text-sm py-3 rounded-full transition-colors shadow-sm">
                Buy Now
              </button>
              <button
                onClick={() => setWished((w) => !w)}
                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                  wished ? "border-[#e91e8c] bg-pink-50" : "border-gray-200 hover:border-[#e91e8c]"
                }`}
                aria-label="Wishlist"
              >
                <svg
                  className={`w-5 h-5 ${wished ? "text-[#e91e8c] fill-[#e91e8c]" : "text-gray-400"}`}
                  fill={wished ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-2.5">
              {[
                { icon: "🚚", text: "Free delivery on orders above ₹499" },
                { icon: "↩️", text: "7-day easy return & exchange policy" },
                { icon: "✅", text: "100% safe & child-friendly materials" },
                { icon: "🎁", text: "Gift wrap available at checkout" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="text-base leading-none">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm border-t border-gray-100 pt-4">
              <div><span className="text-gray-400">Age Group: </span><span className="font-semibold text-[#1a1a2e]">{product.ageGroup}</span></div>
              <div><span className="text-gray-400">Material: </span><span className="font-semibold text-[#1a1a2e]">{product.material}</span></div>
              <div><span className="text-gray-400">Brand: </span><span className="font-semibold text-[#1a1a2e]">{product.brand}</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 mb-10">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {(["description", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab
                    ? "text-[#e91e8c] border-[#e91e8c]"
                    : "text-gray-500 border-transparent hover:text-[#1a1a2e]"
                }`}
              >
                {tab === "specs" ? "Specifications" : tab === "description" ? "Description" : `Reviews (${product.reviews})`}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <div className="space-y-2 pt-2">
                  <h4 className="font-bold text-[#1a1a2e] text-sm">Key Highlights</h4>
                  <ul className="space-y-2">
                    {product.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-gray-700 text-sm">
                        <svg className="w-4 h-4 text-[#e91e8c] fill-[#e91e8c] mt-0.5 shrink-0" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
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
                {/* Rating summary */}
                <div className="flex items-center gap-8 p-5 bg-gray-50 rounded-2xl">
                  <div className="text-center shrink-0">
                    <div className="text-5xl font-black text-[#1a1a2e] mb-1">{product.rating}</div>
                    <Stars rating={product.rating} size="md" />
                    <div className="text-xs text-gray-400 mt-1">{product.reviews} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = s === 5 ? 72 : s === 4 ? 20 : s === 3 ? 6 : s === 2 ? 2 : 0;
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-3 text-right shrink-0">{s}</span>
                          <svg className="w-3 h-3 text-[#fbbf24] fill-[#fbbf24] shrink-0" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#fbbf24] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8 shrink-0">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews list */}
                <div className="space-y-4">
                  {sampleReviews.map((review, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold text-sm shrink-0">
                            {review.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-[#1a1a2e]">{review.name}</div>
                            <div className="text-xs text-gray-400">{review.date}</div>
                          </div>
                        </div>
                        {review.verified && (
                          <span className="text-xs text-[#2e7d32] bg-[#e8f5e9] px-2 py-0.5 rounded-full font-semibold">
                            ✓ Verified Purchase
                          </span>
                        )}
                      </div>
                      <Stars rating={review.rating} size="sm" />
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-xl font-black text-[#1a1a2e] mb-5 flex items-center gap-2">
            You May Also Like <span>✨</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
