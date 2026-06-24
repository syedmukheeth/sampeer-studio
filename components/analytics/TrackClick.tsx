"use client";

import { track } from "@/lib/analytics";

/** Fires a named event on click. Wrap CTAs. Does not swallow the click. */
export function TrackClick({
  event,
  children,
  className,
}: {
  event: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={className} onClick={() => track(event)}>
      {children}
    </span>
  );
}
