"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

function hashOf(href: string) {
  return href.startsWith("/#") ? href.slice(1) : null;
}

/** A conventional top navigation bar.
 *
 *  This replaced a left-edge rail of two floating bubbles whose toggle threw a
 *  full-screen wall of scattered, rotated pills. That arrangement had no
 *  persistent link row, so a visitor could not see where the site went without
 *  first opening an overlay, and the tilted pills gave every label a different
 *  baseline. A bar is the boring answer and the right one: the destinations are
 *  visible at rest, the brand anchors the left, and conversion sits at the far
 *  right where it is looked for.
 *
 *  Transparent over the hero, then it earns a background and a hairline once
 *  the page moves, so it never floats as an unexplained band over the top of
 *  the headline. */
export function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isHome = pathname === "/";
  const items = NAV.links;

  // solid the moment the page leaves the top; passive, this fires on every
  // frame of a scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  /** One link renderer for both rows. On home an anchor must stay a real <a>
   *  so Lenis owns the smooth scroll; Link would hand it to the router. */
  const renderLink = (
    item: (typeof items)[number],
    className: string,
    onClick?: () => void,
  ) => {
    const hash = hashOf(item.href);
    const on = isActive(item.href);

    return isHome && hash ? (
      <a
        href={hash}
        onClick={onClick}
        aria-current={on ? "true" : undefined}
        className={className}
      >
        {item.label}
      </a>
    ) : (
      <Link
        href={item.href}
        onClick={onClick}
        aria-current={on ? "page" : undefined}
        className={className}
      >
        {item.label}
      </Link>
    );
  };

  const linkClass = (href: string) =>
    `relative py-1 font-sans text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 ${
      isActive(href) ? "text-accent-text after:scale-x-100" : "text-muted hover:text-ink"
    }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-canvas/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-(--max-shell) items-center justify-between gap-6 px-6 md:h-20">
        {/* brand */}
        {/* every link that leaves this bar also closes the mobile sheet, which
            is why there is no effect watching the route: closing on navigation
            is the click's own job, not a render-cycle side effect */}
        <Link
          href={isHome ? "#hero" : "/"}
          aria-label={NAV.brand}
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
        >
          <Logo priority sizes="28px" className="h-7 w-auto md:h-8" />
          <span className="hidden font-display text-base font-semibold tracking-tight text-ink sm:block">
            {NAV.brand}
          </span>
        </Link>

        {/* destinations, desktop */}
        <nav aria-label={NAV.brand} className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <span key={item.href}>{renderLink(item, linkClass(item.href))}</span>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <TrackClick event={EVENTS.ctaClickNav}>
            <Link
              href={isHome ? (hashOf(NAV.cta.href) ?? NAV.cta.href) : NAV.cta.href}
              onClick={() => setOpen(false)}
              className="rounded-md bg-accent-solid px-4 py-2 font-sans text-sm font-medium text-accent-ink transition-colors duration-300 hover:bg-accent-dim md:px-5 md:py-2.5"
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
            className="grid h-10 w-10 place-items-center gap-[5px] rounded-md border border-line text-ink md:hidden"
          >
            <span
              className={`block h-[1.5px] w-5 rounded-full bg-current transition-transform duration-300 ${
                open ? "translate-y-[3.25px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-5 rounded-full bg-current transition-transform duration-300 ${
                open ? "-translate-y-[3.25px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* mobile sheet, drops out of the bar itself rather than covering the page */}
      {open && (
        <nav
          aria-label={NAV.brand}
          className="border-t border-line bg-canvas px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.href} className="border-b border-line/60 last:border-b-0">
                {renderLink(
                  item,
                  `block py-3.5 font-display text-lg font-medium tracking-tight transition-colors ${
                    isActive(item.href) ? "text-accent-text" : "text-ink"
                  }`,
                  () => setOpen(false),
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
