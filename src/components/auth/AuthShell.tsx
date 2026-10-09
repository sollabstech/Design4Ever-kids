import Image from "next/image";
import Link from "next/link";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-[#fce4ec] via-[#fdf6fb] to-[#e0f4fb] min-h-[calc(100vh-140px)] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-pink-100 overflow-hidden grid md:grid-cols-2">
        {/* Illustration side */}
        <div className="hidden md:flex relative bg-[#e91e8c] p-10 flex-col justify-between text-white overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -left-10 bottom-10 w-40 h-40 rounded-full bg-white/10" />
          <Link href="/" className="relative bg-white rounded-2xl px-4 py-2 self-start">
            <Image src="/logo.png" alt="Design4EverKids" width={150} height={50} className="h-10 w-auto object-contain" />
          </Link>
          <div className="relative">
            <div className="text-6xl mb-4">🧸🎨📚</div>
            <h2 className="text-3xl font-black leading-tight">Where little minds<br />grow big dreams.</h2>
            <p className="text-sm opacity-90 mt-3 max-w-xs">Track orders, save your favourites and check out faster with your Design4Ever account.</p>
          </div>
          <div className="relative grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="bg-white/15 rounded-xl py-2">🚚<br />Free Shipping ₹499+</div>
            <div className="bg-white/15 rounded-xl py-2">🔄<br />7-Day Returns</div>
            <div className="bg-white/15 rounded-xl py-2">🛡️<br />Safe Toys</div>
          </div>
        </div>

        {/* Form side */}
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a1a2e]">{title}</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
