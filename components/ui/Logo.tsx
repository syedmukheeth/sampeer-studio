import Image from "next/image";
import logo from "../../public/logo-full.png";

/** The full Sampeer lockup — glowing S-mark over the "sampeer studio" wordmark
 *  and tagline, trimmed tight to its glow. This is the brand's primary signature
 *  and is used whole (never re-typeset) in the nav, hero, and footer.
 *
 *  The art ships with a real alpha channel (black ground → transparent, glow and
 *  wordmark kept), so it drops onto any dark surface — the nav's blurred header,
 *  the hero noise field, the footer — with no framed rectangle and no blend hack.
 *
 *  Static import carries the intrinsic 877x737 ratio; size each placement with a
 *  width utility + `h-auto` (or the reverse) and let aspect ratio hold. */
export function Logo({
  className = "",
  sizes,
  priority = false,
}: {
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="Sampeer Studio"
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
