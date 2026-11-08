import { clsx } from "clsx";
import { PROOF, STATS } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { Shell } from "@/components/ui/Shell";
import { STAGGER } from "@/lib/constants";

/* The trust bar, the first thing on paper once the night folds away: the fear
   spikes right after a promise, so the evidence sits there. One half names the
   real clients (no logo wall of borrowed marks), the other carries the real
   numbers. */
export function Stats() {
  return (
    <section id="proof" aria-label="At a glance" className="bg-canvas">
      <Shell className="grid gap-12 pt-20 pb-6 md:pt-28 md:pb-10 lg:grid-cols-12 lg:gap-12">
        <FadeIn className="lg:col-span-5">
          <p className="font-mono text-xs tracking-[0.06em] text-faint uppercase">{PROOF.trustedBy}</p>
          <ul className="mt-6 border-t border-line">
            {PROOF.clients.map((c) => (
              <li
                key={c}
                className="flex items-center gap-3 border-b border-line py-4 font-display text-2xl font-[560] tracking-[-0.03em] text-ink md:text-3xl"
              >
                <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {c}
              </li>
            ))}
          </ul>
        </FadeIn>

        <dl className="grid grid-cols-2 self-end lg:col-span-7">
          {STATS.map((s, i) => (
            <FadeIn
              key={s.label}
              delay={i * STAGGER.base}
              className={clsx(
                "flex flex-col-reverse justify-end border-line py-7 md:py-9",
                i % 2 === 1 ? "border-l pl-6 md:pl-10" : "pr-6 md:pr-10",
                i >= 2 && "border-t",
              )}
            >
              <dt className="mt-3 font-mono text-xs text-faint">{s.label}</dt>
              <dd>
                <CountUp
                  value={s.value}
                  text={s.text}
                  suffix={s.suffix}
                  decimals={s.decimals}
                  className={clsx(
                    "block font-display font-[600] tracking-[-0.045em] text-ink tabular-nums",
                    s.text ? "text-3xl sm:text-4xl md:text-5xl" : "text-5xl sm:text-6xl md:text-7xl",
                  )}
                />
              </dd>
            </FadeIn>
          ))}
        </dl>
      </Shell>
    </section>
  );
}
