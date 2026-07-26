"use client";

import type { CSSProperties, ReactNode } from "react";

type GlitchTextProps = {
  children: string;
  /** multiplier on both channel durations */
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
};

/** react-bits GlitchText, repaletted to the brand: the two offset channels
 *  are sage and warm grey, not red/cyan, and the mask behind them is the paper
 *  canvas so the effect reads on a light ground. Styles live in globals.css. */
export function GlitchText({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = false,
  className = "",
}: GlitchTextProps): ReactNode {
  const style = {
    "--after-duration": `${speed * 3}s`,
    "--before-duration": `${speed * 2}s`,
    "--after-shadow": enableShadows ? "-3px 0 var(--color-accent)" : "none",
    "--before-shadow": enableShadows ? "3px 0 var(--color-muted)" : "none",
  } as CSSProperties;

  return (
    <span
      className={`glitch ${enableOnHover ? "enable-on-hover" : ""} ${className}`}
      style={style}
      data-text={children}
    >
      {children}
    </span>
  );
}

export default GlitchText;
