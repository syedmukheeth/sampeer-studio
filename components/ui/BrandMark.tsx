/**
 * Placeholder brand glyph — an indigo ribbon "S" echoing the logo lockup.
 * DEMO: swap for the real standalone S-mark (SVG) when it lands. One file.
 */
export function BrandMark({
  size = 26,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
    >
      <defs>
        <linearGradient id="sampeer-mark" x1="6" y1="3" x2="26" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b8ff" />
          <stop offset="0.55" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d4de0" />
        </linearGradient>
      </defs>
      <path
        d="M22.5 7.5C22.5 4.7 17.8 3.5 14 4.6C10.4 5.6 9 8.4 10.4 11C12 14 22 13.7 22 19.2C22 24.8 16 27.8 11 26"
        stroke="url(#sampeer-mark)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
