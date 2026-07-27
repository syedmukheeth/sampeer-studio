"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ABOUT, ABOUT_CTO, BRAND_MEANING, TEAM } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Parallax } from "@/components/ui/Parallax";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { EASE, DUR, STAGGER } from "@/lib/constants";

/** One founder: portrait one side, manifesto the other. The portrait is
 *  unveiled bottom-up by a canvas-coloured cover as it enters — the founder
 *  arrives the way the sites do, not as a static plate.
 *
 *  `flip` alternates which side the photo sits on, so the second block reads as
 *  a counterpart rather than the same layout printed twice. */
function FounderBlock({
  name,
  photo,
  manifesto,
  flip = false,
  photoPosition = "center top",
}: {
  name: string;
  photo: string;
  manifesto: readonly string[];
  flip?: boolean;
  photoPosition?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-16">
      <div className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
        <div className="group relative aspect-[4/5] overflow-hidden rounded-md border border-line">
          <Parallax amount={36} className="absolute inset-0">
            <Image
              src={photo}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="scale-125 object-cover"
              style={{ objectPosition: photoPosition }}
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

      <div className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>
        <div className="space-y-5">
          {manifesto.map((line, i) => (
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
      </div>
    </div>
  );
}

/** §07 About. Both founders get the full treatment — portrait and manifesto —
 *  then the pair of cards names who owns what, then the brand meaning. */
export function About() {
  return (
    <Section id="about">
      <FounderBlock name={ABOUT.name} photo={ABOUT.photo} manifesto={ABOUT.manifesto} />

      {/* the CTO, photo on the opposite side */}
      <div className="mt-24 md:mt-32">
        <FounderBlock
          name={ABOUT_CTO.name}
          photo={ABOUT_CTO.photo}
          manifesto={ABOUT_CTO.manifesto}
          photoPosition={ABOUT_CTO.photoPosition}
          flip
        />
      </div>

      <div className="mt-20 md:mt-24">
        <div>
          {/* the two of us side by side. Each card carries what that person
              actually owns — a name and a title alone says there are two
              people, not what either of them does */}
          <div className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {TEAM.map((member, i) => (
              <Reveal key={member.id} delay={i * STAGGER.base}>
                <div className="relative h-full overflow-hidden rounded-lg border border-line bg-elevated p-5">
                  {/* the beams are offset so the two cards do not pulse in
                      lockstep, which reads as a loading state */}
                  <BorderBeam duration={7} delay={i * 3.5} />
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-line">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        style={{ objectPosition: member.photoPosition || "center 15%" }}
                      />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-base font-semibold leading-tight">{member.name}</div>
                      <div className="font-sans text-sm text-muted">{member.role}</div>
                    </div>
                  </div>

                  <p className="mt-4 font-sans text-sm leading-relaxed text-muted">{member.line}</p>

                  {member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-shine mt-3 inline-flex items-center gap-1 font-sans text-xs text-accent-text transition-colors hover:text-ink"
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
