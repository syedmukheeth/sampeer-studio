"use client";

import type { CSSProperties } from "react";

type BorderBeamProps = {
  /** px length of the travelling segment */
  size?: number;
  /** seconds for one full lap */
  duration?: number;
  /** seconds before this beam starts — offset siblings so they do not lockstep */
  delay?: number;
  className?: string;
};

/** A light that runs the border of its parent. The parent needs `relative` and
 *  `overflow-hidden`; this paints into the border box via a conic gradient
 *  masked to a one-pixel ring, so it never touches layout or the content.
 *
 *  CSS-driven rather than JS: several of these can be on screen at once, and a
 *  rAF loop each for a decorative outline is exactly the kind of thing that
 *  made this page stutter earlier. */
export function BorderBeam({ size = 60, duration = 6, delay = 0, className = "" }: BorderBeamProps) {
  return (
    <span
      aria-hidden
      className={`border-beam pointer-events-none absolute inset-0 rounded-[inherit] ${className}`.trim()}
      style={
        {
          "--beam-size": `${size}px`,
          "--beam-duration": `${duration}s`,
          "--beam-delay": `${delay}s`,
        } as CSSProperties
      }
    />
  );
}

export default BorderBeam;
