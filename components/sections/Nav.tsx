"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";
import { Logo } from "@/components/ui/Logo";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { EASE, DUR } from "@/lib/constants";

/** A nav href is either an on-home anchor ("/#work") or a real route
 *  ("/automations"). Returns the bare hash for the former, null for the
 *  latter — the two need different elements and different active logic. */
function hashOf(href: string) {
  return href.startsWith("/#") ? href.slice(1) : null;
}

/** §00 Top nav — a floating frosted-glass PILL, detached from the page edge.
 *  Brand mark + wordmark links + magnetic gradient CTA, all inside one
 *  rounded-full capsule. The active link is lit by a glowing pill that slides
 *  between links (shared-element `layoutId`), not a flat underline. On scroll
 *  the capsule condenses and its glass deepens.
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
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";

  // condense the capsule once the page has scrolled past the fold's lip
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-4">
      <motion.nav
        initial={false}
        animate={{
          marginTop: scrolled ? 10 : 18,
          paddingTop: scrolled ? 6 : 8,
          paddingBottom: scrolled ? 6 : 8,
        }}
        transition={reduce ? { duration: 0 } : { duration: DUR.fast, ease: EASE.out }}
        className={`flex w-full max-w-(--max-shell) items-center justify-between gap-2 rounded-full border pl-2 pr-2 backdrop-blur-xl transition-colors duration-300 ${
          scrolled
            ? "border-accent/20 bg-elevated/80 shadow-[0_8px_30px_-14px_rgba(16,185,129,0.28),inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            : "border-line/70 bg-elevated/50 shadow-[0_4px_24px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_0_rgba(255,255,255,0.03)]"
        }`}
      >
        <Link
          href={isHome ? "#hero" : "/"}
          aria-label={NAV.brand}
          className="flex items-center"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-canvas/60 ring-1 ring-line transition-all duration-300 hover:ring-accent/40 hover:shadow-[0_0_16px_-6px_rgba(16,185,129,0.4)]">
            <Logo variant="mark" priority sizes="36px" className="h-7 w-auto" />
          </span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {NAV.links.map((l) => {
            const on = isActive(l.href);
            const hash = hashOf(l.href);
            const className = `relative rounded-full px-4 py-2 font-sans text-sm transition-colors duration-200 ${
              on ? "text-ink" : "text-muted hover:text-ink"
            }`;
            // the glowing pill that slides behind the active link
            const indicator = on && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 -z-0 rounded-full bg-accent-soft ring-1 ring-inset ring-accent/25 shadow-[0_0_18px_-8px_rgba(16,185,129,0.4)]"
                transition={reduce ? { duration: 0 } : { duration: DUR.fast, ease: EASE.out }}
              />
            );
            const label = <span className="relative z-10">{l.label}</span>;

            // on home, an anchor must stay an <a> so Lenis owns the scroll
            return isHome && hash ? (
              <a key={l.href} href={hash} className={className}>
                {indicator}
                {label}
              </a>
            ) : (
              <Link key={l.href} href={l.href} className={className}>
                {indicator}
                {label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <TrackClick event={EVENTS.ctaClickNav}>
            <Magnetic>
              <Link
                href={isHome ? hashOf(NAV.cta.href) ?? NAV.cta.href : NAV.cta.href}
                className="group relative inline-flex items-center overflow-hidden rounded-full bg-linear-to-r from-accent-solid to-accent px-5 py-2 font-sans text-sm font-semibold text-accent-ink shadow-[0_0_18px_-8px_rgba(16,185,129,0.45)] transition-[transform,box-shadow] duration-300 hover:shadow-[0_0_22px_-6px_rgba(16,185,129,0.6)] active:scale-[0.98]"
              >
                <span className="relative z-10">{NAV.cta.label}</span>
                {/* sheen sweep on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 group-hover:translate-x-full"
                />
              </Link>
            </Magnetic>
          </TrackClick>

          {/* mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-accent-soft md:hidden"
          >
            <List size={22} weight="bold" />
          </button>
        </div>
      </motion.nav>

      {/* mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-canvas/95 backdrop-blur-xl md:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE.out }}
          >
            {/* soft emerald aura bleeding from the top so the sheet reads as lit */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,rgba(16,185,129,0.1)_0%,transparent_60%)]"
            />
            <div className="relative flex h-20 items-center justify-between px-6">
              <span className="flex items-center" aria-label={NAV.brand}>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-elevated ring-1 ring-line">
                  <Logo variant="mark" sizes="36px" className="h-7 w-auto" />
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink ring-1 ring-line transition-colors hover:bg-accent-soft"
              >
                <X size={22} weight="bold" />
              </button>
            </div>

            <nav className="relative flex flex-1 flex-col justify-center gap-2 px-6 pb-24">
              {NAV.links.map((l, i) => {
                const hash = hashOf(l.href);
                const linkClass =
                  "font-display text-4xl font-semibold tracking-tight text-ink transition-colors duration-200 hover:text-accent-text";
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
                        className={linkClass}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={linkClass}
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
                className="mt-8 inline-flex w-fit items-center rounded-full bg-linear-to-r from-accent-solid to-accent px-6 py-3 font-sans text-sm font-semibold text-accent-ink shadow-[0_0_20px_-8px_rgba(16,185,129,0.5)] active:scale-[0.98]"
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
