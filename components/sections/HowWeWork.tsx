import { PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { FadeIn } from "@/components/ui/FadeIn";
import { Marked } from "@/components/ui/Marked";
import { STAGGER } from "@/lib/constants";

/* How it goes, in one line. Four words on a hairline that the gold draws
   along as the reader scrolls it in (`.rule-scrub`, finished at once where the
   browser cannot scrub or the reader prefers no motion), a dot at each stop
   and one plain sentence under each. The fourth stop is the one most studios
   leave out: staying. The promise closes it. */
export function HowWeWork() {
  return (
    <section id="process" className="relative bg-canvas">
      <Shell>
        <div className="rounded-3xl border border-line bg-elevated px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <p className="font-sans text-sm text-faint">{PROCESS_HEADER.lead}</p>
          <h2 className="mt-3 font-serif text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.04] font-normal text-ink">
            <Marked text={PROCESS_HEADER.title} />
          </h2>

          <ol className="relative mt-12 grid gap-y-10 md:mt-14 md:grid-cols-4 md:gap-x-8">
            {/* the line: a hairline, and the gold drawing over it (desktop) */}
            <span aria-hidden className="absolute top-[5px] right-0 left-0 hidden h-px bg-line md:block" />
            <span aria-hidden className="rule-scrub absolute top-[5px] right-0 left-0 hidden h-px bg-accent md:block" />
            {/* phones: the same line, running down */}
            <span aria-hidden className="absolute top-2 bottom-2 left-[5px] w-px bg-line md:hidden" />

            {PROCESS.map((step, i) => (
              <FadeIn as="li" key={step.id} delay={i * STAGGER.base} className="relative pl-8 md:pl-0">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 h-[11px] w-[11px] rounded-full border-2 border-elevated bg-accent ring-1 ring-ink/25"
                />
                <h3 className="font-serif text-2xl leading-tight font-normal text-ink md:mt-7 md:text-[1.75rem]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[34ch] font-sans text-[15px] leading-relaxed text-muted">{step.body}</p>
              </FadeIn>
            ))}
          </ol>

          <p className="mt-12 border-t border-line pt-6 font-sans text-base leading-relaxed text-muted md:text-lg">
            {PROCESS_HEADER.sub} <span className="text-ink">{PROCESS_HEADER.promise}</span>
          </p>
        </div>
      </Shell>
    </section>
  );
}
