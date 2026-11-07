import Link from "next/link";
import { NAV } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { TrackClick } from "@/components/analytics/TrackClick";
import { EVENTS } from "@/lib/analytics";

/* Plain <a> for the hash links: from "/" they scroll in place, from any other
   route they load home at that section. */
export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-canvas/85 backdrop-blur-md">
      <nav
        aria-label={NAV.brand}
        className="mx-auto flex h-16 w-full max-w-(--max-shell) items-center justify-between gap-4 px-4 md:px-10"
      >
        <Link href="/" aria-label={NAV.brand} className="flex shrink-0 items-center gap-2.5">
          <Logo sizes="32px" className="h-7 w-auto md:h-8" />
          <span className="hidden font-display text-base font-semibold tracking-tight text-ink sm:block">
            {NAV.brand}
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {NAV.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 font-sans text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <TrackClick event={EVENTS.ctaClickNav}>
            <a
              href={NAV.cta.href}
              className="ml-1 rounded-md bg-accent-solid px-4 py-2 font-sans text-sm font-medium text-accent-ink transition-colors hover:bg-accent-dim"
            >
              {NAV.cta.label}
            </a>
          </TrackClick>
        </div>
      </nav>
    </header>
  );
}
