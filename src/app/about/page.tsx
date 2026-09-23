import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Design4Ever",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
      <h1 className="font-heading text-4xl sm:text-5xl font-bold text-grape text-center mb-8">
        About Us 🌈
      </h1>
      <div className="bg-sky/10 rounded-3xl p-8 sm:p-10 space-y-4 text-lg text-foreground/80">
        <p>
          Design4Ever is a colorful corner of the internet made for curious,
          creative kids! We believe learning is best when it&apos;s fun,
          hands-on, and full of imagination.
        </p>
        <p>
          Our activities, stories, and games are designed to spark curiosity
          and bring a little extra joy to every day.
        </p>
        <p>
          This page is a placeholder for now &mdash; more details about our
          story and mission are coming soon!
        </p>
      </div>
    </div>
  );
}
