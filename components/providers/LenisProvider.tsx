"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll. Mandatory motion #1 in the SAMPeer plan.
 * Honors prefers-reduced-motion by skipping smoothing entirely.
 * Exposes the Lenis instance on window for later GSAP ScrollTrigger sync (Phase 3).
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    const lenis = new Lenis({
      // 1.1 left the page gliding for over a second after the wheel stopped,
      // which reads as lag rather than smoothness and fought the tightened
      // reveal timings. 0.9 keeps the smoothing without the float.
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // expose for Phase 3 GSAP integration
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // This is the loop that keeps the page from ever going idle, so it must not
    // survive a tab switch. rAF is usually throttled in a background tab, but
    // not reliably, and nothing can be scrolling there anyway.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId) {
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return <>{children}</>;
}
