import { PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

export function Process() {
  return (
    <Section id="process">
      <SectionHeader eyebrow={PROCESS_HEADER.eyebrow} title={PROCESS_HEADER.title} rule />
      <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
        {PROCESS.map((s, i) => (
          <FadeIn as="li" key={s.id} delay={i * STAGGER.loose}>
            <span className="font-display text-5xl font-semibold tabular-nums text-accent/25">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink">{s.title}</h3>
            <p className="mt-3 max-w-sm font-sans text-base leading-relaxed text-muted">{s.body}</p>
          </FadeIn>
        ))}
      </ol>
    </Section>
  );
}
