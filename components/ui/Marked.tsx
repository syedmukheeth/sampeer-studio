import type { MarkedText } from "@/lib/content";

/** A line with its one marked phrase: the part that answers the problem,
 *  in orange, the site's chapter motif. `<mark>` is the honest element (text
 *  highlighted for its relevance); `.mark` in globals.css resets the browser's
 *  yellow box and sets the phrase in orange instead. */
export function Marked({ text }: { text: MarkedText }) {
  return (
    <>
      {text.before}
      <mark className="mark">{text.mark}</mark>
      {text.after}
    </>
  );
}
