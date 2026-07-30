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
  const single = TESTIMONIALS.length <= 1;

  return (
    <Section id="testimonials">
      <SectionHeader title={TESTIMONIALS_HEADER.title} rule />

      <div className="mt-14 md:mt-20">
        {/* neon open-quote, the one accent strike here */}
        <span
          aria-hidden
          className="block font-display text-7xl leading-none text-gradient-accent md:text-8xl"
        >
          &ldquo;
        </span>

        {/* The min-height reserve that used to sit here was measured for a
            text-only quote at full page width. The quote is a 7-of-12 column
            beside a photo now, so those values no longer describe anything: on
            desktop 4.5em was shorter than the photo and did nothing, and on
            mobile 10em forced blank space under a short quote. Height comes
            from the content. If more testimonials are added and rotation starts
            resizing the block, reserve against the PHOTO column, which is what
            dominates the height here. */}
        <div className="relative -mt-4">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t.id}
              initial={single || reduce ? false : { opacity: 0, y: 18 }}
              animate={single ? undefined : { opacity: 1, y: 0 }}
              exit={single || reduce ? undefined : { opacity: 0, y: -18 }}
              transition={{ duration: DUR.base, ease: EASE.out }}
              className="not-italic"
            >
              <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-14">
                <div className="md:col-span-7">
                  <p className="font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl md:text-4xl">
                    {t.quote}
                  </p>
                  <footer className="mt-8 font-sans text-sm">
                    <span className="block text-ink">{t.name}</span>
                    <span className="mt-0.5 block text-muted">{t.role}</span>
                  </footer>
                </div>

                {/* ASRG proof photos stay static and eager so the Clients
                    section is already composed when it scrolls into view. */}
                {t.photo && (
                  <div className="md:col-span-5">
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(112px,0.42fr)] md:grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(132px,0.42fr)]">
                      <figure className="relative aspect-4/3 w-full overflow-hidden rounded-md border border-line bg-elevated shadow-sm">
                        <Image
                          src={t.photo}
                          alt={`${t.name} with the SAMPeer Studio team`}
                          fill
                          sizes="(min-width: 768px) 40vw, 100vw"
                          className="object-cover"
                          loading="eager"
                        />
                      </figure>

                      {/* Second ASRG proof shot, same visit. It sits beside the
                          three-person frame instead of animating in as an
                          overlay, so both photos are visible the moment the
                          Clients section is reached. */}
                      {t.photoSecondary && (
                        <figure className="relative aspect-4/5 w-full overflow-hidden rounded-md border border-line bg-elevated shadow-sm">
                          <Image
                            src={t.photoSecondary}
                            alt={`${t.name} closing the deal with SAMPeer Studio`}
                            fill
                            sizes="(min-width: 1024px) 14vw, (min-width: 640px) 24vw, 100vw"
                            className="object-cover"
                            loading="eager"
                          />
                        </figure>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.blockquote>
          </AnimatePresence>
        </div>

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
