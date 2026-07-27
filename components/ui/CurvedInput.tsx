"use client";

import type { ReactNode } from "react";

/**
 * A curved frame for a form control.
 *
 * Purely presentational: it takes the real `<input>` or `<textarea>` as
 * children and draws the border for it. The control keeps every one of its own
 * attributes, so validation, autofill, the honeypot and the submit handler in
 * ContactForm are untouched by the treatment, and the field is still a plain
 * form control to the browser and to a screen reader.
 *
 * The curve is a `viewBox` path with `preserveAspectRatio="none"`, which means
 * the browser scales it to whatever width the field ends up at. No measuring,
 * no ResizeObserver, no rAF, nothing to recalculate on resize.
 *
 * Focus is deliberately doubled. The stroke recolours through
 * `group-focus-within`, but a decorative SVG stroke is invisible to Windows
 * High Contrast and reads as nothing to assistive tech, so the wrapper also
 * keeps a real ring in the same accent. The stroke is the flourish; the ring is
 * the indicator.
 */
export function CurvedInput({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group relative rounded-[1.75rem] transition-shadow duration-300 focus-within:ring-2 focus-within:ring-accent/40 ${className}`.trim()}
    >
      <svg
        aria-hidden
        viewBox="0 0 400 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        {/* one continuous rounded path whose top and bottom edges bow outward,
            so the field reads as a lens rather than a rectangle */}
        <path
          d="M28 6 Q200 -6 372 6 Q394 12 394 50 Q394 88 372 94 Q200 106 28 94 Q6 88 6 50 Q6 12 28 6 Z"
          fill="var(--color-elevated)"
          stroke="var(--color-line)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          className="transition-[stroke] duration-300 group-focus-within:stroke-[var(--color-accent)]"
        />
      </svg>
      {/* the control sits above the drawing and provides the box's height */}
      <div className="relative">{children}</div>
    </div>
  );
}

export default CurvedInput;
