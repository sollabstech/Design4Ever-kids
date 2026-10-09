// Feature badges shown on the product detail page, chosen by material.

type FeatureIcon = { path: string; fill?: boolean };
type Feature = { icon: FeatureIcon; label: string; bg: string; iconColor: string };

const ICONS = {
  leaf:    { fill: false, path: "M12 2C9 5 6 9 6 13a6 6 0 0012 0C18 9 15 5 12 2z M12 2v10" },
  bulb:    { fill: false, path: "M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  hand:    { fill: false, path: "M7 11.5V5.5a1.5 1.5 0 013 0v6m0-5a1.5 1.5 0 013 0v5m0-3.5a1.5 1.5 0 013 0V17a5 5 0 01-5 5H8l-3-3 1.5-1.5L8 20h1V11.5" },
  shield:  { fill: false, path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  star:    { fill: false, path: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  wash:    { fill: false, path: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
  heart:   { fill: true,  path: "M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" },
  book:    { fill: false, path: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  sparkle: { fill: false, path: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" },
  bounce:  { fill: false, path: "M9 11l3 3L22 4M7 19H5a2 2 0 01-2-2v-5m0 0V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2h-2" },
};

export function FeatureSVG({ icon, className = "w-6 h-6" }: { icon: FeatureIcon; className?: string }) {
  return (
    <svg className={className} fill={icon.fill ? "white" : "none"} stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={icon.path} fill={icon.fill ? "white" : "none"} />
    </svg>
  );
}

export function getFeatures(material: string): Feature[] {
  const m = material.toLowerCase();
  if (m.includes("wood") || m.includes("plywood") || m.includes("rubberwood") || m.includes("pinewood")) {
    return [
      { icon: ICONS.leaf,   label: "Safe &\nNon-Toxic",       bg: "bg-[#e8f5e9]", iconColor: "bg-[#4caf50]" },
      { icon: ICONS.bulb,   label: "Boosts\nThinking Skills", bg: "bg-[#f3e5f5]", iconColor: "bg-[#9c27b0]" },
      { icon: ICONS.hand,   label: "Improves\nMotor Skills",  bg: "bg-[#fce4ec]", iconColor: "bg-[#e91e8c]" },
      { icon: ICONS.shield, label: "Durable &\nLong Lasting", bg: "bg-[#fffde7]", iconColor: "bg-[#f9a825]" },
    ];
  }
  if (m.includes("plush") || m.includes("polyester")) {
    return [
      { icon: ICONS.heart,   label: "Ultra\nSoft Plush",    bg: "bg-[#fce4ec]", iconColor: "bg-[#e91e8c]" },
      { icon: ICONS.shield,  label: "Safe for\nAll Ages",   bg: "bg-[#e8f5e9]", iconColor: "bg-[#4caf50]" },
      { icon: ICONS.wash,    label: "Machine\nWashable",    bg: "bg-[#e3f2fd]", iconColor: "bg-[#1e88e5]" },
      { icon: ICONS.sparkle, label: "Perfect\nCompanion",   bg: "bg-[#f3e5f5]", iconColor: "bg-[#9c27b0]" },
    ];
  }
  if (m.includes("paper") || m.includes("cardboard") || m.includes("hardcover")) {
    return [
      { icon: ICONS.book,    label: "Educational\nValue",        bg: "bg-[#e8f5e9]", iconColor: "bg-[#4caf50]" },
      { icon: ICONS.sparkle, label: "Vibrant\nIllustrations",    bg: "bg-[#fce4ec]", iconColor: "bg-[#e91e8c]" },
      { icon: ICONS.hand,    label: "Develops\nWriting Skills",  bg: "bg-[#f3e5f5]", iconColor: "bg-[#9c27b0]" },
      { icon: ICONS.star,    label: "School-Ready\nLearning",    bg: "bg-[#fffde7]", iconColor: "bg-[#f9a825]" },
    ];
  }
  if (m.includes("rubber")) {
    return [
      { icon: ICONS.leaf,   label: "Eco-Friendly\nRubber", bg: "bg-[#e8f5e9]", iconColor: "bg-[#4caf50]" },
      { icon: ICONS.shield, label: "Super\nDurable",       bg: "bg-[#fffde7]", iconColor: "bg-[#f9a825]" },
      { icon: ICONS.bounce, label: "Active\nPlay",         bg: "bg-[#fce4ec]", iconColor: "bg-[#e91e8c]" },
      { icon: ICONS.star,   label: "Safe\nMaterials",      bg: "bg-[#e3f2fd]", iconColor: "bg-[#1e88e5]" },
    ];
  }
  return [
    { icon: ICONS.leaf,    label: "Safe &\nNon-Toxic",  bg: "bg-[#e8f5e9]", iconColor: "bg-[#4caf50]" },
    { icon: ICONS.bulb,    label: "Boosts\nCreativity", bg: "bg-[#f3e5f5]", iconColor: "bg-[#9c27b0]" },
    { icon: ICONS.sparkle, label: "Hours\nof Fun",      bg: "bg-[#fffde7]", iconColor: "bg-[#f9a825]" },
    { icon: ICONS.shield,  label: "Durable\n& Safe",    bg: "bg-[#fce4ec]", iconColor: "bg-[#e91e8c]" },
  ];
}
