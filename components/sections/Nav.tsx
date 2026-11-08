"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { DUR, EASE } from "@/lib/constants";

/* Plain <a> for the hash links: from "/" they scroll in place, from any other
   route they load home at that section. */
export function Nav() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
      <nav
        aria-label={NAV.brand}
        className="mx-auto flex h-16 w-full max-w-(--max-shell) items-center justify-between gap-4 px-4 md:px-10"
      >
        <Link href="/" aria-label={NAV.brand} className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo sizes="32px" className="h-7 w-auto md:h-8" />
          <span className="font-display text-base font-semibold tracking-tight text-ink">{NAV.brand}</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {NAV.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-3 py-2 font-sans text-sm text-muted transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <TrackClick event={EVENTS.ctaClickNav}>
            <a
              href={NAV.cta.href}
              onClick={() => setOpen(false)}
              className="ml-1 rounded-md bg-accent-solid px-4 py-2 font-sans text-sm font-medium text-accent-ink transition-colors hover:bg-accent-dim"
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
            className="grid h-10 w-10 place-items-center content-center gap-[5px] rounded-md border border-line text-ink md:hidden"
          >
            <span
              className={`block h-[1.5px] w-4 rounded-full bg-current transition-transform duration-300 ${
                open ? "translate-y-[3.25px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-4 rounded-full bg-current transition-transform duration-300 ${
                open ? "-translate-y-[3.25px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduce ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.out }}
            className="border-t border-line bg-canvas md:hidden"
          >
            <ul className="flex flex-col px-4 py-3">
              {NAV.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-3 font-display text-xl font-medium tracking-tight text-ink hover:bg-elevated-2"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
