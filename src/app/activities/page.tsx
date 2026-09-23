import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activities | Design4Ever",
};

const activities = [
  { emoji: "🎨", title: "Color & Draw", desc: "Printable coloring sheets and drawing prompts." },
  { emoji: "📖", title: "Story Corner", desc: "Short illustrated stories for young readers." },
  { emoji: "🧩", title: "Puzzles", desc: "Word puzzles, mazes, and logic games." },
  { emoji: "🎵", title: "Songs & Rhymes", desc: "Fun nursery rhymes and sing-along songs." },
  { emoji: "🔬", title: "Mini Science", desc: "Simple experiments you can do at home." },
  { emoji: "🍪", title: "Kid Chef", desc: "Easy no-bake recipes kids can make with help." },
];

export default function ActivitiesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1 className="font-heading text-4xl sm:text-5xl font-bold text-grape text-center mb-4">
        Activities 🎉
      </h1>
      <p className="text-center text-lg text-foreground/70 mb-12">
        Pick something that looks fun and dive in!
      </p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {activities.map((a) => (
          <div
            key={a.title}
            className="bg-white border-2 border-black/5 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center"
          >
            <div className="text-5xl mb-3">{a.emoji}</div>
            <h2 className="font-heading text-xl font-semibold mb-1">{a.title}</h2>
            <p className="text-foreground/70 text-sm">{a.desc}</p>
            <button className="mt-4 text-sm font-heading px-5 py-2 rounded-full bg-coral/10 text-coral hover:bg-coral hover:text-white transition-colors">
              Coming Soon
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
