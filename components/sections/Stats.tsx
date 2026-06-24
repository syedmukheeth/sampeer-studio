import { STATS } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";

/** §05 Proof numbers. No cards, hairline dividers, big display numerals.
 *  data-count attrs feed the Phase 3 scroll count-up. */
export function Stats() {
  return (
    <section id="stats" className="border-y border-line">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-14 md:px-10 md:py-20 ${
              i % 2 !== 0 ? "border-l border-line" : ""
            } ${i >= 2 ? "border-t border-line md:border-t-0" : ""} ${
              i % 4 !== 0 ? "md:border-l" : ""
            }`}
          >
            <CountUp
              value={s.value}
              suffix={s.suffix}
              className="block font-display text-5xl font-semibold tracking-tight tabular-nums md:text-7xl"
            />
            <div className="mt-3 font-sans text-sm text-muted">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
