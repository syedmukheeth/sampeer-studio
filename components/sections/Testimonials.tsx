"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { TESTIMONIALS, TESTIMONIALS_HEADER } from "@/lib/content";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ImageReveal } from "@/components/ui/ImageReveal";
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
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -18 }}
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

                {/* The photo owns its own column instead of sitting in the
                    attribution line as a thumbnail.

                    `object-contain`, not `object-cover`. Cover fills the frame
                    and throws away whatever does not fit, which is what cut
                    people out of this shot at every size it was tried. Contain
                    fits the whole picture inside the frame instead: for this
                    1000x1000 file in a square box the two are identical, but if
                    a client photo of any other shape is added later it will be
                    letterboxed rather than cropped. Losing a little background
                    beats losing a person.

                    The box keeps a fixed aspect so the space is reserved before
                    the image decodes. Intrinsic sizing (`width={0} height={0}`)
                    was tried and collapses the figure to a 2px sliver until the
                    file loads, which is a layout shift on every visit.

                    The frame is 4:3 because the source is: the old file was a
                    1000x1000 crop with the third man cut in half at the right
                    edge, and it has been replaced by the uncropped original
                    (1600x1200). Matching the ratio means contain and cover
                    agree and there is no letterbox either. */}
                {t.photo && (
                  <ImageReveal className="md:col-span-5">
                    <div className="relative">
                      <figure className="relative aspect-4/3 w-full overflow-hidden rounded-md border border-line bg-elevated">
                        <Image
                          src={t.photo}
                          alt={`${t.name} with the SAMPeer Studio team`}
                          fill
                          sizes="(min-width: 768px) 40vw, 100vw"
                          className="object-contain"
                        />
                      </figure>

                      {/* second shot, same visit, inset over the group photo
                          bottom-right so both proof frames read at once.
                          Offset is 0 below md: a negative right-margin here
                          pushed the frame past the viewport edge on mobile
                          (375px screen, 386px scroll width) and caused
                          sitewide horizontal scroll. */}
                      {t.photoSecondary && (
                        <figure className="absolute bottom-2 right-2 aspect-4/3 w-2/5 overflow-hidden rounded-md border-2 border-page bg-elevated shadow-lg md:-bottom-6 md:-right-6">
                          <Image
                            src={t.photoSecondary}
                            alt={`${t.name} closing the deal with SAMPeer Studio`}
                            fill
                            sizes="(min-width: 768px) 16vw, 40vw"
                            className="object-cover"
                          />
                        </figure>
                      )}
                    </div>
                  </ImageReveal>
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
