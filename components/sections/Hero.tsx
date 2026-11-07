import { HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

export function Hero() {
  return (
    <section id="hero" className="pt-36 md:pt-48">
      <Shell>
        <p className="font-sans text-xs font-medium uppercase tracking-[0.18em] text-faint">
          {HERO.eyebrow}
        </p>
        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[1.04] tracking-tight text-ink">
          {HERO.title}
        </h1>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg">
          {HERO.sub}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <TrackClick event={EVENTS.ctaClickHero}>
            <a
              href={HERO.ctaPrimary.href}
              className="inline-flex items-center rounded-md bg-accent-solid px-6 py-3 font-sans text-sm font-medium text-accent-ink transition-colors hover:bg-accent-dim"
            >
              {HERO.ctaPrimary.label}
            </a>
          </TrackClick>
          <a
            href={HERO.cta.href}
            className="border-b border-line py-1 font-sans text-sm font-medium text-ink transition-colors hover:border-accent"
          >
            {HERO.cta.label} ↓
          </a>
        </div>
      </Shell>
    </section>
  );
}
