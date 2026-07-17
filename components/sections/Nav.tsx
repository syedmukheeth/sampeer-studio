"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";
import { BrandMark } from "@/components/ui/BrandMark";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { EASE, DUR } from "@/lib/constants";

/** A nav href is either an on-home anchor ("/#work") or a real route
 *  ("/automations"). Returns the bare hash for the former, null for the
 *  latter — the two need different elements and different active logic. */
function hashOf(href: string) {
  return href.startsWith("/#") ? href.slice(1) : null;
}

/** §00 Top nav. One line, <=72px. Brand mark + wordmark, magnetic CTA.
 *  Scroll-spy lights the active link; mobile gets a full-bleed sheet menu so
 *  the links aren't stranded behind a desktop-only breakpoint.
 *
 *  Route-aware since /automations exists: on home, anchors stay plain <a> so
 *  Lenis smooth-scrolls them and the spy drives the indicator. Anywhere else
 *  those sections don't exist, so every link becomes a real <Link> (prefetch
 *  + client transition) and "active" comes from the pathname instead. */
export function Nav() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  const isHome = pathname === "/";

  // scroll-spy: mark the link whose section owns the upper viewport
  useEffect(() => {
    // off home there is nothing to spy on — the target ids live on the home page
    if (!isHome) return;

    const targets = NAV.links
      .map((l) => hashOf(l.href))
      .filter((h): h is string => h !== null)
      .map((h) => document.getElementById(h.slice(1)))
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
  }, [isHome]);

  /** On home the spy wins; elsewhere the route is the only truth. */
  function isActive(href: string) {
    const hash = hashOf(href);
    return isHome ? hash !== null && active === hash : pathname === href;
  }

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-canvas/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-(--max-shell) items-center justify-between px-6 md:px-10">
        <Link
          href={isHome ? "#hero" : "/"}
          className="flex items-center gap-2.5 font-display text-base font-semibold tracking-tight"
        >
          <BrandMark size={24} />
          {NAV.brand}
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.links.map((l) => {
            const on = isActive(l.href);
            const hash = hashOf(l.href);
            const className = `relative font-sans text-sm transition-colors ${
              on ? "text-ink" : "text-muted hover:text-ink"
            }`;
            const indicator = on && (
              <motion.span
                layoutId="nav-active"
                className="absolute -bottom-1.5 left-0 h-px w-full bg-accent"
                transition={{ duration: DUR.fast, ease: EASE.out }}
              />
            );

            // on home, an anchor must stay an <a> so Lenis owns the scroll
            return isHome && hash ? (
              <a key={l.href} href={hash} className={className}>
                {l.label}
                {indicator}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className={className}>
                {l.label}
                {indicator}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <TrackClick event={EVENTS.ctaClickNav}>
            <Magnetic>
              <Link
                href={isHome ? hashOf(NAV.cta.href) ?? NAV.cta.href : NAV.cta.href}
                className="inline-block rounded-md bg-accent px-4 py-2 font-sans text-sm font-medium text-ink transition-transform active:scale-[0.98]"
              >
                {NAV.cta.label}
              </Link>
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
              {NAV.links.map((l, i) => {
                const hash = hashOf(l.href);
                return (
                  <motion.div
                    key={l.href}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: DUR.base,
                      delay: 0.05 + i * 0.06,
                      ease: EASE.out,
                    }}
                  >
                    {isHome && hash ? (
                      <a
                        href={hash}
                        onClick={() => setOpen(false)}
                        className="font-display text-4xl font-semibold tracking-tight text-ink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="font-display text-4xl font-semibold tracking-tight text-ink"
                      >
                        {l.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
              <Link
                href={isHome ? hashOf(NAV.cta.href) ?? NAV.cta.href : NAV.cta.href}
                onClick={() => setOpen(false)}
                className="mt-8 inline-flex w-fit items-center rounded-md bg-accent px-6 py-3 font-sans text-sm font-medium text-ink"
              >
                {NAV.cta.label}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
