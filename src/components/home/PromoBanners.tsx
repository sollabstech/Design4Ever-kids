import Link from "next/link";
import Image from "next/image";

export default function PromoBanners() {
  return (
    <section className="py-6 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Left Banner — Special Offers */}
          <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 220 }}>
            {/* Real photo */}
            <Image
              src="https://images.unsplash.com/photo-1677138164023-10b6b0aa9250?w=800&h=440&fit=crop&auto=format&q=85"
              alt="Special Offers for Little Learners"
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            {/* Pink gradient overlay — stronger on left for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#f9a8d4]/95 via-[#f472b6]/80 to-[#ec4899]/30" />

            {/* Decorative stars */}
            <span className="absolute top-4 right-32 text-yellow-400 text-2xl select-none z-10 drop-shadow">★</span>
            <span className="absolute bottom-6 right-20 text-yellow-300 text-base select-none z-10 opacity-80 drop-shadow">✦</span>
            <span className="absolute top-8 left-44 text-yellow-300 text-sm select-none z-10 opacity-60">✦</span>

            {/* Text content */}
            <div className="relative z-10 flex items-center h-full px-6 sm:px-8 py-8">
              <div className="max-w-[55%]">
                <h3 className="text-xl sm:text-2xl font-black text-[#9d174d] leading-tight mb-2 drop-shadow-sm">
                  Special Offers<br />
                  for Little Learners!
                </h3>
                <p className="text-sm text-[#831843] font-semibold mb-5">
                  Up to 50% off on selected toys &amp; books
                </p>
                <Link
                  href="/offers"
                  className="inline-flex items-center gap-1.5 bg-[#e91e8c] hover:bg-[#c2187a] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-md"
                >
                  Shop Offers <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Banner — Build Bright Minds */}
          <div className="relative rounded-2xl overflow-hidden" style={{ minHeight: 220 }}>
            {/* Real photo */}
            <Image
              src="https://images.unsplash.com/photo-1759147893749-7c92a92cd9d1?w=800&h=440&fit=crop&auto=format&q=85"
              alt="Build Bright Minds Through Play"
              fill
              className="object-cover object-center"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
            {/* Blue gradient overlay — stronger on left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#bae6fd]/95 via-[#7dd3fc]/80 to-[#38bdf8]/30" />

            {/* Decorative */}
            <span className="absolute top-4 right-16 text-2xl select-none z-10 opacity-70">💡</span>
            <span className="absolute bottom-5 left-8 text-yellow-300 text-sm select-none z-10 opacity-50">✦</span>

            {/* Text content */}
            <div className="relative z-10 flex items-center h-full px-6 sm:px-8 py-8">
              <div className="max-w-[55%]">
                <h3 className="text-xl sm:text-2xl font-black text-[#0c4a6e] leading-tight mb-2 drop-shadow-sm">
                  Build Bright Minds<br />
                  Through Play
                </h3>
                <p className="text-sm text-[#075985] font-semibold mb-5">
                  Educational toys for every stage
                </p>
                <Link
                  href="/categories/educational"
                  className="inline-flex items-center gap-1.5 bg-[#0288d1] hover:bg-[#0277bd] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-md"
                >
                  Explore Now <span>→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
