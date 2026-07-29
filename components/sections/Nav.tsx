"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";
import { DUR, EASE } from "@/lib/constants";

function hashOf(href: string) {
  return href.startsWith("/#") ? href.slice(1) : null;
}

/**
 * The navigation: a floating glass capsule with a travelling active indicator.
 *
 * Two rewrites got here. First a left-edge rail of bubbles whose toggle threw a
 * full-screen wall of scattered pills, which hid every destination behind a
 * click. Then a plain full-width bar, which fixed that and was correct but
 * anonymous, the same header as every other site.
 *
 * What makes this one read as expensive is not the glass. It is that the active
 * marker is a single element that physically travels between links rather than
 * six separate underlines switching on and off. `layoutId` hands the two
 * renders to the same DOM node, so Motion interpolates its position and width
 * from wherever it was to wherever it now belongs. The eye tracks one object
 * moving, and the section you are in stops being a state you read and becomes a
 * place the marker went, which is exactly the job of a nav.
 *
 * The capsule also floats clear of the top edge and tightens as the page
 * scrolls, so the header has a resting state and a working state instead of
 * being one fixed slab pinned over the content the whole visit.
 */
export function Nav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  const isHome = pathname === "/";
  const items = NAV.links;

  // Two behaviours off one passive listener: the capsule tightens once the page
  // leaves the top, and it gets out of the way while the reader moves down and
  // returns the moment they move up. Reading is the whole job of this page, so
  // a header parked over the top of every screen for the entire visit is real
  // content lost.
  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);

      // 6px of slack so trackpad jitter cannot flap the bar, and never hide it
      // near the top of the page
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 220);
        lastY.current = y;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // An open sheet must never be scrolled out of reach. Derived at render rather
  // than pushed through an effect: `setHidden(false)` inside an `[open]` effect
  // is the cascading-render pattern the lint rules reject, and render can work
  // this out for itself.
  const barHidden = hidden && !open;

  // scroll-spy: mark the link whose section owns the upper viewport
  useEffect(() => {
    // off home there is nothing to spy on, the target ids live on the home page
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
  const isActive = useCallback(
    (href: string) => {
      const hash = hashOf(href);
      return isHome ? hash !== null && active === hash : pathname === href;
    },
    [active, isHome, pathname],
  );

  // Escape closes the mobile sheet.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // lock body scroll while the mobile sheet is up
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /** One renderer for both rows. On home an anchor must stay a real `<a>` so
   *  Lenis owns the smooth scroll; `Link` would hand it to the router. */
  const renderLink = (
    item: (typeof items)[number],
    className: string,
    children: React.ReactNode,
    onClick?: () => void,
  ) => {
    const hash = hashOf(item.href);
    const on = isActive(item.href);

    return isHome && hash ? (
      <a href={hash} onClick={onClick} aria-current={on ? "true" : undefined} className={className}>
        {children}
      </a>
    ) : (
      <Link
        href={item.href}
        onClick={onClick}
        aria-current={on ? "page" : undefined}
        className={className}
      >
        {children}
      </Link>
    );
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        barHidden ? "-translate-y-[130%]" : "translate-y-0"
      }`}
    >
      <div
        className={`mx-auto w-full max-w-(--max-shell) px-4 transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "pt-2 md:pt-3" : "pt-4 md:pt-6"
        }`}
      >
        {/* the capsule. Border and blur only appear once the page has moved, so
            over the hero it reads as type floating on the paper rather than as
            a chrome bar bolted to the top of the design. */}
        <nav
          aria-label={NAV.brand}
          className={`flex items-center justify-between gap-2 rounded-full px-2 py-2 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ${
            scrolled || open
              ? "border border-line/80 bg-canvas/70 shadow-[0_8px_32px_rgba(30,26,42,0.08)] backdrop-blur-xl"
              : "border border-transparent bg-transparent"
          }`}
        >
          <Link
            href={isHome ? "#hero" : "/"}
            aria-label={NAV.brand}
            onClick={() => setOpen(false)}
            className="btn-press flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-2 pr-3"
          >
            <Logo priority sizes="32px" className="h-7 w-auto md:h-8" />
            <span className="hidden font-display text-base font-semibold tracking-tight text-ink sm:block">
              {NAV.brand}
            </span>
          </Link>

          {/* destinations, desktop */}
          {/* `lg`, not `md`. Six destinations plus the wordmark plus the CTA
              need more than a 768px capsule: at that width the row overflowed
              its own container by 25px and pushed the whole page into a
              horizontal scroll. Tablets get the sheet, which is the honest
              answer for this many links. */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {items.map((item) => {
              const on = isActive(item.href);
              return (
                <li key={item.href} className="relative">
                  {/* The travelling marker. One node, shared across every link
                      by `layoutId`, so Motion animates it from the previous
                      item's box to this one instead of cross-fading two
                      separate highlights. */}
                  {on && (
                    <motion.span
                      layoutId="nav-marker"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-accent-soft ring-1 ring-accent/20"
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32, mass: 0.6 }
                      }
                    />
                  )}
                  {renderLink(
                    item,
                    // py-2 is a target-size fix as much as a visual one: these
                    // links were 16px tall, under the 24px minimum, so the
                    // clickable area was thinner than the text looked
                    `relative z-10 block rounded-full px-3.5 py-2 font-sans text-sm transition-colors duration-200 ${
                      on ? "text-accent-text" : "text-muted hover:text-ink"
                    }`,
                    item.label,
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <TrackClick event={EVENTS.ctaClickNav}>
              <Link
                href={isHome ? (hashOf(NAV.cta.href) ?? NAV.cta.href) : NAV.cta.href}
                onClick={() => setOpen(false)}
                className="btn-press rounded-full bg-accent-solid px-5 py-2.5 font-sans text-sm font-medium text-accent-ink hover:bg-accent-dim"
              >
                {NAV.cta.label}
              </Link>
            </TrackClick>

            {/* sheet toggle, mobile only */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center gap-[5px] rounded-full border border-line text-ink lg:hidden"
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

        {/* mobile sheet: a second capsule under the first, so the nav stays one
            floating object rather than a bar that suddenly grows a panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduce ? 0 : DUR.fast, ease: EASE.out }}
              className="mt-2 overflow-hidden rounded-3xl border border-line/80 bg-canvas/95 p-2 shadow-[0_8px_32px_rgba(30,26,42,0.08)] backdrop-blur-xl lg:hidden"
            >
              <ul className="flex flex-col">
                {items.map((item) => (
                  <li key={item.href}>
                    {renderLink(
                      item,
                      `block rounded-2xl px-4 py-3.5 font-display text-lg font-medium tracking-tight transition-colors ${
                        isActive(item.href)
                          ? "bg-accent-soft text-accent-text"
                          : "text-ink hover:bg-elevated-2"
                      }`,
                      item.label,
                      () => setOpen(false),
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
