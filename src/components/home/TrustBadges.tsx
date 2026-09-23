const badges = [
  {
    icon: (
      <div className="w-10 h-10 bg-[#e8f5e9] rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-[#4caf50]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      </div>
    ),
    title: "Curated & Safe Products",
    desc: "Only the best for your child",
  },
  {
    icon: (
      <div className="w-10 h-10 bg-[#e3f2fd] rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-[#1976d2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      </div>
    ),
    title: "Fast & Reliable Delivery",
    desc: "Across India",
  },
  {
    icon: (
      <div className="w-10 h-10 bg-[#fffde7] rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-[#f9a825]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
    ),
    title: "Trusted Marketplace",
    desc: "Verified vendors",
  },
  {
    icon: (
      <div className="w-10 h-10 bg-[#f3e5f5] rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-[#9c27b0]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    ),
    title: "Support Small Businesses",
    desc: "Shop with purpose",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-6 bg-white border-t border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((b) => (
            <div key={b.title} className="flex items-center gap-3">
              <div className="flex-shrink-0">{b.icon}</div>
              <div>
                <p className="text-sm font-bold text-[#1a1a2e] leading-tight">{b.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
