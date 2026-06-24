"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { WORK } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

/** §04 Real Work. Desktop + motion: vertical scroll drives a horizontal pan
 *  (GSAP pin + translate). Mobile / reduced-motion: native scroll-snap.
 *  Captions sit below images, never on them. */
export function Work() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !wrap.current || !track.current) return;
    if (window.innerWidth < 768) return; // mobile keeps native scroll

    const lenis = window.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      const distance = track.current!.scrollWidth - window.innerWidth + 80;
      gsap.to(track.current, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top top",
          end: () => `+=${distance}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrap);

    // images can finish loading after setup; recompute pin distance then
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      lenis?.off("scroll", ScrollTrigger.update);
      ctx.revert();
    };
  }, [reduce]);

  return (
    <section id="work" className="py-24 md:py-32">
      <div className="mx-auto mb-14 max-w-[1400px] px-6 md:px-10">
        <p className="font-sans text-sm uppercase tracking-[0.18em] text-muted">
          Real work
        </p>
        <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
          Ten startups we made impossible to ignore.
        </h2>
      </div>

      <div ref={wrap} className="relative md:overflow-hidden">
        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 md:snap-none md:overflow-visible md:px-10"
        >
          {WORK.map((w) => (
            <figure
              key={w.id}
              className={`snap-start shrink-0 ${
                w.featured ? "w-[85vw] md:w-[720px]" : "w-[75vw] md:w-[420px]"
              }`}
            >
              <div className="relative aspect-[7/5] overflow-hidden rounded-md border border-line">
                <Image
                  src={w.image}
                  alt={`${w.client}, ${w.category}`}
                  fill
                  sizes="(max-width: 768px) 85vw, 720px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg font-medium">{w.client}</span>
                  <span className="font-sans text-xs text-faint">{w.category}</span>
                </div>
                <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-muted">
                  {w.outcome}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
