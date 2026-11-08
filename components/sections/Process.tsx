import { PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

/* After the work and the case study, process is an explanation, not a
   promise. Three verbs on one line that draws itself as the reader scrolls
   (`.rule-scrub`, scroll-driven CSS). The verbs are the labels; no step
   numbers. On phones the line turns vertical. */
export function Process() {
  return (
    <Section id="process">
      <SectionHeader title={PROCESS_HEADER.title} />

      <ol className="relative mt-14 grid gap-12 pl-10 md:grid-cols-3 md:gap-8 md:pt-12 md:pl-0">
        <span aria-hidden className="rule-scrub absolute inset-x-0 top-3 hidden h-px bg-line md:block" />
        <span
          aria-hidden
          className="rule-scrub rule-scrub--vertical absolute top-2 bottom-2 left-3 w-px bg-line md:hidden"
        />

        {PROCESS.map((s, i) => (
          <FadeIn as="li" key={s.id} delay={i * STAGGER.loose} className="relative">
            {/* the node where this step meets the line */}
            <span
              aria-hidden
              className="absolute top-1 -left-10 grid h-6 w-6 place-items-center rounded-full border border-accent bg-canvas md:-top-12 md:left-0"
            >
              <span className="h-2 w-2 rounded-full bg-accent" />
            </span>
            <h3 className="font-display text-2xl font-[650] tracking-[-0.02em] text-ink font-stretch-semi-expanded md:text-3xl">
              {s.title}
            </h3>
            <p className="mt-3 max-w-sm font-sans text-base leading-relaxed text-muted">{s.body}</p>
          </FadeIn>
        ))}
      </ol>
    </Section>
  );
}
