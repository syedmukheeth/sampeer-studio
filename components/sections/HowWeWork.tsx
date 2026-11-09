import { PROCESS, PROCESS_HEADER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

/* How we work, in one screen: the title and the one promise, then four short
   steps in a row (a list on phones), each opened by an ink hairline and its
   number. The fourth step is the one most studios leave out: staying. */
export function HowWeWork() {
  return (
    <section id="process" className="relative bg-canvas py-20 md:py-28">
      <Shell>
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-12">
          <h2 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1] font-[600] tracking-[-0.05em] text-ink lg:col-span-7">
            {PROCESS_HEADER.title}
          </h2>
          <p className="max-w-[40ch] font-sans text-lg leading-relaxed text-muted lg:col-span-5 lg:justify-self-end">
            {PROCESS_HEADER.sub} <span className="text-ink">{PROCESS_HEADER.promise}</span>
          </p>
        </div>

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <FadeIn as="li" key={step.id} delay={i * STAGGER.base} className="border-t border-ink pt-5">
              <span className="font-mono text-xs text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-[clamp(1.6rem,2.4vw,2rem)] leading-[1.05] font-[600] tracking-[-0.04em] text-ink">
                {step.title}
              </h3>
              <p className="mt-3 max-w-[36ch] font-sans text-base leading-relaxed text-muted">{step.body}</p>
            </FadeIn>
          ))}
        </ol>
      </Shell>
    </section>
  );
}
