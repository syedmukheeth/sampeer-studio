"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/** Tilts are hand-set rather than random so the wall of pills reads as a
 *  deliberate arrangement and stays identical between renders. */
const ROTATION = [-6, 5, -4, 6, -5, 4, -3];

/** Navigation as a side rail, not a header. Two bubbles ride the left edge —
 *  the mark and the toggle — and the toggle throws a full-screen wall of tilted
 *  pills (react-bits BubbleMenu, rebuilt on this project's tokens, routing and
 *  scroll-spy). The rail is pointer-transparent apart from the bubbles, so the
 *  page keeps its full width instead of paying for a permanent sidebar. */
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
  const items = [...NAV.links, { href: NAV.cta.href, label: NAV.cta.label }];

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

  // lock body scroll while the wall is up
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const bubble =
    "pointer-events-auto grid place-items-center rounded-full border border-line/70 bg-elevated shadow-[0_4px_20px_rgba(31,41,36,0.10)] transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0";

  return (
    <>
      {/* the rail: fixed to the left edge, transparent except for the bubbles */}
      <div className="pointer-events-none fixed left-4 top-4 z-50 flex flex-col items-center gap-3 md:left-6 md:top-6">
        <Link
          href={isHome ? "#hero" : "/"}
          aria-label={NAV.brand}
          className={`${bubble} h-12 w-12 md:h-14 md:w-14`}
        >
          <Logo variant="mark" priority sizes="34px" className="h-7 w-auto md:h-8" />
        </Link>

        <button
          ref={toggleRef}
          type="button"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`${bubble} h-12 w-12 flex-col gap-[5px] md:h-14 md:w-14`}
        >
          <span
            className={`block h-[2px] w-5 rounded-full bg-ink transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 rounded-full bg-ink transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>

        <TrackClick event={EVENTS.ctaClickNav}>
          <Link
            href={isHome ? (hashOf(NAV.cta.href) ?? NAV.cta.href) : NAV.cta.href}
            className={`${bubble} hidden h-14 w-14 border-transparent bg-accent-solid text-center font-sans text-[10px] font-semibold uppercase leading-[1.1] tracking-wide text-accent-ink md:grid`}
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
          <nav aria-label={NAV.brand} className="w-full max-w-4xl px-6 md:px-10">
            <ul className="flex flex-wrap justify-center gap-2 md:gap-3">
              {items.map((item, i) => {
                const hash = hashOf(item.href);
                const on = isActive(item.href);
                const isCta = i === items.length - 1;
                const className = `flex w-full items-center justify-center rounded-full border px-6 py-3 text-center font-display text-xl font-medium tracking-tight transition-colors duration-300 md:py-4 md:text-2xl ${
                  isCta
                    ? "border-transparent bg-accent-solid text-accent-ink hover:bg-accent-dim"
                    : on
                      ? "border-accent/20 bg-accent-soft text-ink"
                      : "border-line/70 bg-elevated text-ink hover:bg-accent-solid hover:text-accent-ink"
                }`;
                const style = { rotate: `${ROTATION[i % ROTATION.length]}deg` };
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
                    className="w-full sm:w-[calc(50%-0.375rem)] lg:w-[calc(33.333%-0.667rem)]"
                  >
                    {/* on home, an anchor must stay an <a> so Lenis owns the scroll */}
                    {isHome && hash ? (
                      <a
                        ref={ref}
                        href={hash}
                        style={style}
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
                        style={style}
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
