/** The S-ribbon mark on its own, for the nav and the intro curtain.
 *
 *  The source PNG is a glossy violet ribbon with a real alpha channel. The
 *  site no longer has a violet anywhere, so the mark is drawn flat in the
 *  current text colour: the PNG is used only as a mask, which keeps its exact
 *  silhouette and lets it follow the ink (bottle green on paper, cream at
 *  night). The file itself is untouched.
 *
 *  Size with a height utility; the width follows the mark's own ratio. */
const RATIO = 281 / 480; // the PNG's real pixels, width / height

export function Logo({ className = "" }: { className?: string; sizes?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block bg-current ${className}`}
      style={{
        aspectRatio: RATIO,
        WebkitMaskImage: "url(/logo-mark.png)",
        maskImage: "url(/logo-mark.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
