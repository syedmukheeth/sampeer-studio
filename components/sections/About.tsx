"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT, BRAND_MEANING, TEAM } from "@/lib/content";
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

          {/* the two of us, not one founder and an implied team */}
          <div className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
            {TEAM.map((member, i) => (
              <Reveal key={member.id} delay={i * STAGGER.base} className="flex items-center gap-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line">
                  <Image src={member.photo} alt={member.name} fill sizes="48px" className="object-cover" />
                </span>
                <div className="min-w-0">
                  <div className="truncate font-display text-base font-semibold">{member.name}</div>
                  <div className="font-sans text-sm text-muted">{member.role}</div>
                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 font-sans text-xs text-accent-text transition-colors hover:text-ink"
                    >
                      LinkedIn
                      <ArrowUpRight size={12} weight="bold" />
                    </a>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* What the name means. It sits under the manifesto because it explains
          the promise the manifesto just made, rather than opening with trivia. */}
      <div className="mt-20 border-t border-line pt-12 md:mt-28">
        <Reveal>
          <p className="flex items-center gap-2.5 font-sans text-xs font-medium uppercase tracking-[0.22em] text-faint">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            {BRAND_MEANING.title}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {BRAND_MEANING.letters.map((l, i) => (
            <Reveal key={l.letter} delay={i * STAGGER.base}>
              <div className="flex items-baseline gap-3">
                <span
                  aria-hidden
                  className="font-display text-4xl font-bold leading-none tracking-tight text-accent-text md:text-5xl"
                >
                  {l.letter}
                </span>
                <span className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                  {l.word}
                </span>
              </div>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted">{l.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={STAGGER.base * 3}>
          <div className="mt-10 border-l-2 border-accent/40 pl-4">
            <span className="font-display text-xl font-semibold tracking-tight md:text-2xl">
              <span className="text-accent-text">{BRAND_MEANING.suffix.word}</span>
            </span>
            <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-muted">
              {BRAND_MEANING.suffix.body}
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
