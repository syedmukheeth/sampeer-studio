import Image from "next/image";
import mark from "../../public/logo-mark.png";
import { NAV } from "@/lib/content";

/** The horizontal brand lockup: ribbon, wordmark, tagline.
 *
 *  This exists because `logo-full.png` could not be used on the page. That
 *  raster is a lockup built for a black background, so its wordmark is baked in
 *  at #d6d6d6 silver. On the paper canvas that measures 1.3:1, which is not a
 *  faint logo, it is an invisible one, and it shipped that way. It also still
 *  reads "sampeer studio" in the old lowercase.
 *
 *  So only the ribbon comes from artwork. `logo-mark.png` carries a real alpha
 *  channel, which makes it the original mark rather than a redraw of it, and it
 *  drops onto any ground. The wordmark and tagline are live text in the theme's
 *  own ink and muted tokens, which means the lockup is legible on paper and
 *  inside `.stage` without a second file, stays crisp at any size, and gives
 *  search and screen readers real words instead of pixels.
 *
 *  Proportions follow the supplied artwork: the ribbon stands roughly three
 *  times the height of the text block, the tagline sits at about 40% of the
 *  wordmark, and the two lines are centred against the ribbon. The tagline is
 *  set a little larger than a strict scale-down would give it, because at true
 *  proportion it falls under 7px in the footer and stops being readable. */
export function LogoLockup({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 md:gap-4 ${className}`}>
      <Image
        src={mark}
        alt=""
        aria-hidden
        priority={false}
        sizes="80px"
        className="h-14 w-auto shrink-0 md:h-[4.5rem]"
      />
      <div className="font-[family-name:var(--font-poppins)] leading-none">
        <div className="text-lg font-medium tracking-[-0.01em] text-ink md:text-2xl">
          {NAV.brand}
        </div>
        <div className="mt-1.5 text-[10px] font-normal tracking-[0.005em] text-muted md:mt-2 md:text-[13px]">
          Get noticed. Remembered. Chosen
        </div>
      </div>
    </div>
  );
}
