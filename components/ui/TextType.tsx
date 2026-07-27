"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

type TextTypeProps = {
  text: string | string[];
  className?: string;
  /** ms per character */
  typingSpeed?: number;
  deletingSpeed?: number;
  /** ms held at the end of a phrase before it deletes */
  pauseDuration?: number;
  initialDelay?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorCharacter?: string;
  /** wait until the element is on screen before the first character */
  startOnVisible?: boolean;
  /** Externally controlled start. Use when something else already decides the
   *  moment (a panel entering view), so the typing and whatever follows it are
   *  driven by one trigger instead of two observers that can disagree. */
  start?: boolean;
  /** Hold the finished string's box from the start so the text below does not
   *  jump line by line as the heading types. Only sane for a single phrase -
   *  a rotating list has no one final size. */
  reserveSpace?: boolean;
};

/** react-bits TextType, trimmed to the props this site uses and made
 *  accessible: the typed characters are decorative, so the full string is
 *  exposed once via aria-label and the animating span is hidden from the
 *  accessibility tree, a screen reader should not hear a heading arrive one
 *  letter at a time. Reduced motion prints the text immediately. */
export function TextType({
  text,
  className = "",
  typingSpeed = 45,
  deletingSpeed = 25,
  pauseDuration = 2200,
  initialDelay = 0,
  loop = false,
  showCursor = true,
  cursorCharacter = "|",
  startOnVisible = false,
  start,
  reserveSpace,
}: TextTypeProps) {
  const phrases = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const full = phrases.join(" ");

  const reduce = useReducedMotion();
  const [seen, setSeen] = useState(!startOnVisible);
  // an explicit `start` wins over the internal observer
  const visible = start ?? seen;
  const [phrase, setPhrase] = useState(0);
  const [count, setCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!startOnVisible || start !== undefined || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [start, startOnVisible]);

  const current = phrases[phrase] ?? "";

  useEffect(() => {
    if (!visible || reduce) return;

    // typing forward
    if (!deleting) {
      if (count < current.length) {
        const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? initialDelay + typingSpeed : typingSpeed);
        return () => clearTimeout(t);
      }
      // finished the last phrase and not looping: stop, leave it written
      if (!loop && phrase === phrases.length - 1) return;
      const t = setTimeout(() => setDeleting(true), pauseDuration);
      return () => clearTimeout(t);
    }

    // deleting back
    if (count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), deletingSpeed);
      return () => clearTimeout(t);
    }
    // deleted to empty: hand over to the next phrase on the next tick rather
    // than synchronously, so this stays one state update per timer
    const t = setTimeout(() => {
      setDeleting(false);
      setPhrase((p) => (p + 1) % phrases.length);
    }, deletingSpeed);
    return () => clearTimeout(t);
  }, [
    count,
    current.length,
    deleting,
    deletingSpeed,
    initialDelay,
    loop,
    pauseDuration,
    phrase,
    phrases.length,
    reduce,
    typingSpeed,
    visible,
  ]);

  const done = !loop && phrase === phrases.length - 1 && count >= current.length;
  const reserve = reserveSpace ?? phrases.length === 1;

  const typed = (
    <>
      <span aria-hidden style={{ whiteSpace: "pre-wrap" }}>
        {reduce ? current : current.slice(0, count)}
      </span>
      {showCursor && !reduce && !done ? (
        <span aria-hidden className="text-type__cursor">
          {cursorCharacter}
        </span>
      ) : null}
    </>
  );

  if (!reserve) {
    return (
      <span ref={ref} className={className} aria-label={full}>
        {typed}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} aria-label={full} style={{ position: "relative", display: "block" }}>
      {/* the finished string, invisible: it holds the height, the typed copy
          rides on top of it */}
      <span aria-hidden style={{ visibility: "hidden" }}>
        {current}
      </span>
      <span aria-hidden style={{ position: "absolute", inset: 0 }}>
        {typed}
      </span>
    </span>
  );
}

export default TextType;
