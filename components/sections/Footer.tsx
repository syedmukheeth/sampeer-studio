"use client";

import { motion, useReducedMotion } from "motion/react";
import { FOOTER } from "@/lib/content";
import { LogoLockup } from "@/components/ui/LogoLockup";
import { Shell } from "@/components/ui/Shell";
import { Reveal } from "@/components/ui/Reveal";
import { MaskText } from "@/components/ui/MaskText";
import { EASE, DUR, STAGGER, VIEWPORT } from "@/lib/constants";

/** §09 Footer. The page signs off in its own voice: the brand line arrives
 *  with the hero's mask-reveal, the closing rule draws itself, and the round
 *  mark resolves from grayscale, the "noise -> signal" arc, one last time.
 *  No version stamps, no locale strips. */
export function Footer() {
  const reduce = useReducedMotion();

  return (
    <footer className="border-t border-line py-16 md:py-20">
      <Shell>
        {/* the last word, in display type, same treatment as the first */}
        <p className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
          <MaskText text={FOOTER.line} />
        </p>

        <div className="mt-14 flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <Reveal delay={STAGGER.base}>
            <LogoLockup />
          </Reveal>

          <Reveal delay={STAGGER.loose} className="flex flex-col gap-3 md:items-end">
            <a
              href={`mailto:${FOOTER.email}`}
              // the email is the primary conversion path off this page and was
              // a 180x20 target; padded to clear the 24px minimum
              className="-my-1.5 py-1.5 font-sans text-sm text-ink transition-colors hover:text-accent-text"
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
                  className="link-shine group -my-1.5 py-1.5 font-sans text-sm text-muted transition-colors hover:text-ink"
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

        {/* closing rule draws itself in, the page's final gesture */}
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
