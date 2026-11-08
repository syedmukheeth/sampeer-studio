import { clsx } from "clsx";
import { STATS } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

/* The proof strip, directly under the claim: the fear spikes right after a
   promise, so the evidence sits there, not in a band at the bottom. Real
   numbers only. */
export function Stats() {
  return (
    <section id="proof" aria-label="At a glance" className="border-y border-line">
      <div className="mx-auto grid max-w-(--max-shell) grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeIn
            key={s.label}
            delay={i * STAGGER.base}
            className={clsx(
              "px-6 py-9 md:px-10 md:py-12",
              i % 2 === 1 && "border-l border-line",
              i >= 2 && "border-t border-line md:border-t-0",
              i === 2 && "md:border-l",
            )}
          >
            <CountUp
              value={s.value}
              text={s.text}
              suffix={s.suffix}
              decimals={s.decimals}
              className={clsx(
                "block font-display font-[650] tracking-[-0.03em] text-ink tabular-nums font-stretch-semi-expanded",
                s.text ? "text-2xl sm:text-3xl md:text-4xl" : "text-4xl sm:text-5xl md:text-6xl",
              )}
            />
            <div className="mt-3 font-mono text-xs text-faint">{s.label}</div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
