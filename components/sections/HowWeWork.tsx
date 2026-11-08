import { CHAPTERS, PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { ChapterRule } from "@/components/ui/ChapterRule";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

/* 05 / How we work. The title holds still on the left while the three steps
   pass on the right, and an ink line draws down the steps with the scrollbar
   (`.rule-scrub--vertical`, a CSS scroll timeline: it reverses on the way
   back, and browsers without it, or reduced motion, show the finished line). */
export function HowWeWork() {
  return (
    <section id="process" className="relative bg-canvas py-24 md:py-36">
      <Shell>
        <ChapterRule chapter={CHAPTERS.process} />

        <div className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] font-[600] tracking-[-0.05em] text-ink">
                {PROCESS_HEADER.title}
              </h2>
              <p className="mt-6 max-w-[36ch] font-sans text-lg leading-relaxed text-muted">{PROCESS_HEADER.sub}</p>
            </div>
          </div>

          <ol className="relative lg:col-span-7">
            <span aria-hidden className="absolute top-2 bottom-2 left-[1.375rem] w-px bg-line" />
            <span
              aria-hidden
              className="rule-scrub rule-scrub--vertical absolute top-2 bottom-2 left-[1.375rem] w-px bg-ink"
            />
            {PROCESS.map((step, i) => (
              <FadeIn
                as="li"
                key={step.id}
                delay={i * STAGGER.base}
                className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-6 pb-16 last:pb-0 md:gap-8 md:pb-24"
              >
                <span className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-canvas font-mono text-xs text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1.5">
                  <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-[600] tracking-[-0.045em] text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-[44ch] font-sans text-lg leading-relaxed text-muted">{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </ol>
        </div>
      </Shell>
    </section>
  );
}
