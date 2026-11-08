import { clsx } from "clsx";
import { STATS } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { STAGGER } from "@/lib/constants";

export function Stats() {
  return (
    <section id="stats" aria-label="At a glance" className="mt-20 border-y border-line md:mt-28">
      <div className="mx-auto grid max-w-(--max-shell) grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeIn
            key={s.label}
            delay={i * STAGGER.base}
            className={clsx(
              "px-6 py-10 md:px-10 md:py-14",
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
                "block font-display font-semibold tracking-tight tabular-nums text-ink",
                s.text ? "text-2xl sm:text-3xl md:text-4xl" : "text-4xl sm:text-5xl md:text-6xl",
              )}
            />
            <div className="mt-3 font-sans text-sm text-muted">{s.label}</div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
