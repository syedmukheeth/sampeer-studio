"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { WORK, WORK_HEADER } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { Section, SectionHeader } from "@/components/ui/Section";
import { LiveSiteFrame } from "@/components/ui/LiveSiteFrame";
import { track, EVENTS } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

/** §04 Real Work. Desktop + motion: vertical scroll drives a horizontal pan
 *  (GSAP pin + translate), instrumented by a hairline progress rail and a
 *  live 01/06 counter driven straight from the ScrollTrigger — no React
 *  state at 60fps. Mobile / reduced-motion: native scroll-snap, rail hidden.
 *  Each card is a live scaled iframe of the client's site; their hero
 *  animation is the exhibit. Captions sit below frames, never on them. */
export function Work() {
  const wrap = useRef<HTMLDivElement>(null);
  const track_ = useRef<HTMLDivElement>(null);
  const railFill = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track_.current) return;
    if (window.innerWidth < 768) return; // mobile keeps native scroll

    const lenis = window.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      // exact horizontal overflow of the track (accounts for padding/gap)
      const distance = track_.current!.scrollWidth - track_.current!.clientWidth;
      const setFill = railFill.current
        ? gsap.quickSetter(railFill.current, "scaleX")
        : null;
      const total = WORK.length;

      gsap.to(track_.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setFill?.(self.progress);
            if (counter.current) {
              const n = Math.min(total, Math.floor(self.progress * total) + 1);
              counter.current.textContent = String(n).padStart(2, "0");
            }
          },
        },
      });
    }, wrap);

    // frames can finish loading after setup; recompute pin distance then
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      lenis?.off("scroll", ScrollTrigger.update);
      ctx.revert();
    };
  }, [reduce]);

  return (
    <Section id="work" shell={false}>
      <Shell className="mb-10">
        <SectionHeader eyebrow={WORK_HEADER.eyebrow} title={WORK_HEADER.title} />
      </Shell>

      <div ref={wrap} className="relative md:overflow-hidden md:pt-10">
        <div
          ref={track_}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 md:snap-none md:overflow-visible md:px-10"
        >
          {WORK.map((w) => (
            <a
              key={w.id}
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track(EVENTS.workVisitSite, { client: w.client })}
              className="group block shrink-0 snap-start w-[85vw] md:w-160"
            >
              {/* No grayscale filter here, unlike the page's imagery convention:
                  filtering six continuously animating cross-origin layers is
                  expensive, and a gray "live" site reads as broken. Cohesion
                  comes from the indigo veil + accent border instead. */}
              <div className="relative aspect-16/10 overflow-hidden rounded-md border border-line transition-colors duration-700 group-hover:border-accent/40">
                <LiveSiteFrame url={w.url} title={`${w.client}, live site`} />
                {/* indigo veil at rest, lifts on hover — one cohesive brand tone */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-accent/10 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-0"
                />
              </div>
              <div className="mt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg font-medium">{w.client}</span>
                  <span className="font-sans text-xs text-faint">{w.industry}</span>
                </div>
                <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-muted">
                  {w.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 font-sans text-xs text-faint transition-colors group-hover:text-ink">
                  Visit live site
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* progress rail + counter — visible only while the desktop pin runs.
            Driven imperatively from the ScrollTrigger above. */}
        <div
          aria-hidden
          className="mx-auto mt-2 hidden max-w-(--max-shell) items-center gap-6 px-6 md:flex md:px-10"
        >
          <span className="relative h-px flex-1 bg-line">
            <span
              ref={railFill}
              className="absolute inset-0 origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </span>
          <span className="font-sans text-xs tabular-nums text-faint">
            <span ref={counter}>01</span> / {String(WORK.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </Section>
  );
}
