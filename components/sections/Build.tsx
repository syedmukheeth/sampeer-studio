import Image from "next/image";
import { PILLARS } from "@/lib/content";
import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";

/** §03 What We Build. Three pillars as outcomes.
 *  CSS sticky stack: each opaque panel pins at the top and is replaced by the
 *  next. The incoming panel's content reveals in (visible, on top), so the
 *  motion actually reads. No GSAP here — avoids mixing GSAP with Motion and
 *  the occluded-scrub bug where the shrinking panel was hidden behind the next.
 *  Storytelling: three pillars stack into one engine. */
export function Build() {
  return (
    <section id="build" className="px-6">
      <div className="mx-auto max-w-[1400px]">
        {PILLARS.map((p) => (
          <article
            key={p.id}
            className="sticky top-0 grid min-h-dvh grid-cols-1 items-center gap-10 bg-canvas py-20 md:grid-cols-12 md:gap-16"
          >
            <Reveal className="md:col-span-7">
              <p className="font-sans text-sm text-muted">{p.title}</p>
              <h3 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
                {p.outcome}
              </h3>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted">
                {p.body}
              </p>
            </Reveal>

            <div className="md:col-span-5">
              <TiltCard className="relative aspect-[4/5] overflow-hidden rounded-md border border-line">
                <Image
                  src={p.image}
                  alt={`${p.title} visual`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </TiltCard>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
