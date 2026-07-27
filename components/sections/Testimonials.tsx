"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIALS, TESTIMONIALS_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { EASE, DUR } from "@/lib/constants";

/** §05.5 Founder voices. One full-measure editorial pull-quote at a time; the
 *  words crossfade as the speaker changes. The speaker row below doubles as a
 *  quiet progress rail, the active name carries the single indigo strike.
 *  Auto-advances on a calm cadence; pauses to nothing under reduced-motion.
 *  Deliberately NOT a split grid: Build and About already own that skeleton,
 *  so this one reads as a full-width editorial beat between them. */
export function Testimonials() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || TESTIMONIALS.length <= 1) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % TESTIMONIALS.length),
      6500,
    );
    return () => clearInterval(id);
  }, [reduce]);

  const t = TESTIMONIALS[active];

  return (
    <Section id="testimonials">
      <SectionHeader title={TESTIMONIALS_HEADER.title} />

      <div className="mt-10 md:mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={t.id}
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: DUR.base, ease: EASE.out }}
            className="grid gap-8 md:grid-cols-12 md:items-center"
          >
            {t.photo && (
              /* A left rail rather than a cropped hero image. The photo keeps
                 its own aspect ratio and is never cropped or blown up: the
                 rail is capped, the image sits at its natural ratio inside the
                 padded card, and the card's paper/hairline/accent-tab language
                 is the same one Section and the work cards already speak. */
              <aside className="md:col-span-4 md:self-start">
                <figure className="relative mx-auto w-full max-w-[20rem] rounded-xl border border-line bg-elevated p-2 shadow-lg md:mx-0">
                  {/* the single accent strike this section allows itself, the
                      same rail motif as the speaker underline below */}
                  <span
                    aria-hidden
                    className="absolute left-2 top-0 h-px w-10 -translate-y-px bg-accent"
                  />
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={1600}
                    height={1200}
                    sizes="(max-width: 768px) 20rem, 25vw"
                    className="h-auto w-full rounded-lg"
                  />
                  <figcaption className="px-1 pb-1 pt-3 font-sans text-[11px] uppercase tracking-[0.18em] text-faint">
                    On site with {t.name}
                  </figcaption>
                </figure>
              </aside>
            )}
            <blockquote className={t.photo ? "md:col-span-8" : "md:col-span-12"}>
              {/* neon open-quote mark */}
              <span
                aria-hidden
                className="-ml-1 block font-display text-6xl leading-none text-gradient-accent md:text-7xl"
              >
                &ldquo;
              </span>
              <p className="-mt-3 font-display text-xl font-medium leading-relaxed tracking-tight text-ink sm:text-2xl md:text-3xl">
                {t.quote}&rdquo;
              </p>
              <footer className="mt-6 font-sans text-sm not-italic">
                <span className="block font-semibold text-ink md:text-base">{t.name}</span>
                <span className="mt-0.5 block text-xs text-muted md:text-sm">{t.role}</span>
              </footer>
            </blockquote>
          </motion.div>
        </AnimatePresence>

        {/* speaker rail, only when there's more than one voice to switch */}
        {TESTIMONIALS.length > 1 && (
          <ul className="mt-12 flex flex-row flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
            {TESTIMONIALS.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className="group relative block text-left"
                    aria-current={on}
                  >
                    <span
                      className={`font-display text-base font-medium tracking-tight transition-colors md:text-lg ${
                        on ? "text-ink" : "text-faint group-hover:text-muted"
                      }`}
                    >
                      {item.name}
                    </span>
                    {/* active underline draws in */}
                    <motion.span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent"
                      initial={false}
                      animate={{ scaleX: on ? 1 : 0 }}
                      transition={{ duration: DUR.fast, ease: EASE.out }}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Section>
  );
}
