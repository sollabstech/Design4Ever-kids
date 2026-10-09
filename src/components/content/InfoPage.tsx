import Link from "next/link";
import { PageHeader } from "@/components/ui";

export interface InfoSection { title: string; body?: string[]; bullets?: string[] }

/** Shared layout for policy and help pages. */
export default function InfoPage({ title, emoji, subtitle, updated, sections, children }: {
  title: string; emoji?: string; subtitle?: string; updated?: string; sections: InfoSection[]; children?: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <PageHeader title={title} emoji={emoji} subtitle={subtitle} crumbs={[{ label: title }]} />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <article className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-7">
          {updated && <p className="text-xs text-gray-400 font-semibold">Last updated: {updated}</p>}
          {sections.map((s, i) => (
            <section key={i} id={`s${i + 1}`} className="scroll-mt-32">
              <h2 className="text-lg font-black text-[#1a1a2e] mb-2">{s.title}</h2>
              {s.body?.map((p, j) => <p key={j} className="text-sm text-gray-600 leading-relaxed mb-2">{p}</p>)}
              {s.bullets && (
                <ul className="space-y-1.5 mt-2">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#e91e8c] mt-0.5">●</span><span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          {children}
        </article>
        <aside className="space-y-4 lg:sticky lg:top-32">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-black text-[#1a1a2e] text-sm mb-3">On this page</h3>
            <ol className="space-y-2">
              {sections.map((s, i) => (
                <li key={i}><a href={`#s${i + 1}`} className="text-sm text-gray-500 hover:text-[#e91e8c]">{i + 1}. {s.title}</a></li>
              ))}
            </ol>
          </div>
          <div className="bg-[#fff0f7] rounded-2xl p-5">
            <div className="text-2xl mb-1">💬</div>
            <h3 className="font-black text-[#1a1a2e] text-sm">Still have questions?</h3>
            <p className="text-xs text-gray-500 mt-1 mb-3">Our support team replies within 24 hours, Mon–Sat.</p>
            <Link href="/contact" className="inline-block bg-[#e91e8c] text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-[#c2187a]">Contact Us</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
