import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Design4Ever",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <h1 className="font-heading text-4xl sm:text-5xl font-bold text-grape text-center mb-4">
        Say Hello! 👋
      </h1>
      <p className="text-center text-lg text-foreground/70 mb-10">
        Have a question, idea, or just want to wave? Send us a message!
      </p>

      <form className="bg-white border-2 border-black/5 rounded-3xl p-8 shadow space-y-5">
        <div>
          <label className="block font-heading text-sm font-semibold mb-1" htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Mia"
            className="w-full border-2 border-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-grape transition-colors"
          />
        </div>
        <div>
          <label className="block font-heading text-sm font-semibold mb-1" htmlFor="email">
            Parent / Guardian Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="example@email.com"
            className="w-full border-2 border-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-grape transition-colors"
          />
        </div>
        <div>
          <label className="block font-heading text-sm font-semibold mb-1" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Type your message here..."
            className="w-full border-2 border-black/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-grape transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full font-heading text-lg py-3 rounded-full bg-grape text-white hover:bg-grape/90 transition-colors shadow-lg shadow-grape/20"
        >
          Send Message 🚀
        </button>
      </form>
    </div>
  );
}
