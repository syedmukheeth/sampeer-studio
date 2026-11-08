import { HERO } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { MaskText } from "@/components/ui/MaskText";
import { PosterMarquee } from "@/components/ui/PosterMarquee";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

export function Hero() {
  return (
    <section id="hero" className="overflow-hidden pt-32 md:pt-44">
      <Shell>
        <p className="flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.18em] text-faint">
          <span aria-hidden className="relative flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/60 motion-reduce:hidden" />
            <span className="relative h-2 w-2 rounded-full bg-accent" />
          </span>
          {HERO.eyebrow}
        </p>

        <h1 className="mt-6 font-display text-[clamp(2.9rem,8.5vw,7rem)] font-semibold leading-[1.0] tracking-tight text-ink">
          {HERO.lines.map((line, i) => (
            <MaskText key={line} text={line} mode="mount" delay={0.1 + i * 0.12} />
          ))}
          <MaskText text={HERO.accent} mode="mount" delay={0.1 + HERO.lines.length * 0.12} className="text-accent-text" />
        </h1>

        <p className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted md:text-lg">{HERO.sub}</p>

        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
          <TrackClick event={EVENTS.ctaClickHero}>
            <a
              href={HERO.ctaPrimary.href}
              className="btn-press inline-flex items-center rounded-md bg-accent-solid px-6 py-3 font-sans text-sm font-medium text-accent-ink transition-colors hover:bg-accent-dim"
            >
              {HERO.ctaPrimary.label}
            </a>
          </TrackClick>
          <a
            href={HERO.cta.href}
            className="border-b border-ink/20 py-1 font-sans text-sm font-medium text-ink transition-colors hover:border-accent"
          >
            {HERO.cta.label} ↓
          </a>
        </div>
      </Shell>

      <div className="mt-16 md:mt-24">
        <PosterMarquee />
      </div>
    </section>
  );
}
