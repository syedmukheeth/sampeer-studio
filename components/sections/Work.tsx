"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { WORK } from "@/lib/content";
import { Shell } from "@/components/ui/Shell";
import { SectionHeader } from "@/components/ui/Section";

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
      // exact horizontal overflow of the track (accounts for padding/gap)
      const distance = track.current!.scrollWidth - track.current!.clientWidth;
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
    <section id="work" className="relative py-28 md:py-40">
      <Shell className="mb-14">
        <SectionHeader
          eyebrow="Real work"
          title="Ten startups we made impossible to ignore."
        />
      </Shell>

      <div ref={wrap} className="relative md:overflow-hidden md:pt-20">
        <div
          ref={track}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 md:snap-none md:overflow-visible md:px-10"
        >
          {WORK.map((w) => (
            <figure
              key={w.id}
              className={`group snap-start shrink-0 ${
                w.featured ? "w-[85vw] md:w-[720px]" : "w-[75vw] md:w-[420px]"
              }`}
            >
              <div className="relative aspect-[7/5] overflow-hidden rounded-md border border-line">
                <Image
                  src={w.image}
                  alt={`${w.client}, ${w.category}`}
                  fill
                  sizes="(max-width: 768px) 85vw, 720px"
                  className="object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
                />
                {/* indigo veil at rest, lifts on hover — one cohesive brand tone */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-accent/10 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-0"
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
