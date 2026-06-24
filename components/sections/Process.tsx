import { PROCESS } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/** §06 How It Works. Vertical timeline. Verb-noun labels, no "Stage 1". */
export function Process() {
  return (
    <section id="process" className="px-6 py-32 md:py-40">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
          How we work.
        </h2>

        <ol className="mt-16 border-l border-line">
          {PROCESS.map((step, i) => (
            <Reveal
              key={step.id}
              as="li"
              delay={i * 0.1}
              className="relative pb-14 pl-10 last:pb-0"
            >
              <span
                aria-hidden
                className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent"
              />
              <h3 className="font-display text-2xl font-medium tracking-tight md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 max-w-lg font-sans text-base leading-relaxed text-muted">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
