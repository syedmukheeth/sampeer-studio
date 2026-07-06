"use client";

import { useEffect, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";
import { BrandMark } from "@/components/ui/BrandMark";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { EASE, DUR } from "@/lib/constants";

/** §00 Top nav. One line, <=72px. Brand mark + wordmark, magnetic CTA.
 *  Scroll-spy lights the active link; mobile gets a full-bleed sheet menu so
 *  the links aren't stranded behind a desktop-only breakpoint. */
export function Nav() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  // scroll-spy: mark the link whose section owns the upper viewport
  useEffect(() => {
    const ids = NAV.links.map((l) => l.href.slice(1));
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-canvas/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 md:px-10">
        <a
          href="#hero"
          className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight"
        >
          <BrandMark size={24} />
          {NAV.brand}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.links.map((l) => {
            const on = active === l.href;
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative font-sans text-sm transition-colors ${
                  on ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
                {on && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1.5 left-0 h-px w-full bg-accent"
                    transition={{ duration: DUR.fast, ease: EASE.out }}
                  />
                )}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <TrackClick event={EVENTS.ctaClickNav}>
            <Magnetic>
              <a
                href={NAV.cta.href}
                className="inline-block rounded-md bg-accent px-4 py-2 font-sans text-sm font-medium text-ink transition-transform active:scale-[0.98]"
              >
                {NAV.cta.label}
              </a>
            </Magnetic>
          </TrackClick>

          {/* mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="-mr-1 inline-flex h-9 w-9 items-center justify-center text-ink md:hidden"
          >
            <List size={22} weight="bold" />
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-canvas md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight">
                <BrandMark size={24} />
                {NAV.brand}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center text-ink"
              >
                <X size={22} weight="bold" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-2 px-6 pb-24">
              {NAV.links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DUR.base, delay: 0.05 + i * 0.06, ease: EASE.out }}
                  className="font-display text-4xl font-semibold tracking-tight text-ink"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href={NAV.cta.href}
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex w-fit items-center rounded-md bg-accent px-6 py-3 font-sans text-sm font-medium text-ink"
              >
                {NAV.cta.label}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
