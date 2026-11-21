import type { MarkedText } from "@/lib/content";

/** A line with its one marked word: the gold highlighter stroke that is
 *  the site's chapter motif. `<mark>` is the honest element for it (text
 *  highlighted for its relevance); `.mark` in globals.css resets the browser's
 *  yellow box and draws the stroke under the word instead. */
export function Marked({ text }: { text: MarkedText }) {
  return (
    <>
      {text.before}
      <mark className="mark">{text.mark}</mark>
      {text.after}
    </>
  );
}
