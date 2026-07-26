"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";

gsap.registerPlugin(GSAPSplitText);

type SplitType = "chars" | "words" | "lines" | "words,chars";

type SplitTextProps = {
  text: string;
  className?: string;
  /** stagger between targets, in ms (react-bits' units) */
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitType;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  /** fraction of the element that must be in view before it fires */
  threshold?: number;
  tag?: "p" | "span" | "h1" | "h2" | "h3";
  /** offsets the whole stagger, so several splits can read as one sentence */
  startDelay?: number;
};

/** react-bits SplitText, ported to TS and to this project's deps: gsap ships
 *  SplitText and ScrollTrigger in the package we already have, so nothing new
 *  is installed and useGSAP (@gsap/react) is a plain effect instead.
 *  Reduced motion skips the split entirely — the text just is. */
export function SplitText({
  text,
  className = "",
  delay = 40,
  duration = 1.1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 28 },
  to = { opacity: 1, y: 0 },
  threshold = 0.15,
  tag: Tag = "span",
  startDelay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: GSAPSplitText | null = null;
    let tween: gsap.core.Tween | null = null;
    let io: IntersectionObserver | null = null;
    let cancelled = false;

    // Fonts first: splitting before the real face loads measures the fallback
    // and every char lands a few pixels off.
    const run = () => {
      if (cancelled || !el.isConnected) return;
      split = new GSAPSplitText(el, {
        type: splitType,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
      });
      const targets =
        (splitType.includes("chars") && split.chars.length && split.chars) ||
        (splitType.includes("words") && split.words.length && split.words) ||
        split.lines;

      // Hidden until seen. IntersectionObserver, not ScrollTrigger: Lenis owns
      // the scroll and is not wired into ScrollTrigger's ticker, so a
      // ScrollTrigger here never fires and the text sits at opacity 0 (or, as
      // it did, just appears with no animation at all).
      gsap.set(targets, from);
      io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io?.disconnect();
          tween = gsap.to(targets, {
            ...to,
            duration,
            ease,
            delay: startDelay,
            stagger: delay / 1000,
            force3D: true,
          });
        },
        { threshold },
      );
      io.observe(el);
    };

    document.fonts.ready.then(run).catch(run);

    return () => {
      cancelled = true;
      io?.disconnect();
      tween?.kill();
      split?.revert();
    };
    // `from`/`to` are object literals at every call site; stringify or the
    // effect tears the split down on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, delay, duration, ease, splitType, threshold, startDelay, JSON.stringify(from), JSON.stringify(to)]);

  return (
    <Tag ref={ref as React.Ref<HTMLElement & HTMLParagraphElement>} className={className}>
      {text}
    </Tag>
  );
}

export default SplitText;
