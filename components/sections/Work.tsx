"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { WORK, WORK_HEADER, type LiveProject } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LiveSiteFrame } from "@/components/ui/LiveSiteFrame";
import { track, EVENTS } from "@/lib/analytics";

/** §04 Real Work — vertical sticky-stack. Each project is a full-width
 *  exhibit that pins below the nav while the next one slides over it; the
 *  covered card recedes (scale + canvas veil) so depth reads without any
 *  scroll hijack. Pure CSS sticky + motion/react useScroll — no GSAP, no pin.
 *  Mobile and reduced-motion: plain stacked cards, zero transforms. */
export function Work() {
  return (
    <Section id="work" shell={false}>
      <Shell className="mb-14">
        <SectionHeader eyebrow={WORK_HEADER.eyebrow} title={WORK_HEADER.title} />
      </Shell>

      <Shell>
        <div className="flex flex-col gap-10 md:block">
          {WORK.map((w, i) => (
            <StackCard key={w.id} project={w} index={i} last={i === WORK.length - 1} />
          ))}
        </div>
      </Shell>
    </Section>
  );
}

function StackCard({
  project: w,
  index,
  last,
}: {
  project: LiveProject;
  index: number;
  last: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 at the moment the card pins, 1 when its travel is spent and the next
  // card has fully covered it. Drives the recede of THIS card only.
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.955]);
  const veil = useTransform(scrollYProgress, [0, 1], [0, 0.6]);

  // A project with a case study opens it (internal); everything else jumps
  // straight to the live site (external).
  const study = !!w.caseStudy;
  const href = w.caseStudy ?? w.url;

  return (
    <div ref={wrap} className={last ? "md:pb-4" : "md:h-[120vh]"}>
      <motion.div
        style={reduce ? undefined : { scale }}
        className="origin-top md:sticky md:top-24"
      >
        <a
          href={href}
          target={study ? undefined : "_blank"}
          rel={study ? undefined : "noopener noreferrer"}
          onClick={() => track(EVENTS.workVisitSite, { client: w.client })}
          className="group relative block overflow-hidden rounded-md border border-line bg-elevated transition-colors duration-500 hover:border-accent/40 hover:bg-elevated-2"
        >
          <div className="grid gap-0 md:grid-cols-12">
            {/* exhibit — poster at rest, live site on hover */}
            <div className="relative aspect-16/10 overflow-hidden md:col-span-8 md:border-r md:border-line">
              <LiveSiteFrame
                url={w.url}
                title={`${w.client}, live site`}
                poster={w.poster}
              />
              {/* indigo veil at rest, lifts on hover — plain tint, no blend
                  mode: mix-blend on six poster-sized layers taxes the
                  compositor every frame of the sticky-stack scroll */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-accent/8 transition-opacity duration-700 group-hover:opacity-0"
              />
            </div>

            {/* meta */}
            <div className="flex flex-col justify-between gap-8 p-6 md:col-span-4 md:p-8">
              <div>
                <span className="font-sans text-xs tabular-nums text-faint">
                  {String(index + 1).padStart(2, "0")} / {String(WORK.length).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                  {w.client}
                </h3>
                <p className="mt-2 font-sans text-xs text-muted">{w.industry}</p>
                <p className="mt-5 font-sans text-sm leading-relaxed text-muted">
                  {w.description}
                </p>

                {/* real on-site proof — a photo stack, not a stock badge */}
                {w.proof && (
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex">
                      {w.proof.photos.map((src, pi) => (
                        <span
                          key={src}
                          className={`relative h-10 w-8 overflow-hidden rounded-sm border border-line bg-elevated ${
                            pi > 0 ? "-ml-2.5" : ""
                          }`}
                          style={{ zIndex: w.proof!.photos.length - pi }}
                        >
                          <Image
                            src={src}
                            alt=""
                            fill
                            sizes="32px"
                            className="object-cover"
                          />
                        </span>
                      ))}
                    </div>
                    <span className="font-sans text-xs leading-tight text-muted">
                      {w.proof.label}
                    </span>
                  </div>
                )}
              </div>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-muted transition-colors group-hover:text-ink">
                {study ? "Read the case study" : "Visit live site"}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  {study ? "→" : "↗"}
                </span>
              </span>
            </div>
          </div>

          {/* recede veil — darkens this card as the next one slides over it */}
          {!reduce && (
            <motion.div
              aria-hidden
              style={{ opacity: veil }}
              className="pointer-events-none absolute inset-0 hidden bg-canvas md:block"
            />
          )}
        </a>
      </motion.div>
    </div>
  );
}
