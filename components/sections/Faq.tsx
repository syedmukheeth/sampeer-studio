import { MagnifyingGlass, Plus } from "@phosphor-icons/react/dist/ssr";
import { FAQ } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { Marked } from "@/components/ui/Marked";

/* The questions a buyer asks before the first call, set the way they would
   type them (a small search glass, the question in the serif), answered in
   the studio's own words. Native <details>, so it opens with Enter, Space or a tap and
   needs no script; the answers are in the markup either way. The same
   questions go out as FAQPage structured data.

   JSON.stringify does not escape `<`, so the payload is escaped by hand: the
   copy is a hardcoded constant today, but the script tag should never be one
   edit away from closing early. */
const JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.items.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
}).replace(/</g, "\\u003c");

export function Faq() {
  return (
    <section id="faq" className="relative bg-canvas py-24 md:py-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON_LD }} />
      <Shell>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="font-serif text-[clamp(2.25rem,4.4vw,3.75rem)] leading-[1.04] font-normal text-ink">
              <Marked text={FAQ.title} />
            </h2>
            <p className="mt-5 max-w-[34ch] font-sans text-base leading-relaxed text-muted md:text-lg">{FAQ.sub}</p>
          </div>

          <div className="border-t border-line lg:col-span-8">
            {FAQ.items.map((item) => (
              <details key={item.q} className="faq group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl leading-snug font-normal text-ink md:py-6 md:text-2xl">
                  <span className="flex items-baseline gap-3">
                    <MagnifyingGlass size={16} weight="bold" aria-hidden className="shrink-0 translate-y-0.5 text-accent-text" />
                    {item.q}
                  </span>
                  <Plus
                    size={18}
                    weight="bold"
                    aria-hidden
                    className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45 group-open:text-ink"
                  />
                </summary>
                <p className="max-w-[62ch] pb-7 pl-7 font-sans text-base leading-relaxed text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
}
