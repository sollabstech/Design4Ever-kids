import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { img } from "@/lib/catalog";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "About Us" };

const values = [
  { emoji: "🛡️", title: "Safety First", text: "Every toy is checked for non-toxic materials, smooth edges and clear age guidance.", bg: "bg-[#e8f5e9]" },
  { emoji: "🧠", title: "Learning Through Play", text: "We pick products that build motor skills, language, creativity and curiosity.", bg: "bg-[#f3e5f5]" },
  { emoji: "🌱", title: "Kind to the Planet", text: "Wooden toys, recyclable packaging and fewer plastics wherever we can.", bg: "bg-[#fffde7]" },
  { emoji: "❤️", title: "Parent Approved", text: "Our range is shaped by reviews and feedback from thousands of Indian families.", bg: "bg-[#fce4ec]" },
];

const stats = [
  { n: "50,000+", l: "Happy families" },
  { n: "19,000+", l: "Pincodes served" },
  { n: "4.8★", l: "Average rating" },
  { n: "7-day", l: "Easy returns" },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title="About Us" emoji="🌈" subtitle="A colourful corner of the internet for curious, creative kids." crumbs={[{ label: "About Us" }]} />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
            <Image src={img("1587654780291-39c9404d746b", 900, 680)} alt="Colourful wooden blocks" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
          </div>
          <div>
            <span className="text-xs font-bold text-[#e91e8c] bg-[#fce4ec] px-3 py-1 rounded-full">Our Story</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1a1a2e] mt-3">Made by parents, for little dreamers.</h2>
            <div className="space-y-3 text-gray-600 mt-4 leading-relaxed">
              <p>Design4EverKids started at a kitchen table in Chennai, when two parents struggled to find toys that were safe, beautiful and genuinely educational — without the endless plastic.</p>
              <p>Today we hand-pick every toy, book and craft kit in our store, test it with real kids, and deliver it to families across India.</p>
              <p>We believe learning is best when it&apos;s hands-on, imaginative and full of joy.</p>
            </div>
            <Link href="/shop" className="inline-block mt-6 bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold px-6 py-3 rounded-full">Explore the Store →</Link>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#e91e8c]">{s.n}</div>
              <div className="text-sm font-semibold text-gray-500 mt-1">{s.l}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-black text-[#1a1a2e] text-center mb-6">What we stand for ✨</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((v) => (
              <div key={v.title} className={`${v.bg} rounded-2xl p-6`}>
                <div className="text-4xl mb-3">{v.emoji}</div>
                <h3 className="font-black text-[#1a1a2e]">{v.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{v.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#e91e8c] rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-black">Have an idea or want to partner with us?</h2>
          <p className="opacity-90 mt-1">We&apos;d love to hear from parents, teachers and toy makers.</p>
          <div className="flex justify-center gap-3 mt-5 flex-wrap">
            <Link href="/contact" className="bg-white text-[#e91e8c] font-black px-6 py-3 rounded-full">Contact Us</Link>
            <Link href="/sell-with-us" className="border-2 border-white text-white font-black px-6 py-3 rounded-full hover:bg-white/10">Sell With Us</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
