// Single source of truth for the storefront catalog.
// Every page (home, shop, product, cart, checkout, account) reads from here.

const BASE = "https://images.unsplash.com";

export const img = (id: string, w = 600, h = 600) =>
  `${BASE}/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export interface Category {
  id: string;
  label: string;
  emoji: string;
  bg: string;
  image: string;
  blurb: string;
}

export const categories: Category[] = [
  { id: "toys",        label: "Toys",            emoji: "🧸", bg: "bg-[#fff3e0]", image: img("1602734846297-9299fc2d4703", 400, 400), blurb: "Soft toys, vehicles and pretend play favourites." },
  { id: "books",       label: "Books",           emoji: "📚", bg: "bg-[#e3f2fd]", image: img("1455884981818-54cb785db6fc", 400, 400), blurb: "Story books, workbooks and early readers." },
  { id: "art-craft",   label: "Art & Craft",     emoji: "🎨", bg: "bg-[#fffde7]", image: img("1560421683-6856ea585c78", 400, 400),    blurb: "Colours, kits and boards for little artists." },
  { id: "educational", label: "Educational",     emoji: "🔤", bg: "bg-[#fce4ec]", image: img("1618842676088-c4d48a6a7c9d", 400, 400), blurb: "Learn-through-play toys, blocks and flash cards." },
  { id: "baby-kids",   label: "Baby & Kids",     emoji: "👶", bg: "bg-[#e0f7fa]", image: img("1545558014-8692077e9b5c", 400, 400),    blurb: "Everyday essentials for babies and kids." },
  { id: "gifts",       label: "Gifts",           emoji: "🎁", bg: "bg-[#f3e5f5]", image: img("1549465220-1a8b9238cd48", 400, 400),    blurb: "Thoughtful gift picks for every age." },
  { id: "outdoor",     label: "Outdoor Play",    emoji: "🚗", bg: "bg-[#fbe9e7]", image: img("1532330393533-443990a51d10", 400, 400), blurb: "Get moving with balls, cars and active play." },
  { id: "puzzles",     label: "Puzzles & Games", emoji: "🧩", bg: "bg-[#e8f5e9]", image: img("1589495374906-b7f5ca5de879", 400, 400), blurb: "Puzzles and games that build thinking skills." },
];

export const ageGroups = [
  { label: "0 - 2 Years", min: 0, max: 2 },
  { label: "3 - 5 Years", min: 3, max: 5 },
  { label: "6 - 8 Years", min: 6, max: 8 },
  { label: "9 - 12 Years", min: 9, max: 12 },
];

export interface Product {
  id: number;
  name: string;
  tagline: string;
  categoryId: string;
  /** Extra categories the product also appears under (e.g. "gifts"). */
  alsoIn?: string[];
  price: number;
  origPrice: number;
  rating: number;
  reviews: number;
  sold: string;
  stock: number;
  bg: string;
  ageMin: number;
  ageMax: number;
  material: string;
  brand: string;
  images: string[];
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  relatedIds: number[];
  isNew?: boolean;
  bestseller?: boolean;
  /** Lower = more popular, used for "Most Popular" sort. */
  rank: number;
  /** Days since the product was added, used for "Newest First". */
  addedDaysAgo: number;
}

const p = (x: Omit<Product, "images"> & { images: string[] }) => x;

export const products: Product[] = [
  p({
    id: 1, name: "Alphabet Tracing Workbook", tagline: "Trace · Learn · Grow", categoryId: "books", alsoIn: ["educational"],
    price: 299, origPrice: 499, rating: 4.9, reviews: 128, sold: "1.2k+", stock: 50, bg: "bg-[#fef9ef]",
    ageMin: 3, ageMax: 6, material: "Premium Paper", brand: "Design4EverKids",
    images: [img("1481627834876-b7833e8f5570"), img("1456513080510-7bf3a84b82f8"), img("1434030216411-0b793f4b4173"), img("1455884981818-54cb785db6fc")],
    description: "Help your little one master the alphabet with this beautifully designed tracing workbook. Each page features large, clear letters with dotted guidelines for easy tracing, colorful illustrations to keep children engaged, and fun activities to reinforce letter recognition.",
    highlights: ["52 pages of guided alphabet tracing", "Upper & lowercase letters with clear guidelines", "Colorful illustrations for each letter", "Develops fine motor skills and hand-eye coordination", "Builds school-ready writing confidence"],
    specs: { Pages: "52", Dimensions: "21 × 29.7 cm (A4)", Material: "Premium Matte Paper", "Age Group": "3 - 6 Years", Language: "English", Publisher: "Design4EverKids", Weight: "280g" },
    relatedIds: [4, 9, 10, 2], bestseller: true, rank: 2, addedDaysAgo: 120,
  }),
  p({
    id: 2, name: "Wooden Stacking Rings", tagline: "Stack · Sort · Discover", categoryId: "toys", alsoIn: ["gifts"],
    price: 499, origPrice: 799, rating: 4.8, reviews: 96, sold: "800+", stock: 35, bg: "bg-[#fef0f7]",
    ageMin: 1, ageMax: 4, material: "Natural Rubberwood", brand: "Design4EverKids",
    images: [img("1629583908828-2cb711a77327"), img("1587654780291-39c9404d746b"), img("1566576912321-d58ddd7a6088"), img("1602734846297-9299fc2d4703")],
    description: "Our beautifully crafted Wooden Stacking Rings are a classic toy designed to develop your child's fine motor skills, color recognition, and problem-solving abilities. Made from natural, child-safe wood with non-toxic paint, this timeless toy grows with your child.",
    highlights: ["8 colorful wooden rings in different sizes", "Non-toxic, child-safe paint and materials", "Promotes size sequencing and color recognition", "Enhances fine motor skills and hand-eye coordination", "Smooth, rounded edges for safe play"],
    specs: { Pieces: "8 rings + 1 base", Dimensions: "15 × 15 × 18 cm", Material: "Natural Rubberwood", "Age Group": "1 - 4 Years", Finish: "Non-toxic Paint", Weight: "320g" },
    relatedIds: [5, 8, 11, 3], bestseller: true, rank: 6, addedDaysAgo: 90,
  }),
  p({
    id: 3, name: "Mega Art & Craft Kit", tagline: "Create · Imagine · Express", categoryId: "art-craft", alsoIn: ["gifts"],
    price: 699, origPrice: 1099, rating: 4.8, reviews: 112, sold: "950+", stock: 28, bg: "bg-[#fef3e2]",
    ageMin: 4, ageMax: 10, material: "Mixed Non-Toxic Materials", brand: "Design4EverKids",
    images: [img("1560421683-6856ea585c78"), img("1513364776144-60967b0f800f"), img("1617117206620-b01f2919ff86"), img("1572375992501-4b0892d50c69")],
    description: "Unleash your child's inner artist with our Mega Art & Craft Kit! This all-in-one creative set comes packed with premium quality art supplies to inspire hours of creativity. Whether painting, drawing, or crafting, this kit has everything a young artist needs.",
    highlights: ["100+ pieces of premium art supplies", "Includes crayons, paints, markers, and craft materials", "Non-toxic and washable paints", "Comes in a handy storage case", "Encourages creativity and self-expression"],
    specs: { "Total Pieces": "100+", Includes: "Crayons, Paints, Markers, Stencils", Material: "Non-toxic, Child-safe", "Age Group": "4 - 10 Years", Storage: "Includes carry case", Weight: "680g" },
    relatedIds: [12, 10, 1, 6], bestseller: true, rank: 4, addedDaysAgo: 75,
  }),
  p({
    id: 4, name: "Number Tracing Workbook", tagline: "Count · Write · Learn", categoryId: "books", alsoIn: ["educational"],
    price: 299, origPrice: 499, rating: 4.9, reviews: 104, sold: "1.0k+", stock: 60, bg: "bg-[#e3f4fd]",
    ageMin: 3, ageMax: 6, material: "Premium Paper", brand: "Design4EverKids",
    images: [img("1455884981818-54cb785db6fc"), img("1481627834876-b7833e8f5570"), img("1434030216411-0b793f4b4173"), img("1456513080510-7bf3a84b82f8")],
    description: "Give your child a head start in mathematics with our Number Tracing Workbook! Designed to make learning numbers fun and engaging, this workbook helps children aged 3-6 develop number recognition, counting skills, and pre-writing abilities through guided tracing activities.",
    highlights: ["Numbers 1-20 with guided tracing", "Counting activities with colorful pictures", "Number words for early literacy", "Progressive difficulty to build confidence", "Perfect companion to Alphabet Tracing Workbook"],
    specs: { Pages: "48", "Numbers Covered": "1 - 20", Dimensions: "21 × 29.7 cm (A4)", Material: "Premium Matte Paper", "Age Group": "3 - 6 Years", Weight: "260g" },
    relatedIds: [1, 9, 10, 5], rank: 8, addedDaysAgo: 110,
  }),
  p({
    id: 5, name: "Wooden Building Blocks", tagline: "Build · Learn · Explore", categoryId: "educational", alsoIn: ["toys"],
    price: 590, origPrice: 899, rating: 4.8, reviews: 89, sold: "700+", stock: 42, bg: "bg-[#fff8f0]",
    ageMin: 2, ageMax: 6, material: "Natural Pinewood", brand: "Design4EverKids",
    images: [img("1587654780291-39c9404d746b"), img("1629583908828-2cb711a77327"), img("1566576912321-d58ddd7a6088"), img("1602734846297-9299fc2d4703")],
    description: "Build, learn and explore with our Wooden Building Blocks set! These beautifully crafted blocks feature letters, numbers, and shapes to make learning a hands-on adventure. Perfect for open-ended play that sparks imagination while teaching fundamental concepts.",
    highlights: ["50 wooden blocks with letters, numbers & shapes", "Made from natural, child-safe wood", "Teaches alphabet, counting and shape recognition", "Develops spatial reasoning and creativity", "Includes educational activity guide"],
    specs: { Pieces: "50", "Block Size": "3.5 × 3.5 × 3.5 cm", Material: "Natural Pinewood", "Age Group": "2 - 6 Years", Finish: "Non-toxic Paint", Weight: "850g" },
    relatedIds: [2, 8, 1, 10], bestseller: true, rank: 1, addedDaysAgo: 140,
  }),
  p({
    id: 6, name: "Kids Water Bottle", tagline: "Sip · Play · Stay Fresh", categoryId: "baby-kids",
    price: 399, origPrice: 599, rating: 4.7, reviews: 76, sold: "600+", stock: 80, bg: "bg-[#fce4ec]",
    ageMin: 2, ageMax: 10, material: "BPA-Free Tritan Plastic", brand: "Design4EverKids",
    images: [img("1602143407151-7111542de6e8"), img("1545558014-8692077e9b5c"), img("1602734846297-9299fc2d4703"), img("1629583908828-2cb711a77327")],
    description: "Keep your little one hydrated all day with our adorable Kids Water Bottle! Featuring fun, colorful designs and a leak-proof lid, this bottle is perfect for school, sports, and outdoor adventures. Made from BPA-free materials for safe, healthy hydration.",
    highlights: ["500ml capacity, perfect size for kids", "BPA-free, food-grade materials", "Leak-proof flip-top lid", "Easy-grip design for small hands", "Dishwasher safe for easy cleaning"],
    specs: { Capacity: "500ml", Material: "BPA-Free Tritan Plastic", Lid: "Flip-top with Lock", "Age Group": "2 - 10 Years", "Dishwasher Safe": "Yes", Weight: "140g" },
    relatedIds: [11, 7, 2, 5], rank: 14, addedDaysAgo: 20, isNew: true,
  }),
  p({
    id: 7, name: "Outdoor Play Ball Set", tagline: "Roll · Bounce · Play", categoryId: "outdoor",
    price: 499, origPrice: 799, rating: 4.8, reviews: 92, sold: "750+", stock: 55, bg: "bg-[#e8f5e9]",
    ageMin: 3, ageMax: 12, material: "Natural Rubber", brand: "Design4EverKids",
    images: [img("1558618666-fcd25c85cd64"), img("1568702846914-96b305d2aaeb"), img("1532330393533-443990a51d10"), img("1602734846297-9299fc2d4703")],
    description: "Get the kids moving with our Outdoor Play Ball Set! This vibrant collection includes balls in different sizes for a variety of outdoor games. Perfect for solo play or group activities, these durable rubber balls encourage physical activity, coordination, and social skills.",
    highlights: ["Set of 5 balls in assorted sizes and colors", "High-quality, durable rubber construction", "Great for football, basketball, and dodgeball", "Promotes physical activity and teamwork", "Suitable for indoor and outdoor use"],
    specs: { "Set Contains": "5 balls", Sizes: "10cm, 15cm, 18cm, 20cm, 22cm", Material: "Natural Rubber", "Age Group": "3 - 12 Years", Surface: "Indoor & Outdoor", Weight: "480g" },
    relatedIds: [6, 13, 11, 8], rank: 12, addedDaysAgo: 60,
  }),
  p({
    id: 8, name: "Animal Puzzle Set", tagline: "Fit · Match · Discover", categoryId: "puzzles", alsoIn: ["educational"],
    price: 399, origPrice: 599, rating: 4.8, reviews: 108, sold: "900+", stock: 38, bg: "bg-[#f3e5f5]",
    ageMin: 2, ageMax: 5, material: "Natural Plywood", brand: "Design4EverKids",
    images: [img("1589495374906-b7f5ca5de879"), img("1629583908828-2cb711a77327"), img("1587654780291-39c9404d746b"), img("1566576912321-d58ddd7a6088")],
    description: "Introduce your toddler to the wonderful world of animals with our charming Animal Puzzle Set! These chunky wooden puzzles feature cute animal pieces with easy-to-grip knobs, making them perfect for little hands.",
    highlights: ["6 different animal puzzle boards", "Large, chunky pieces with easy-grip knobs", "Teaches animal recognition and names", "Made from smooth, child-safe wood", "Bright, engaging colors and illustrations"],
    specs: { "Puzzle Boards": "6", "Pieces per Board": "3-5 pieces", Material: "Natural Plywood", "Age Group": "2 - 5 Years", Finish: "Non-toxic Paint", Weight: "520g" },
    relatedIds: [5, 2, 17, 7], rank: 9, addedDaysAgo: 85,
  }),
  p({
    id: 9, name: "Story Books Set (5 Books)", tagline: "Read · Dream · Explore", categoryId: "books", alsoIn: ["gifts"],
    price: 699, origPrice: 1099, rating: 4.9, reviews: 145, sold: "1.5k+", stock: 45, bg: "bg-[#fff3e0]",
    ageMin: 3, ageMax: 8, material: "Premium Hardcover", brand: "Design4EverKids",
    images: [img("1509266272358-7701da638078"), img("1481627834876-b7833e8f5570"), img("1455884981818-54cb785db6fc"), img("1456513080510-7bf3a84b82f8")],
    description: "Ignite a lifelong love of reading with our enchanting Story Books Set! This collection of 5 beautifully illustrated hardcover books features captivating stories that delight children and parents alike.",
    highlights: ["Set of 5 beautifully illustrated hardcover books", "Age-appropriate stories with positive messages", "Vibrant, full-color illustrations on every page", "Sturdy hardcover for long-lasting use", "Includes adventure, friendship & nature themes"],
    specs: { "Number of Books": "5", "Pages per Book": "24-32", Format: "Hardcover", "Age Group": "3 - 8 Years", Language: "English", Weight: "720g" },
    relatedIds: [1, 4, 10, 19], bestseller: true, rank: 3, addedDaysAgo: 100,
  }),
  p({
    id: 10, name: "Learning Flash Cards", tagline: "Learn · Practice · Master", categoryId: "educational",
    price: 399, origPrice: 599, rating: 4.8, reviews: 98, sold: "820+", stock: 65, bg: "bg-[#e8f5e9]",
    ageMin: 2, ageMax: 6, material: "300gsm Cardboard", brand: "Design4EverKids",
    images: [img("1434030216411-0b793f4b4173"), img("1481627834876-b7833e8f5570"), img("1455884981818-54cb785db6fc"), img("1509266272358-7701da638078")],
    description: "Make learning fun with our comprehensive Learning Flash Cards! This set covers alphabets, numbers, shapes, colors, animals, and fruits with clear images and bold text.",
    highlights: ["100 double-sided flash cards", "Covers alphabets, numbers, shapes & animals", "Bold, clear text with vibrant illustrations", "Thick, durable cardboard with rounded corners", "Includes instruction booklet with learning games"],
    specs: { "Total Cards": "100", "Card Size": "10 × 7.5 cm", Material: "300gsm Cardboard", "Age Group": "2 - 6 Years", Topics: "ABC, 123, Shapes, Colors, Animals", Weight: "380g" },
    relatedIds: [1, 4, 5, 9], rank: 10, addedDaysAgo: 45,
  }),
  p({
    id: 11, name: "Teddy Bear Soft Toy", tagline: "Soft · Cuddly · Loveable", categoryId: "toys", alsoIn: ["gifts", "baby-kids"],
    price: 499, origPrice: 799, rating: 4.9, reviews: 121, sold: "1.1k+", stock: 30, bg: "bg-[#fff8f0]",
    ageMin: 0, ageMax: 12, material: "Premium Plush Fabric", brand: "Design4EverKids",
    images: [img("1602734846297-9299fc2d4703"), img("1629583908828-2cb711a77327"), img("1566576912321-d58ddd7a6088"), img("1587654780291-39c9404d746b")],
    description: "Give the gift of a forever friend with our super soft Teddy Bear! Made from premium plush fabric that's irresistibly soft and perfect for cuddles. With safety-stitched features and hypoallergenic filling.",
    highlights: ["Ultra-soft premium plush fabric", "Hypoallergenic polyester filling", "Safety-stitched eyes and nose", "Machine washable for easy care", "30 cm tall — perfect hugging size"],
    specs: { Height: "30 cm", Material: "Premium Plush Fabric", Filling: "Hypoallergenic Polyester", "Age Group": "0+ Years", Washable: "Machine Washable", Weight: "220g" },
    relatedIds: [16, 2, 7, 8], bestseller: true, rank: 5, addedDaysAgo: 130,
  }),
  p({
    id: 12, name: "Kids Drawing Board", tagline: "Draw · Erase · Repeat", categoryId: "art-craft",
    price: 699, origPrice: 999, rating: 4.7, reviews: 84, sold: "680+", stock: 22, bg: "bg-[#e3f4fd]",
    ageMin: 3, ageMax: 10, material: "ABS Plastic", brand: "Design4EverKids",
    images: [img("1513364776144-60967b0f800f"), img("1560421683-6856ea585c78"), img("1617117206620-b01f2919ff86"), img("1434030216411-0b793f4b4173")],
    description: "Spark creativity and save on paper with our Kids Drawing Board! This magnetic drawing board lets children draw, write, and erase endlessly without any mess.",
    highlights: ["Mess-free magnetic drawing technology", "Erase with one swipe of the slider", "Includes 2 drawing stencils and 1 stylus", "Lightweight and portable for travel", "Suitable for drawing, writing, and doodling"],
    specs: { "Board Size": "28 × 20 cm", Material: "ABS Plastic + Magnetic Layer", "Age Group": "3 - 10 Years", Includes: "Board, Stylus, 2 Stencils", Erase: "Magnetic Slider", Weight: "320g" },
    relatedIds: [3, 10, 19, 1], rank: 13, addedDaysAgo: 25, isNew: true,
  }),
  p({
    id: 13, name: "Remote Control Car", tagline: "Zoom · Drift · Race", categoryId: "outdoor", alsoIn: ["toys", "gifts"],
    price: 799, origPrice: 1199, rating: 4.5, reviews: 89, sold: "640+", stock: 31, bg: "bg-[#e8f5e9]",
    ageMin: 5, ageMax: 12, material: "ABS Plastic", brand: "SpeedKidz",
    images: [img("1566576912321-d58ddd7a6088"), img("1558618666-fcd25c85cd64"), img("1532330393533-443990a51d10"), img("1587654780291-39c9404d746b")],
    description: "A rugged, rechargeable remote control car with responsive steering and shock-absorbing wheels. Built for living-room laps and backyard adventures alike.",
    highlights: ["2.4GHz remote with 30m range", "Rechargeable battery with USB charging", "Shock-absorbing rubber tyres", "Speeds up to 15 km/h", "Durable, crash-resistant body"],
    specs: { Scale: "1:18", Battery: "Rechargeable Li-ion", "Run Time": "25 minutes", Range: "30 m", "Age Group": "5 - 12 Years", Weight: "450g" },
    relatedIds: [7, 14, 18, 11], bestseller: true, rank: 7, addedDaysAgo: 50,
  }),
  p({
    id: 14, name: "Kids Backpack", tagline: "Pack · Carry · Explore", categoryId: "baby-kids",
    price: 899, origPrice: 1299, rating: 4.5, reviews: 52, sold: "400+", stock: 0, bg: "bg-[#fce4ec]",
    ageMin: 3, ageMax: 10, material: "Water-resistant Polyester", brand: "Design4EverKids",
    images: [img("1553062407-98eeb64c6a62"), img("1545558014-8692077e9b5c"), img("1602143407151-7111542de6e8"), img("1549465220-1a8b9238cd48")],
    description: "A lightweight, padded backpack with playful prints, sized just right for school, picnics and weekend trips.",
    highlights: ["Padded, adjustable shoulder straps", "Water-resistant fabric", "Front pocket and side bottle holder", "Reflective strip for safety", "Fits A4 books"],
    specs: { Capacity: "12 L", Material: "Water-resistant Polyester", Dimensions: "38 × 28 × 12 cm", "Age Group": "3 - 10 Years", Weight: "380g" },
    relatedIds: [6, 13, 11, 16], rank: 16, addedDaysAgo: 35,
  }),
  p({
    id: 15, name: "Kitchen Play Set", tagline: "Cook · Pretend · Share", categoryId: "toys", alsoIn: ["gifts"],
    price: 899, origPrice: 1299, rating: 4.5, reviews: 74, sold: "520+", stock: 15, bg: "bg-[#fff3e0]",
    ageMin: 3, ageMax: 8, material: "Engineered Wood", brand: "Design4EverKids",
    images: [img("1617117206620-b01f2919ff86"), img("1572375992501-4b0892d50c69"), img("1560421683-6856ea585c78"), img("1549465220-1a8b9238cd48")],
    description: "A charming pretend-play kitchen with a stove, sink, oven and accessories. Encourages role play, sharing and imaginative storytelling.",
    highlights: ["Stove, sink, oven and shelves", "Includes 12 play-food accessories", "Rounded, child-safe edges", "Easy assembly", "Encourages social & role play"],
    specs: { Dimensions: "60 × 30 × 70 cm", Material: "Engineered Wood", Accessories: "12 pieces", "Age Group": "3 - 8 Years", Weight: "4.2 kg" },
    relatedIds: [16, 11, 3, 2], rank: 11, addedDaysAgo: 15, isNew: true,
  }),
  p({
    id: 16, name: "Doll Set", tagline: "Dress · Play · Imagine", categoryId: "toys", alsoIn: ["gifts"],
    price: 599, origPrice: 899, rating: 4.6, reviews: 67, sold: "480+", stock: 26, bg: "bg-[#fce4ec]",
    ageMin: 3, ageMax: 9, material: "Soft Vinyl & Fabric", brand: "Design4EverKids",
    images: [img("1545558014-8692077e9b5c"), img("1549465220-1a8b9238cd48"), img("1602734846297-9299fc2d4703"), img("1617117206620-b01f2919ff86")],
    description: "A sweet doll with three outfit changes and accessories, made for endless dress-up and storytelling fun.",
    highlights: ["Doll with 3 outfit changes", "Brushable hair", "Soft, child-safe materials", "Includes shoes and accessories", "Gift-ready packaging"],
    specs: { Height: "30 cm", Material: "Soft Vinyl & Fabric", Includes: "Doll, 3 outfits, accessories", "Age Group": "3 - 9 Years", Weight: "350g" },
    relatedIds: [15, 11, 2, 3], rank: 15, addedDaysAgo: 10, isNew: true,
  }),
  p({
    id: 17, name: "Alphabet Puzzle", tagline: "Find · Fit · Spell", categoryId: "puzzles", alsoIn: ["educational"],
    price: 499, origPrice: 699, rating: 4.5, reviews: 120, sold: "980+", stock: 62, bg: "bg-[#f3e5f5]",
    ageMin: 2, ageMax: 6, material: "Natural Plywood", brand: "Design4EverKids",
    images: [img("1589495374906-b7f5ca5de879"), img("1587654780291-39c9404d746b"), img("1434030216411-0b793f4b4173"), img("1629583908828-2cb711a77327")],
    description: "A chunky wooden A–Z puzzle board with colourful letters. Kids learn letter shapes and sounds while building hand-eye coordination.",
    highlights: ["26 chunky wooden letters", "Bright, non-toxic colours", "Builds letter recognition", "Sturdy tray for easy storage", "Great first spelling tool"],
    specs: { Pieces: "26", Dimensions: "40 × 30 cm", Material: "Natural Plywood", "Age Group": "2 - 6 Years", Weight: "600g" },
    relatedIds: [8, 1, 5, 10], rank: 17, addedDaysAgo: 8, isNew: true,
  }),
  p({
    id: 18, name: "Dinosaur Toy Set", tagline: "Roar · Explore · Learn", categoryId: "toys",
    price: 699, origPrice: 999, rating: 4.6, reviews: 58, sold: "350+", stock: 8, bg: "bg-[#e8f5e9]",
    ageMin: 3, ageMax: 10, material: "BPA-Free Plastic", brand: "DinoWorld",
    images: [img("1558618666-fcd25c85cd64"), img("1532330393533-443990a51d10"), img("1566576912321-d58ddd7a6088"), img("1568702846914-96b305d2aaeb")],
    description: "A set of six realistic dinosaur figures with a fact card for each — perfect for little palaeontologists.",
    highlights: ["6 realistic dinosaur figures", "Fact card for each species", "Durable, BPA-free plastic", "Great for sensory and small-world play", "Storage bag included"],
    specs: { Figures: "6", Size: "8 - 15 cm", Material: "BPA-Free Plastic", "Age Group": "3 - 10 Years", Weight: "420g" },
    relatedIds: [13, 7, 11, 8], rank: 18, addedDaysAgo: 5, isNew: true,
  }),
  p({
    id: 19, name: "Coloring Books Set (5)", tagline: "Colour · Create · Smile", categoryId: "books", alsoIn: ["art-craft"],
    price: 299, origPrice: 449, rating: 4.7, reviews: 176, sold: "1.3k+", stock: 94, bg: "bg-[#fffde7]",
    ageMin: 3, ageMax: 8, material: "Premium Paper", brand: "Design4EverKids",
    images: [img("1455884981818-54cb785db6fc"), img("1513364776144-60967b0f800f"), img("1560421683-6856ea585c78"), img("1509266272358-7701da638078")],
    description: "Five themed colouring books — animals, vehicles, nature, space and fairy tales — printed on thick paper that handles crayons and markers.",
    highlights: ["5 themed colouring books", "Thick paper, no bleed-through", "Large, simple outlines", "Encourages focus and creativity", "Great for travel"],
    specs: { Books: "5", "Pages per Book": "32", Material: "120gsm Paper", "Age Group": "3 - 8 Years", Weight: "500g" },
    relatedIds: [3, 12, 9, 1], bestseller: true, rank: 19, addedDaysAgo: 30,
  }),
];

export const discountOf = (prod: Pick<Product, "price" | "origPrice">) =>
  Math.round(((prod.origPrice - prod.price) / prod.origPrice) * 100);

export const getProduct = (id: number) => products.find((x) => x.id === id);

export const getCategory = (id: string) => categories.find((c) => c.id === id);

export const categoryLabel = (id: string) => getCategory(id)?.label ?? id;

export const inCategory = (prod: Product, catId: string) =>
  prod.categoryId === catId || (prod.alsoIn ?? []).includes(catId);

export const productsIn = (catId: string) => products.filter((x) => inCategory(x, catId));

export const bestSellers = () => products.filter((x) => x.bestseller).sort((a, b) => a.rank - b.rank);

export const newArrivals = () => [...products].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo).filter((x) => x.addedDaysAgo <= 45);

export const ageLabel = (prod: Product) => (prod.ageMax >= 12 && prod.ageMin === 0 ? "0+ Years" : `${prod.ageMin} - ${prod.ageMax} Years`);

export function relatedProducts(prod: Product, count = 5) {
  const from = prod.relatedIds.map(getProduct).filter((x): x is Product => !!x);
  const extras = products.filter((x) => x.id !== prod.id && !prod.relatedIds.includes(x.id) && x.categoryId === prod.categoryId);
  const rest = products.filter((x) => x.id !== prod.id && !from.includes(x) && !extras.includes(x));
  return [...from, ...extras, ...rest].slice(0, count);
}

export function searchProducts(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return products;
  return products.filter(
    (x) =>
      x.name.toLowerCase().includes(s) ||
      x.tagline.toLowerCase().includes(s) ||
      categoryLabel(x.categoryId).toLowerCase().includes(s) ||
      x.description.toLowerCase().includes(s),
  );
}

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// ── Pricing rules shared by cart, checkout and order records ──

export const FREE_SHIPPING_THRESHOLD = 499;

export const shippingMethods = {
  standard: { label: "Standard Delivery", eta: "3 - 7 Business Days", price: 60, days: 7 },
  express: { label: "Express Delivery", eta: "1 - 3 Business Days", price: 120, days: 3 },
} as const;

export type ShippingMethod = keyof typeof shippingMethods;

export function shippingCost(method: ShippingMethod, subtotal: number) {
  if (subtotal === 0) return 0;
  if (method === "standard" && subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return shippingMethods[method].price;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  kind: "percent" | "flat";
  value: number;
  minOrder: number;
  maxDiscount?: number;
}

export const coupons: Coupon[] = [
  { code: "KIDS10", title: "10% Off Everything", description: "Flat 10% off on your order, up to ₹300.", kind: "percent", value: 10, minOrder: 0, maxDiscount: 300 },
  { code: "WELCOME100", title: "₹100 Off First Order", description: "₹100 off on orders above ₹799.", kind: "flat", value: 100, minOrder: 799 },
  { code: "FESTIVE15", title: "Festive 15% Off", description: "15% off on orders above ₹1,499, up to ₹500.", kind: "percent", value: 15, minOrder: 1499, maxDiscount: 500 },
];

export function evaluateCoupon(code: string, subtotal: number): { ok: true; coupon: Coupon; discount: number } | { ok: false; error: string } {
  const c = coupons.find((x) => x.code === code.trim().toUpperCase());
  if (!c) return { ok: false, error: "Invalid coupon code." };
  if (subtotal < c.minOrder) return { ok: false, error: `Add ${formatINR(c.minOrder - subtotal)} more to use ${c.code}.` };
  let d = c.kind === "percent" ? Math.round((subtotal * c.value) / 100) : c.value;
  if (c.maxDiscount) d = Math.min(d, c.maxDiscount);
  return { ok: true, coupon: c, discount: Math.min(d, subtotal) };
}

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry",
];
