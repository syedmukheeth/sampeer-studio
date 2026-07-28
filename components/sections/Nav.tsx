"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { NAV } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

function hashOf(href: string) {
  return href.startsWith("/#") ? href.slice(1) : null;
}

/** Scatter is hand-set rather than random, for two reasons: Math.random() would
 *  desync between the server and client renders, and an arrangement that is
 *  actually random reads as broken rather than as loose. Each entry is one
 *  pill: `rot` tilts it, `at` drops it at a point on the open wall (md and up,
 *  where the pills are placed across the whole viewport rather than stacked in
 *  a centre column), and `dy`/`w` still shape the narrow-screen column.
 *
 *  The `at` points are picked to cover the field without landing under the
 *  fixed chrome: nothing above 16% on the far left (the mark) or the far right
 *  (the toggle and Start), and nothing past 72% left, so a long label still has
 *  room to run before the right edge. */
const SCATTER = [
  { rot: -7, dy: -18, w: "sm:w-[46%] lg:w-[34%]", at: { top: "16%", left: "9%" } },
  { rot: 5, dy: 14, w: "sm:w-[38%] lg:w-[27%]", at: { top: "33%", left: "41%" } },
  { rot: -4, dy: 22, w: "sm:w-[44%] lg:w-[31%]", at: { top: "45%", left: "13%" } },
  { rot: 8, dy: -10, w: "sm:w-[36%] lg:w-[25%]", at: { top: "26%", left: "72%" } },
  { rot: -6, dy: 16, w: "sm:w-[42%] lg:w-[29%]", at: { top: "60%", left: "56%" } },
  { rot: 4, dy: -14, w: "sm:w-[40%] lg:w-[33%]", at: { top: "76%", left: "18%" } },
  { rot: -3, dy: 10, w: "sm:w-[45%] lg:w-[26%]", at: { top: "78%", left: "66%" } },
];

/** Navigation as a side rail, not a header. The mark holds the left corner;
 *  navigation lives on the right, where the toggle and "Start" share one
 *  column. The toggle throws a full-screen wall of scattered pills (react-bits
 *  BubbleMenu, rebuilt on this project's tokens, routing and scroll-spy). The
 *  rail sits at z-50 above the z-40 wall, so conversion stays one click away
 *  whether the menu is open or shut, and the wall carries no CTA pill. */
export function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLAnchorElement[]>([]);
  const labelsRef = useRef<HTMLSpanElement[]>([]);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isHome = pathname === "/";
  // the CTA is not one of these: it owns the top-right corner instead of
  // sitting in the wall as a highlighted pill
  const items = NAV.links;

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

  // The overlay only exists while open, so the pills animate on mount; `mounted`
  // then keeps it in the DOM long enough for the closing tween.
  const toggle = useCallback(() => {
    setMounted(true); // no-op while closing; the close tween clears it again
    setOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    const pills = pillsRef.current.filter(Boolean);
    const labels = labelsRef.current.filter(Boolean);
    if (!overlay || !pills.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (open) {
        if (reduce) {
          gsap.set(pills, { scale: 1, rotate: 0 });
          gsap.set(labels, { y: 0, autoAlpha: 1 });
          return;
        }
        gsap.set(pills, { scale: 0, transformOrigin: "50% 50%" });
        gsap.set(labels, { y: 24, autoAlpha: 0 });
        pills.forEach((pill, i) => {
          gsap
            .timeline({ delay: i * 0.07 })
            .to(pill, { scale: 1, duration: 0.5, ease: "back.out(1.5)" })
            .to(labels[i], { y: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" }, "-=0.45");
        });
        return;
      }
      // closing
      gsap.to(labels, { y: 16, autoAlpha: 0, duration: reduce ? 0 : 0.15, ease: "power3.in" });
      gsap.to(pills, {
        scale: 0,
        duration: reduce ? 0 : 0.2,
        ease: "power3.in",
        onComplete: () => setMounted(false),
      });
    }, overlay);

    return () => ctx.revert();
  }, [open, mounted]);

  // Escape closes; focus goes back to the toggle so the keyboard never strands.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock scroll while the wall is up. `overflow: hidden` alone does not hold:
  // Lenis drives the page from its own rAF loop and keeps scrolling the
  // document under the overlay, so the smooth-scroll instance has to be
  // stopped as well and restarted on close.
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { stop(): void; start(): void } }).lenis;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open]);

  // No display utility here on purpose: each caller picks its own. A `grid` in
  // the shared string wins over a `flex` added at the call site (same layer,
  // and `grid` is emitted later), and as a grid the toggle's bars get their
  // free space distributed by align-content instead of sitting 5px apart.
  const bubble =
    "pointer-events-auto rounded-full border border-line/70 bg-elevated shadow-[0_4px_20px_rgba(31,41,36,0.10)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0";

  return (
    <>
      {/* the mark keeps the left corner, where a masthead belongs */}
      <div className="pointer-events-none fixed left-4 top-4 z-50 md:left-6 md:top-6">
        <Link
          href={isHome ? "#hero" : "/"}
          aria-label={NAV.brand}
          className={`${bubble} grid h-12 w-12 place-items-center overflow-hidden md:h-14 md:w-14`}
        >
          <Logo variant="mark" />
        </Link>
      </div>

      {/* the rail: navigation on the right edge, toggle and Start in the one
          column at z-50 above the z-40 wall, so conversion stays one click away
          whether the menu is open or shut and the wall carries no CTA pill. */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col items-center gap-3 md:right-6 md:top-6">
        <button
          ref={toggleRef}
          type="button"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`${bubble} flex h-12 w-12 flex-col items-center justify-center gap-[5px] md:h-14 md:w-14`}
        >
          {/* three bars, not two: two reads as an abstract mark, three is the
              one glyph everybody already knows means "menu". The stack is
              2px bars with 5px gaps, so the outer two sit 7px off centre and
              that is exactly what the open state has to undo to close the X. */}
          <span
            className={`block h-[2px] w-5 rounded-full bg-ink transition-transform duration-300 ${
              open ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-ink transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>

        <TrackClick event={EVENTS.ctaClickNav}>
          <Link
            href={isHome ? (hashOf(NAV.cta.href) ?? NAV.cta.href) : NAV.cta.href}
            className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-accent text-center font-sans text-[10px] font-bold uppercase leading-[1.1] tracking-[0.18em] text-white shadow-[0_4px_20px_rgba(31,41,36,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-dim active:translate-y-0 md:h-14 md:w-14"
          >
            {NAV.cta.label}
          </Link>
        </TrackClick>
      </div>

      {/* the wall */}
      {mounted && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 flex items-center justify-center bg-canvas/95 backdrop-blur-xl"
        >
          {/* Narrow: a centred column, the only arrangement a phone has room
              for. md and up: the nav fills the wall and every pill is placed
              absolutely at its own point, so the options are spread across the
              screen instead of stacked in one cluster. */}
          <nav
            aria-label={NAV.brand}
            className="w-full max-w-4xl px-6 md:absolute md:inset-0 md:max-w-none md:px-10"
          >
            <ul className="flex flex-wrap justify-center gap-2 md:relative md:block md:h-full md:gap-0">
              {items.map((item, i) => {
                const hash = hashOf(item.href);
                const on = isActive(item.href);
                const scatter = SCATTER[i % SCATTER.length];
                const className = `flex w-full items-center justify-center whitespace-nowrap rounded-full border px-6 py-3 text-center font-display text-xl font-medium tracking-tight transition-colors duration-300 md:w-auto md:py-4 md:text-2xl ${
                  on
                    ? "border-accent/20 bg-accent-soft text-ink"
                    : "border-line/70 bg-elevated text-ink hover:bg-accent-solid hover:text-accent-ink"
                }`;
                // The scatter rides the <li>, not the pill itself. GSAP's
                // CSSPlugin clears the independent `rotate`/`translate`/`scale`
                // longhands on anything it animates, so setting them on the
                // pill (which the open/close timeline scales) silently zeroes
                // them the moment the wall opens. The wrapper is untouched by
                // the timeline, so the tilt survives and still composes with
                // the tween. `dy` rides a custom property so the media query in
                // globals.css can null it where every pill is full width.
                const style = {
                  rotate: `${scatter.rot}deg`,
                  translate: "0 var(--pill-dy, 0px)",
                  "--pill-dy": `${scatter.dy}px`,
                  "--pill-top": scatter.at.top,
                  "--pill-left": scatter.at.left,
                } as CSSProperties;
                const label = (
                  <span
                    ref={(el) => {
                      if (el) labelsRef.current[i] = el;
                    }}
                    className="block"
                  >
                    {item.label}
                  </span>
                );
                const ref = (el: HTMLAnchorElement | null) => {
                  if (el) pillsRef.current[i] = el;
                };

                return (
                  <li
                    key={item.href}
                    style={style}
                    className={`nav-pill w-full ${scatter.w} md:absolute md:left-[var(--pill-left)] md:top-[var(--pill-top)] md:w-auto`}
                  >
                    {/* on home, an anchor must stay an <a> so Lenis owns the scroll */}
                    {isHome && hash ? (
                      <a
                        ref={ref}
                        href={hash}
                        onClick={() => setOpen(false)}
                        aria-current={on ? "true" : undefined}
                        className={className}
                      >
                        {label}
                      </a>
                    ) : (
                      <Link
                        ref={ref}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={on ? "page" : undefined}
                        className={className}
                      >
                        {label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
