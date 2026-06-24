"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { PILLARS } from "@/lib/content";
import { TiltCard } from "@/components/ui/TiltCard";

gsap.registerPlugin(ScrollTrigger);

/** §03 What We Build. Real sticky-stack: each pillar pins via CSS sticky,
 *  GSAP scrubs the outgoing panel's scale/opacity as the next arrives.
 *  Storytelling: three pillars stack into one engine. */
export function Build() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    const lenis = window.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".pillar");
      panels.forEach((panel, i) => {
        if (i === panels.length - 1) return;
        gsap.to(panel, {
          scale: 0.94,
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: panels[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, root);

    return () => {
      lenis?.off("scroll", ScrollTrigger.update);
      ctx.revert();
    };
  }, [reduce]);

  return (
    <section id="build" ref={root} className="px-6">
      <div className="mx-auto max-w-[1400px]">
        {PILLARS.map((p) => (
          <article
            key={p.id}
            className="pillar sticky top-0 grid min-h-dvh grid-cols-1 items-center gap-10 bg-canvas py-20 md:grid-cols-12 md:gap-16"
          >
            <div className="md:col-span-7">
              <p className="font-sans text-sm text-muted">{p.title}</p>
              <h3 className="mt-4 max-w-2xl font-display text-3xl font-semibold leading-[1.05] tracking-tight md:text-5xl">
                {p.outcome}
              </h3>
              <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-muted">
                {p.body}
              </p>
            </div>

            <div className="md:col-span-5">
              <TiltCard className="relative aspect-[4/5] overflow-hidden rounded-md border border-line">
                <Image
                  src={p.image}
                  alt={`${p.title} visual`}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </TiltCard>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
