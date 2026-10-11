import Image from "next/image";

// Demo background photo — replace with your own image (e.g. put a file in
// /public and set this to "/auth-bg.jpg").
export const AUTH_BG = "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1920&h=1200&fit=crop&auto=format&q=80";

/** Full-bleed background image with the auth card on the right (centred on mobile). */
export default function AuthShell({ title, subtitle, children, background = AUTH_BG }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  background?: string;
}) {
  return (
    <div className="relative min-h-[calc(100vh-140px)] bg-[#dbeefc] overflow-hidden">
      <Image src={background} alt="" fill priority className="object-cover" sizes="100vw" />
      {/* Soft light-blue wash so the card stays readable over any photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#dbeefc]/10 via-[#dbeefc]/30 to-[#dbeefc]/80" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-8 py-10 sm:py-14 flex justify-center lg:justify-end">
        <div className="w-full max-w-[520px] bg-white rounded-3xl shadow-2xl shadow-[#14215a]/10 px-6 py-8 sm:px-12 sm:py-11">
          <h1 className="text-3xl sm:text-[40px] leading-tight font-black text-[#14215a] text-center">{title}</h1>
          <p className="text-[15px] sm:text-base text-[#3b4a7a] text-center mt-2 mb-8 max-w-sm mx-auto">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
