import { clsx } from "clsx";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { PROOF, REVIEWS, STATS } from "@/lib/content";
import { CountUp } from "@/components/ui/CountUp";
import { FadeIn } from "@/components/ui/FadeIn";
import { Shell } from "@/components/ui/Shell";
import { STAGGER } from "@/lib/constants";

/* The proof strip, the hard change of ground under the marquee: the fear
   spikes right after a promise, so the evidence sits there. Real numbers, then
   the real clients by name (no logo wall of borrowed marks), then how many of
   them say so on camera. */
export function Stats() {
  const onCamera = REVIEWS.length;

  return (
    <section id="proof" aria-label="At a glance" className="border-y border-line bg-canvas">
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

      <div className="border-t border-line">
        <Shell className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8">
          <p className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <span className="font-mono text-xs text-faint">{PROOF.trustedBy}</span>
            {PROOF.clients.map((c) => (
              <span
                key={c}
                className="font-display text-lg font-semibold tracking-[-0.015em] text-ink font-stretch-semi-expanded md:text-xl"
              >
                {c}
              </span>
            ))}
          </p>
          {onCamera > 0 ? (
            <a
              href={PROOF.watch.href}
              className="link-wipe inline-flex shrink-0 items-center gap-2 self-start py-1 font-sans text-sm font-medium text-accent-text md:self-auto"
            >
              {PROOF.onCamera.replace("{n}", String(onCamera))} · {PROOF.watch.label}
              <ArrowDown size={14} weight="bold" aria-hidden />
            </a>
          ) : null}
        </Shell>
      </div>
    </section>
  );
}
