import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-gradient-to-br from-[#fce4ec] to-[#e0f4fb] min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="text-7xl mb-4">🧸❓</div>
        <h1 className="text-5xl font-black text-[#e91e8c]">404</h1>
        <h2 className="text-2xl font-black text-[#1a1a2e] mt-2">Oops! This page went out to play.</h2>
        <p className="text-gray-500 mt-2">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="flex justify-center gap-3 mt-6 flex-wrap">
          <Link href="/" className="bg-[#e91e8c] hover:bg-[#c2187a] text-white font-bold px-6 py-3 rounded-full">Go Home</Link>
          <Link href="/shop" className="bg-white border-2 border-gray-200 text-[#1a1a2e] font-bold px-6 py-3 rounded-full hover:border-[#e91e8c]">Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
