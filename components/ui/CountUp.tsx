"use client";

/** Static proof value renderer. It keeps the old CountUp API so sections do
 *  not need to know whether a stat is numeric or verbatim, but it no longer
 *  starts at zero and waits for scroll to reveal the real number. */
export function CountUp({
  value,
  suffix = "",
  decimals = 0,
  text,
  className,
}: {
  value?: number;
  suffix?: string;
  decimals?: number;
  text?: string;
  className?: string;
}) {
  const format = (v: number) =>
    decimals > 0
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString("en-US");

  return (
    <span className={className}>
      {text ?? format(value ?? 0)}
      {suffix}
    </span>
  );
}
