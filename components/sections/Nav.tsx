"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { DUR, EASE, SPRING } from "@/lib/constants";

/* N5, the floating pill. Detached from the page edges, frosted, and the one
   persistent piece of chrome. A violet-tinted pill slides under whichever
   section the reader is in.

   Plain <a> for the hash links: from "/" they scroll in place, from any other
   route they load home at that section. */
export function Nav() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Which section the reader is in. A thin band across the middle of the
  // viewport decides it, so the pill moves when a section has actually taken
  // over the screen, not the moment its first pixel appears. Every top-level
  // section is observed, so the pill clears while the hero or the process
  // block is in the band instead of sticking to the last linked one.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 md:top-4">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-[54rem] items-center justify-between gap-3 rounded-full border border-line bg-elevated/75 py-1.5 pr-1.5 pl-2.5 shadow-[0_18px_40px_-24px_var(--shadow-tint)] backdrop-blur-xl backdrop-saturate-150"
      >
        <Link
          href="/"
          aria-label={`${NAV.brand}, home`}
          className="flex shrink-0 items-center gap-2 rounded-full pr-2"
          onClick={() => setOpen(false)}
        >
          <Logo sizes="24px" className="h-8 w-auto" />
          <span className="font-display text-[15px] font-semibold tracking-[-0.01em] text-ink font-stretch-semi-expanded">
            {NAV.brand}
          </span>
        </Link>

        <ul className="hidden items-center md:flex">
          {NAV.links.map((l) => {
            const isActive = active === l.href.split("#")[1];
            return (
              <li key={l.href} className="relative">
                {isActive && (
                  <motion.span
                    aria-hidden
                    layoutId="nav-active"
                    transition={reduce ? { duration: 0 } : SPRING.pill}
                    className="absolute inset-0 rounded-full bg-accent-soft"
                  />
                )}
                <a
                  href={l.href}
                  aria-current={isActive ? "true" : undefined}
                  className={clsx(
                    "relative block rounded-full px-3.5 py-2 font-sans text-sm transition-colors",
                    isActive ? "text-ink" : "text-muted hover:text-ink",
                  )}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <TrackClick event={EVENTS.ctaClickNav} className="hidden sm:block">
            <a
              href={NAV.cta.href}
              className="btn-press inline-flex h-11 items-center rounded-full bg-accent-solid px-5 font-sans text-sm font-medium text-accent-ink hover:bg-accent-dim"
            >
              {NAV.cta.label}
            </a>
          </TrackClick>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-11 w-11 place-items-center content-center gap-[5px] rounded-full border border-line text-ink md:hidden"
          >
            <span
              className={clsx(
                "block h-[1.5px] w-4 rounded-full bg-current transition-transform duration-300",
                open && "translate-y-[3.25px] rotate-45",
              )}
            />
            <span
              className={clsx(
                "block h-[1.5px] w-4 rounded-full bg-current transition-transform duration-300",
                open && "-translate-y-[3.25px] -rotate-45",
              )}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.out }}
            className="mx-auto mt-2 max-w-[54rem] origin-top rounded-3xl border border-line bg-elevated/95 p-2 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col">
              {NAV.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 font-display text-2xl font-semibold tracking-[-0.02em] text-ink font-stretch-semi-expanded hover:bg-elevated-2"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <TrackClick event={EVENTS.ctaClickNav} className="mt-2 block">
              <a
                href={NAV.cta.href}
                onClick={() => setOpen(false)}
                className="btn-press flex h-12 items-center justify-center rounded-full bg-accent-solid font-sans text-base font-medium text-accent-ink"
              >
                {NAV.cta.label}
              </a>
            </TrackClick>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
