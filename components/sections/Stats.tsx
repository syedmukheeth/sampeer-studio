import { STATS, STATS_EYEBROW } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { Reveal } from "@/components/ui/Reveal";
import { STAGGER } from "@/lib/constants";

/** §05 Proof numbers. LinkedIn-led: the audience is the asset. No cards,
 *  hairline dividers, big display numerals. Count up as they enter view. */
export function Stats() {
  return (
    <section id="stats" className="border-y border-line">
      <p className="mx-auto max-w-[1400px] px-6 pt-12 font-sans text-xs font-medium uppercase tracking-[0.22em] text-faint md:px-10">
        <span aria-hidden className="mr-2.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
        {STATS_EYEBROW}
      </p>
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * STAGGER.base}
            className={`px-6 py-12 md:px-10 md:py-16 ${
              i % 2 !== 0 ? "border-l border-line" : ""
            } ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${
              i % 4 !== 0 ? "md:border-l" : ""
            }`}
          >
            <CountUp
              value={s.value}
              suffix={s.suffix}
              decimals={s.decimals}
              className="block font-display text-5xl font-semibold tracking-tight tabular-nums md:text-7xl"
            />
            <div className="mt-3 font-sans text-sm text-muted">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
