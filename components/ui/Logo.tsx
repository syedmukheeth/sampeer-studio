import Image from "next/image";
import full from "../../public/logo-full.png";
import mark from "../../public/logo-mark.png";

/** The Sampeer brand signature, two cuts of one lockup:
 *   - `full`  — horizontal mark + "sampeer studio" wordmark + tagline. The
 *               footer signature, given room to read.
 *   - `mark`  — the S-ribbon alone. Stays crisp and iconic at nav size, where
 *               a full lockup with a tagline would collapse to mush.
 *
 *  Both ship with a real alpha channel (white ground removed), so they drop
 *  onto any dark surface — the blurred nav header, the footer — with no framed
 *  rectangle and no blend hack. Never re-typeset; size with a width/height
 *  utility + the paired `-auto` and let the intrinsic ratio hold. */
export function Logo({
  variant = "full",
  className = "",
  sizes,
  priority = false,
}: {
  variant?: "full" | "mark";
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={variant === "mark" ? mark : full}
      alt="Sampeer Studio"
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
