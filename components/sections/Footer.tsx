"use client";

import { useRef } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { ArrowUp, ArrowUpRight, InstagramLogo, LinkedinLogo } from "@phosphor-icons/react/dist/ssr";
import { FOOTER } from "@/lib/content";
import { ramp } from "@/lib/scroll";
import { Shell } from "@/components/ui/Shell";

const ICON = { linkedin: LinkedinLogo, instagram: InstagramLogo } as const;

/* Ft5, studied from the Suri Mansoor Ali Khan footer and rebuilt in this
   site's own system. It is the page's last night panel.

   The curtain: the footer is already pinned to the bottom of the viewport
   inside a clipped wrapper (`.footer-wrap` / `.footer-track` /
   `.footer-sticky` in globals.css), so the page lifts off it rather than
   pushing it up. As it is uncovered, the wordmark rises out of its own
   baseline, scrubbed to the scroll. Then the credit row arrives: the marker
   stroke sweeps under the name and a glint crosses each button, once.

   Reduced motion: the wordmark is simply there, and the CSS holds the
   finished stroke with no glint. */
export function Footer() {
  const wrap = useRef<HTMLDivElement>(null);
  const credit = useRef<HTMLDivElement>(null);
  const creditIn = useInView(credit, { once: true, amount: 0.6 });

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end end"] });
  // function form, so Motion keeps it on the real scroll (see lib/scroll.ts)
  // It lands at 80% of the reveal, not 100%: on phones the wordmark wraps to
  // two lines, and a rise that only finishes at the very last pixel leaves
  // "Studio" clipped wherever the browser chrome shaves that pixel off.
  const rise = useTransform(scrollYProgress, (p) => `${ramp(p, [0.1, 0.8], [45, 0])}%`);

  const toTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0 });
  };

  return (
    <div ref={wrap} className="footer-wrap">
      <div className="footer-track">
        <footer className="footer-sticky night flex flex-col bg-canvas">
          <div aria-hidden className="footer-rule" />

          <Shell className="flex flex-1 flex-col justify-between gap-6 pt-9 pb-7 md:gap-8 md:pt-14 md:pb-9">
            <div className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-4 md:grid-cols-12 md:gap-x-8">
              <div className="md:col-span-4">
                <p className="font-display text-xl font-semibold tracking-[-0.03em] text-ink">
                  {FOOTER.brand}
                </p>
                <p className="mt-1 font-mono text-xs text-faint">{FOOTER.location}</p>
              </div>
              <div className="justify-self-end md:order-last md:col-span-3">
                <button
                  type="button"
                  onClick={toTop}
                  className="link-wipe inline-flex min-h-11 items-center gap-2 font-sans text-sm text-ink"
                >
                  {FOOTER.top}
                  <ArrowUp size={14} weight="bold" aria-hidden />
                </button>
              </div>
              <div className="col-span-2 md:col-span-5">
                <p className="max-w-[26ch] font-display text-lg leading-snug font-semibold tracking-[-0.03em] text-ink md:text-2xl">
                  {FOOTER.line}
                </p>
                <a
                  href={`mailto:${FOOTER.email}`}
                  className="link-wipe mt-2 inline-block py-1 font-sans text-sm text-accent-text"
                >
                  {FOOTER.email}
                </a>
              </div>
            </div>

            <div>
              {/* the page signs its name; the words are in the row above for
                  anyone not reading pixels */}
              <div aria-hidden className="@container overflow-hidden">
                {/* always bound, so server and client markup agree; under
                    reduced motion globals.css pins it at rest */}
                <motion.p style={{ y: rise }} className="footer-mark text-ink">
                  {FOOTER.mark[0]} <span className="text-faint">{FOOTER.mark[1]}</span>
                </motion.p>
              </div>

              <div
                ref={credit}
                data-credit
                className={clsx(
                  "mt-4 flex flex-col items-center gap-4 border-t border-line pt-5 md:mt-5 md:pt-6 lg:flex-row lg:justify-between",
                  creditIn && "is-in",
                )}
              >
                <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-faint">{FOOTER.credit.kicker}</span>
                  <span className="credit-name font-display text-2xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">
                    {FOOTER.credit.name}
                  </span>
                </p>
                <ul className="grid w-full max-w-[25rem] grid-cols-2 gap-3 md:flex md:w-auto md:max-w-none">
                  {FOOTER.buttons.map((b) => {
                    const Icon = ICON[b.id];
                    return (
                      <li key={b.id}>
                        <a
                          href={b.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={clsx("credit-btn", b.accent && "credit-btn--accent")}
                        >
                          <Icon size={18} aria-hidden />
                          <span>{b.label}</span>
                          <ArrowUpRight size={15} weight="bold" aria-hidden className="credit-btn__arrow" />
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-faint lg:justify-between">
                <span>
                  © {FOOTER.year} {FOOTER.brand}
                </span>
                <span className="flex gap-6">
                  {FOOTER.links.map((l) =>
                    l.external ? (
                      <a
                        key={l.href}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-wipe py-1 hover:text-ink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link key={l.href} href={l.href} className="link-wipe py-1 hover:text-ink">
                        {l.label}
                      </Link>
                    ),
                  )}
                </span>
              </div>
            </div>
          </Shell>
        </footer>
      </div>
    </div>
  );
}
