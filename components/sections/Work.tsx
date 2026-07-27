"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { WORK, WORK_HEADER, type LiveProject } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LiveSiteFrame } from "@/components/ui/LiveSiteFrame";
import { ScrollStack, ScrollStackItem } from "@/components/ui/ScrollStack";
import { SplitText } from "@/components/ui/SplitText";
import { track, EVENTS } from "@/lib/analytics";

/** §04 Real Work, a scroll stack. Each project is a full-width exhibit that
 *  pins near the top of the viewport while the next one rises to cover it, the
 *  covered cards shrinking back into a visible deck rather than disappearing:
 *  at any point you can see the pile of work behind the one you are reading.
 *
 *  The whole card is the link, poster at rest, live site on hover, and a click
 *  anywhere on it opens the real thing.
 *
 *  Ordering: the heading writes itself in, then the stack fades up. Reduced
 *  motion gets a plain stack of cards with no transforms at all. */
export function Work() {
  const reduce = useReducedMotion();

  return (
    <Section id="work" shell={false}>
      <Shell className="mb-14">
        <SectionHeader
          eyebrow={WORK_HEADER.eyebrow}
          title={<SplitText text={WORK_HEADER.title} delay={22} />}
        />
      </Shell>

      <Shell>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          // the heading is ~45 characters at 22ms; the stack follows it
          transition={{ duration: 0.7, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* blurAmount 0: a filter recomputed every frame on six poster-sized
              cards shimmers on the edges, which read as part of the shake */}
          <ScrollStack itemDistance={96} itemStackDistance={26} baseScale={0.88} blurAmount={0}>
            {WORK.map((w, i) => (
              <ScrollStackItem key={w.id}>
                <StackCard project={w} index={i} />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </motion.div>
      </Shell>
    </Section>
  );
}

function StackCard({ project: w, index }: { project: LiveProject; index: number }) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-line bg-elevated shadow-[0_10px_36px_rgba(31,41,36,0.07)] transition-colors duration-500 hover:border-accent/40 hover:bg-elevated-2">
      <div className="grid gap-0 md:grid-cols-12">
        {/* exhibit, poster at rest, live site on hover */}
        <div className="relative aspect-16/10 overflow-hidden md:col-span-8 md:border-r md:border-line">
          <LiveSiteFrame url={w.url} title={`${w.client}, live site`} poster={w.poster} />
          {/* accent veil at rest, lifts on hover, plain tint, no blend mode:
              mix-blend on six poster-sized layers taxes the compositor every
              frame of the stack scroll */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-accent/8 transition-opacity duration-700 group-hover:opacity-0"
          />
        </div>

        {/* meta */}
        <div className="flex flex-col gap-6 p-6 md:col-span-4 md:p-8">
          {/* the two destinations sit at the top of the column: at the foot of
              a card this tall they fell below the fold of the pinned card and
              were the first thing the next card covered */}
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
            <span className="link-shine inline-flex items-center gap-1 font-sans text-xs font-medium text-ink transition-colors group-hover:text-accent-text">
              Visit live site
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </span>
            {/* the case study is a second destination, so it sits above the
                stretched link rather than nesting inside it (an <a> in an <a>
                is invalid and the inner one never gets the click) */}
            {w.caseStudy && (
              <Link
                href={w.caseStudy}
                className="link-shine relative z-10 inline-flex items-center gap-1 font-sans text-xs text-accent-text underline-offset-4 hover:underline"
              >
                Read the case study
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>

          <div>
            <span className="font-sans text-xs tabular-nums text-faint">
              {String(index + 1).padStart(2, "0")} / {String(WORK.length).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight text-accent-text md:text-3xl">
              {w.client}
            </h3>
            <p className="mt-2 font-sans text-xs text-muted">{w.industry}</p>
            <p className="mt-5 font-sans text-sm leading-relaxed text-muted">{w.description}</p>

            {/* real on-site proof, a photo stack, not a stock badge */}
            {w.proof && (
              <div className="mt-6 flex items-center gap-3.5">
                <div className="flex">
                  {w.proof.photos.map((src, pi) => (
                    <span
                      key={src}
                      className={`relative h-16 w-14 overflow-hidden rounded-md border border-line bg-elevated shadow-sm ${
                        pi > 0 ? "-ml-3.5" : ""
                      }`}
                      style={{ zIndex: w.proof!.photos.length - pi }}
                    >
                      <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                    </span>
                  ))}
                </div>
                <span className="font-sans text-xs leading-tight text-muted">{w.proof.label}</span>
              </div>
            )}

            {/* client pull-quote, social proof on the card itself */}
            {w.testimonial && (
              <blockquote className="mt-6 border-l-2 border-accent/40 pl-3">
                <p className="font-display text-base leading-snug tracking-tight text-ink">
                  &ldquo;{w.testimonial.quote}&rdquo;
                </p>
                <footer className="mt-2 font-sans text-xs text-muted">- {w.testimonial.author}</footer>
              </blockquote>
            )}
          </div>
        </div>
      </div>

      {/* the whole card is the live site: a stretched link over the lot, under
          the case-study link above it */}
      <a
        href={w.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track(EVENTS.workVisitSite, { client: w.client })}
        className="absolute inset-0 z-0"
      >
        <span className="sr-only">{`Visit ${w.client}'s live site`}</span>
      </a>
    </div>
  );
}
