"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Parallax } from "@/components/ui/Parallax";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/** §07 About Syed. Asymmetric split. Manifesto, not bio. The portrait is
 *  unveiled bottom-up by a canvas-colored cover as it enters — the founder
 *  arrives the way the sites do, not as a static plate. */
export function About() {
  const reduce = useReducedMotion();

  return (
    <Section id="about">
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line">
            <Parallax amount={36} className="absolute inset-0">
              <Image
                src={ABOUT.photo}
                alt={ABOUT.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="scale-125 object-cover"
              />
            </Parallax>
            {/* unveil cover — scales away upward once, then never returns */}
            <motion.span
              aria-hidden
              initial={reduce ? false : { scaleY: 1 }}
              whileInView={{ scaleY: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: reduce ? 0 : DUR.slow, ease: EASE.inOut }}
              className="pointer-events-none absolute inset-0 origin-top bg-canvas"
            />
          </div>
        </div>

        <div className="md:col-span-7">
          <div className="space-y-5">
            {ABOUT.manifesto.map((line, i) => (
              <Reveal
                key={i}
                as="p"
                delay={i * STAGGER.base}
                className="font-display text-2xl font-medium leading-snug tracking-tight md:text-3xl"
              >
                {line}
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div>
              <div className="font-display text-base font-semibold">{ABOUT.name}</div>
              <div className="font-sans text-sm text-muted">{ABOUT.role}</div>
            </div>
            <a
              href={ABOUT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 font-sans text-sm text-ink transition-colors hover:text-accent-text"
            >
              LinkedIn
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
