import { PILLARS } from "@/lib/content";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { PillarGraphic } from "@/components/ui/PillarGraphic";

/** §03 What We Build. Three pillars as outcomes.
 *  CSS sticky stack: each opaque panel pins at the top and is replaced by the
 *  next. The incoming panel's content reveals in (visible, on top), so the
 *  motion actually reads. No GSAP here — avoids mixing GSAP with Motion and
 *  the occluded-scrub bug where the shrinking panel was hidden behind the next.
 *  Each panel's visual is a bespoke PillarGraphic drawn in the site's own
 *  vocabulary — the work is the imagery, not stock photos.
 *  Storytelling: three pillars stack into one engine. */
export function Build() {
  return (
    <section id="build" className="px-6">
      <div className="mx-auto max-w-(--max-shell)">
        {PILLARS.map((p) => (
          <article
            key={p.id}
            className="sticky top-0 grid min-h-dvh grid-cols-1 items-center gap-10 bg-canvas py-20 md:grid-cols-12 md:gap-16"
          >
            <Reveal className="relative md:col-span-7">
              <p className="relative flex items-center gap-3 font-sans text-sm text-muted">
                <span aria-hidden className="font-sans text-xs tabular-nums text-faint">
                  {p.index}
                </span>
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                {p.title}
              </p>
              <h3 className="relative mt-4 max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
                {p.outcome}
              </h3>
              <p className="relative mt-6 max-w-xl font-sans text-base leading-relaxed text-muted">
                {p.body}
              </p>
            </Reveal>

            <div className="md:col-span-5">
              <TiltCard className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line">
                <div className="absolute inset-0">
                  <PillarGraphic variant={p.graphic} />
                </div>
              </TiltCard>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
