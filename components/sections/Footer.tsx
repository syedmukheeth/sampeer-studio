"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { FOOTER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { Reveal } from "@/components/ui/Reveal";
import { MaskText } from "@/components/ui/MaskText";
import { EASE, DUR, STAGGER, VIEWPORT } from "@/lib/constants";

/** §09 Footer. The page signs off in its own voice: the brand line arrives
 *  with the hero's mask-reveal, the closing rule draws itself, and the round
 *  mark resolves from grayscale — the "noise -> signal" arc, one last time.
 *  No version stamps, no locale strips. */
export function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="border-t border-line py-16 md:py-20">
      <Shell>
        {/* the last word, in display type — same treatment as the first */}
        <p className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          <MaskText text={FOOTER.line} />
        </p>

        <div className="mt-14 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <Reveal delay={STAGGER.base}>
            <div className="group relative h-20 w-20 overflow-hidden rounded-full border border-line transition-colors duration-500 hover:border-accent/40 md:h-24 md:w-24">
              <Image
                src="/logo.png"
                alt={FOOTER.brand}
                fill
                sizes="96px"
                style={{ objectPosition: "52% 41%" }}
                className="scale-[2.2] object-cover transition-transform duration-700 ease-out group-hover:scale-[2.35]"
              />
            </div>
          </Reveal>

          <Reveal delay={STAGGER.loose} className="flex flex-col gap-3 md:items-end">
            <a
              href={`mailto:${FOOTER.email}`}
              className="font-sans text-sm text-ink transition-colors hover:text-accent"
            >
              {FOOTER.email}
            </a>
            <div className="flex gap-5">
              {FOOTER.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-sans text-sm text-muted transition-colors hover:text-ink"
                >
                  {s.label}
                  <span
                    aria-hidden
                    className="ml-1 inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* closing rule draws itself in — the page's final gesture */}
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: reduce ? 0 : DUR.slow, ease: EASE.inOut }}
          className="mt-12 block h-px origin-left bg-line"
        />
        <Reveal delay={STAGGER.base} className="pt-6 font-sans text-xs text-faint">
          {FOOTER.year} {FOOTER.brand}. {FOOTER.rights}
        </Reveal>
      </Shell>
    </footer>
  );
}
