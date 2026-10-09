// Static copy for help, policy and blog pages.

import type { InfoSection } from "@/components/content/InfoPage";
import { img } from "./catalog";

type Info = { title: string; emoji?: string; subtitle?: string; updated?: string; sections: InfoSection[] };

const UPDATED = "1 October 2026";

export const shippingPage: Info = {
  title: "Shipping Info", emoji: "🚚", subtitle: "How and when your goodies reach you.", updated: UPDATED,
  sections: [
    { title: "Delivery options", bullets: ["Standard Delivery — 3 to 7 business days, ₹60 (FREE on orders above ₹499).", "Express Delivery — 1 to 3 business days, ₹120 on any order.", "We deliver to 19,000+ pincodes across India."] },
    { title: "Order processing", body: ["Orders placed before 2 PM (Mon–Sat) are packed and handed to our courier partner the same day. Orders placed after 2 PM or on Sundays and public holidays are processed on the next business day."] },
    { title: "Tracking your order", body: ["Once your order ships, you will receive an email and SMS with tracking details. You can also follow every step from My Account → My Orders, or use the Track Order page with your order number."] },
    { title: "Cash on Delivery", body: ["COD is available for orders up to ₹5,000. Please keep the exact amount ready — our delivery partners may not carry change."] },
    { title: "Delays", body: ["Remote locations, weather and festive rush can occasionally add 1–3 days. If your order is late beyond the estimated date, contact us and we will chase it for you."] },
  ],
};

export const returnsPage: Info = {
  title: "Returns & Refunds", emoji: "🔄", subtitle: "Not happy? We'll make it right.", updated: UPDATED,
  sections: [
    { title: "7-day easy returns", body: ["You can request a return within 7 days of delivery for most products. Go to My Account → My Orders, open the order and tap Return."] },
    { title: "Eligibility", bullets: ["Items must be unused, with tags and original packaging.", "Books with writing, opened art supplies and hygiene products (bottles, teethers) can be returned only if damaged or defective.", "Free gifts that came with the order must be returned too."] },
    { title: "Pickup", body: ["Our courier partner will pick up the item from your delivery address within 2–3 business days of your request. Please keep it packed and ready."] },
    { title: "Refund timelines", bullets: ["UPI / Wallets: 2–4 business days after quality check.", "Cards / Net Banking: 5–7 business days after quality check.", "Cash on Delivery orders: refunded to your bank account or UPI ID within 5 business days."] },
    { title: "Damaged or wrong item?", body: ["If something arrives damaged or isn't what you ordered, report it within 48 hours with a photo and we will send a free replacement or a full refund — no questions asked."] },
  ],
};

export const refundPage: Info = {
  title: "Refund Policy", emoji: "💸", subtitle: "Clear, simple and fair refunds.", updated: UPDATED,
  sections: [
    { title: "Cancelled orders", body: ["Orders cancelled before they are delivered are refunded in full, including shipping charges, to the original payment method."] },
    { title: "Returned orders", body: ["Once a returned item passes quality check, we refund the item price. Shipping charges are refunded only if the return is due to our error (damaged, defective or wrong item)."] },
    { title: "Coupons", body: ["If an order used a coupon, the refund is calculated on the amount you actually paid. Coupons are single-use and are not reissued for cancelled orders."] },
    { title: "Timelines", bullets: ["UPI / Wallets: 2–4 business days.", "Cards / Net Banking: 5–7 business days.", "COD: 5 business days to your bank account or UPI ID."] },
  ],
};

export const privacyPage: Info = {
  title: "Privacy Policy", emoji: "🔒", subtitle: "Your family's privacy matters to us.", updated: UPDATED,
  sections: [
    { title: "What we collect", bullets: ["Account details: name, email, phone number.", "Delivery addresses you save or use at checkout.", "Order history, wishlist and reviews.", "Basic device and usage data to keep the site secure and fast."] },
    { title: "How we use it", bullets: ["To process and deliver your orders.", "To send order updates and, if you opt in, offers and newsletters.", "To improve recommendations and our product range."] },
    { title: "Children's privacy", body: ["Design4Ever is meant to be used by parents and guardians. We do not knowingly collect personal information from children. The optional child's name on your profile is used only to personalise recommendations."] },
    { title: "Payments", body: ["Payments are processed by certified payment gateways. We never store your full card number, CVV or UPI PIN."] },
    { title: "Your choices", body: ["You can update your profile, manage notification preferences or delete your account at any time from My Account → Settings."] },
  ],
};

export const termsPage: Info = {
  title: "Terms & Conditions", emoji: "📜", subtitle: "The fine print, written plainly.", updated: UPDATED,
  sections: [
    { title: "Using our store", body: ["By creating an account or placing an order you agree to these terms. You must be 18 or older to make a purchase."] },
    { title: "Pricing & availability", body: ["All prices are in Indian Rupees and include GST. Prices and stock can change without notice; the price shown at checkout is the price you pay."] },
    { title: "Orders", body: ["An order is confirmed once you receive an order number. We may cancel an order if an item is out of stock or if we suspect fraud, and will refund any payment in full."] },
    { title: "Product safety", body: ["Please follow the age guidance on every product. Toys for ages 3+ may contain small parts and are not suitable for younger children."] },
    { title: "Liability", body: ["Our liability for any order is limited to the amount paid for that order."] },
  ],
};

export const cookiePage: Info = {
  title: "Cookie Policy", emoji: "🍪", subtitle: "What we store on your device and why.", updated: UPDATED,
  sections: [
    { title: "Essential storage", body: ["We store your cart, wishlist and sign-in session on your device so the store works as you shop. These can't be switched off."] },
    { title: "Preferences", body: ["We remember choices like notification settings so you don't have to set them every visit."] },
    { title: "Analytics", body: ["We may use privacy-friendly analytics to understand which pages are useful. No personal information is sold to third parties."] },
    { title: "Managing cookies", body: ["You can clear site data from your browser settings at any time. Clearing it will sign you out and empty your cart on that device."] },
  ],
};

export const partnerPage: Info = {
  title: "Partner Guidelines", emoji: "🤝", subtitle: "Standards for brands selling on Design4Ever.", updated: UPDATED,
  sections: [
    { title: "Product safety first", bullets: ["All toys must meet BIS (IS 9873) safety standards.", "Paints and inks must be non-toxic and lead-free.", "Clear age grading and small-parts warnings on packaging."] },
    { title: "Listings", bullets: ["Real product photos on a clean background (min. 1000×1000 px).", "Accurate descriptions, dimensions and materials.", "No misleading discounts or claims."] },
    { title: "Fulfilment", bullets: ["Dispatch within 48 hours of an order.", "Kid-friendly, plastic-minimal packaging.", "Maintain a cancellation rate below 2%."] },
    { title: "Payouts", body: ["Payouts are made every 7 days for delivered orders, minus the agreed commission. Detailed statements are available in the vendor dashboard."] },
  ],
};

export const faqs: { cat: string; q: string; a: string }[] = [
  { cat: "Orders", q: "How do I track my order?", a: "Go to My Account → My Orders and open your order to see live tracking. You can also use the Track Order page with your order number and email or phone." },
  { cat: "Orders", q: "Can I cancel my order?", a: "Yes — you can cancel any order that hasn't been delivered yet from the order details page. Paid orders are refunded to the original payment method." },
  { cat: "Orders", q: "Can I change my delivery address?", a: "While an order is still Processing, open it in My Orders and tap Change Address." },
  { cat: "Payments", q: "Which payment methods do you accept?", a: "UPI (Google Pay, PhonePe, Paytm, BHIM), credit and debit cards, net banking, wallets and Cash on Delivery for orders up to ₹5,000." },
  { cat: "Payments", q: "How do coupons work?", a: "Enter the code in your cart or at checkout. Only one coupon can be used per order. See all current codes on the Offers page." },
  { cat: "Shipping", q: "Is shipping free?", a: "Standard delivery is free on orders above ₹499. Below that it costs ₹60. Express delivery is ₹120." },
  { cat: "Shipping", q: "How long does delivery take?", a: "Standard: 3–7 business days. Express: 1–3 business days." },
  { cat: "Returns", q: "What is your return policy?", a: "Most items can be returned within 7 days of delivery if unused and in original packaging. Start a return from the order details page." },
  { cat: "Returns", q: "When will I get my refund?", a: "UPI and wallets: 2–4 business days. Cards and net banking: 5–7 business days after the returned item passes quality check." },
  { cat: "Account", q: "I forgot my password. What do I do?", a: "Click Forgot password on the sign-in page and we will email you a reset link." },
  { cat: "Products", q: "Are your toys safe?", a: "Yes. Every product is checked for non-toxic materials and age-appropriate design, and meets Indian toy safety standards." },
];

export interface BlogPost { slug: string; title: string; excerpt: string; cover: string; date: string; read: string; tag: string; body: string[] }

export const posts: BlogPost[] = [
  {
    slug: "screen-free-activities-for-toddlers", title: "10 Screen-Free Activities for Toddlers", tag: "Activities", date: "28 Sep 2026", read: "5 min",
    cover: img("1560421683-6856ea585c78", 800, 500),
    excerpt: "Simple, low-prep ideas to keep little hands busy and minds growing — no screens needed.",
    body: ["Toddlers learn best through their hands. A tray of dried pasta and a few cups can turn into twenty minutes of focused scooping and pouring.", "Try sticker lines: draw straight and wavy lines on paper and ask your child to place stickers along them. It builds fine motor control for future writing.", "Stacking rings, chunky puzzles and building blocks are classics for a reason — they teach size, colour and cause-and-effect.", "Finally, read together every day. Even five minutes with a picture book builds vocabulary and a lifelong love of stories."],
  },
  {
    slug: "choosing-age-appropriate-toys", title: "How to Choose Age-Appropriate Toys", tag: "Parenting", date: "15 Sep 2026", read: "4 min",
    cover: img("1587654780291-39c9404d746b", 800, 500),
    excerpt: "A quick guide to picking toys that challenge without frustrating — from babies to pre-teens.",
    body: ["0–2 years: look for big, chunky, washable toys with bright colours and textures. Avoid small parts entirely.", "3–5 years: pretend play takes off. Kitchen sets, dolls, simple puzzles and art kits encourage imagination and language.", "6–8 years: kids enjoy rules and challenges — board games, building sets and science kits are great picks.", "9–12 years: support their interests with hobby kits, books and outdoor gear that build independence."],
  },
  {
    slug: "building-a-reading-habit", title: "Building a Reading Habit at Home", tag: "Learning", date: "2 Sep 2026", read: "6 min",
    cover: img("1509266272358-7701da638078", 800, 500),
    excerpt: "Small routines that turn reluctant readers into bookworms.",
    body: ["Make books visible. A low shelf or basket in the living room invites kids to browse on their own.", "Let them choose. Children read more when they pick the story — even if it's the same dinosaur book for the tenth time.", "Read aloud past the age they can read alone. Hearing fluent reading builds comprehension and keeps reading cosy.", "Celebrate progress with a simple reading chart and a trip to pick a new book."],
  },
  {
    slug: "diy-festive-crafts", title: "Easy DIY Festive Crafts for Kids", tag: "Crafts", date: "20 Aug 2026", read: "5 min",
    cover: img("1513364776144-60967b0f800f", 800, 500),
    excerpt: "Paper lanterns, painted diyas and handmade cards the whole family can make.",
    body: ["Paper lanterns need just coloured paper, scissors and glue. Fold, cut slits and roll — kids love hanging them up.", "Painted clay diyas are a lovely keepsake. Use non-toxic acrylic paints and let them dry overnight.", "Handmade cards with stickers, glitter and drawings make grandparents' day.", "Lay down newspaper, keep wet wipes nearby and enjoy the mess!"],
  },
  {
    slug: "outdoor-play-benefits", title: "Why Outdoor Play Matters", tag: "Health", date: "8 Aug 2026", read: "3 min",
    cover: img("1532330393533-443990a51d10", 800, 500),
    excerpt: "Fresh air, big movements and free play — the benefits go far beyond burning energy.",
    body: ["Outdoor play builds gross motor skills: running, jumping and throwing strengthen muscles and coordination.", "Unstructured play outside boosts creativity and problem-solving as kids invent their own games.", "Sunlight helps regulate sleep, and nature exposure is linked to calmer moods.", "Aim for at least an hour a day — a ball and an open space is all you need."],
  },
  {
    slug: "montessori-at-home", title: "Montessori Principles You Can Use at Home", tag: "Learning", date: "25 Jul 2026", read: "6 min",
    cover: img("1629583908828-2cb711a77327", 800, 500),
    excerpt: "Child-sized spaces, real tasks and independence — no special school required.",
    body: ["Set up a low shelf with a few toys at a time and rotate them weekly to keep interest high.", "Invite children into real tasks: pouring water, wiping tables, sorting laundry by colour.", "Choose open-ended materials like wooden blocks and stacking toys that can be used in many ways.", "Observe before helping. Giving kids time to struggle a little builds confidence and concentration."],
  },
];
