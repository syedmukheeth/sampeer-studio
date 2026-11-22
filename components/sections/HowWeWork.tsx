import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { FadeIn } from "@/components/ui/FadeIn";
import { Marked } from "@/components/ui/Marked";
import { STAGGER } from "@/lib/constants";

/* How it goes, as the guide's numbered steps: a big orange numeral, then the
   word, then one plain sentence. A hairline runs over the four steps and the
   orange draws along it as the reader scrolls it in (`.rule-scrub`, finished
   at once where the browser cannot scrub or the reader prefers no motion).
   The fourth step is the one most studios leave out: staying. The chapter
   ends on the next step, not on a dead end. */
export function HowWeWork() {
  return (
    <section id="process" className="relative bg-canvas">
      <Shell>
        <div className="rounded-3xl border border-line bg-elevated px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <p className="label">{PROCESS_HEADER.lead}</p>
          <h2 className="mt-4 font-serif text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] font-normal text-ink">
            <Marked text={PROCESS_HEADER.title} />
          </h2>

          <ol className="relative mt-12 grid gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-8">
            {/* the line: a hairline, and the orange drawing over it (desktop) */}
            <span aria-hidden className="absolute top-0 right-0 left-0 hidden h-px bg-line md:block" />
            <span aria-hidden className="rule-scrub absolute top-0 right-0 left-0 hidden h-px bg-accent md:block" />

            {PROCESS.map((step, i) => (
              <FadeIn as="li" key={step.id} delay={i * STAGGER.base} className="relative md:pt-7">
                <span
                  aria-hidden
                  className="block font-sans text-5xl leading-none font-semibold tracking-tight text-accent-text tabular-nums md:text-6xl"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-serif text-2xl leading-tight font-normal text-ink md:text-[1.75rem]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[34ch] font-sans text-[15px] leading-relaxed text-muted">{step.body}</p>
              </FadeIn>
            ))}
          </ol>

          <div className="mt-12 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-base leading-relaxed text-muted md:text-lg">{PROCESS_HEADER.sub}</p>
            <a
              href={PROCESS_HEADER.cta.href}
              className="btn-press inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-accent-solid px-6 font-sans text-[15px] font-semibold whitespace-nowrap text-accent-ink hover:bg-accent-dim sm:self-auto"
            >
              {PROCESS_HEADER.cta.label}
              <ArrowUpRight size={16} weight="bold" aria-hidden />
            </a>
          </div>
        </div>
      </Shell>
    </section>
  );
}
