"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import type { HeroSearch } from "@/lib/content";
import { SEARCH } from "@/lib/constants";

/* The cold open's search. It types what real customers of our clients type,
   one search after another, and under each names who they find.

   The server renders the first search whole, and so does the first client
   render, so hydration never disagrees. After mount it runs one round through
   the searches (erase, type, hold) and settles back on the first, then the
   caret stops blinking: moving content that ends on its own, well inside a
   screen's attention. It holds still while hovered or focused, while off
   screen, and never moves at all under reduced motion. Screen readers get the
   searches once, as a plain sentence, not the typing. */

export function SearchLine({ searches, findsLabel }: { searches: readonly HeroSearch[]; findsLabel: string }) {
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(searches[0].query.length);
  const [running, setRunning] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const held = useRef(false);
  const visible = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
    });
    if (el) io.observe(el);

    let timer = 0;
    let i = 0;
    let n = searches[0].query.length;
    const steps = searches.length; // a full round ends back on the first
    let done = 0;

    const later = (fn: () => void, ms: number) => {
      timer = window.setTimeout(() => {
        // a held line waits; it does not lose its place
        if (held.current || !visible.current || document.hidden) later(fn, 400);
        else fn();
      }, ms);
    };

    const erase = () => {
      if (n > 0) {
        n -= 1;
        setChars(n);
        later(erase, SEARCH.erase);
      } else {
        i = (i + 1) % searches.length;
        setIndex(i);
        later(type, SEARCH.gap);
      }
    };
    const type = () => {
      const full = searches[i].query.length;
      if (n < full) {
        n += 1;
        setChars(n);
        // a person types unevenly; a fixed beat reads as a machine
        later(type, SEARCH.type + Math.round(Math.random() * SEARCH.jitter));
      } else {
        done += 1;
        if (done >= steps) {
          setRunning(false);
          return;
        }
        later(erase, SEARCH.hold);
      }
    };

    timer = window.setTimeout(() => {
      setRunning(true);
      later(erase, 0);
    }, SEARCH.first);

    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, [searches]);

  const current = searches[index];
  const hold = () => {
    held.current = true;
  };
  const release = () => {
    held.current = false;
  };

  return (
    <div ref={root} className="@container min-w-0" onPointerEnter={hold} onPointerLeave={release}>
      <p className="sr-only">
        Customers search for things like {searches.map((s) => `"${s.query}"`).join(", ")}.
      </p>
      <p
        aria-hidden
        className="min-h-[2.1em] border-b border-line pb-3 font-serif text-[min(10.5cqi,5.5rem)] leading-[1.05] font-normal text-ink"
      >
        {current.query.slice(0, chars)}
        <span className="search-caret" data-blink={running ? "true" : "false"} />
      </p>
      <a
        href={current.href}
        onFocus={hold}
        onBlur={release}
        className="group mt-4 inline-flex items-center gap-2 font-sans text-sm text-muted transition-colors hover:text-ink md:text-base"
      >
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
        {findsLabel}
        <span className="font-medium text-ink">{current.finds}</span>
        <ArrowDown
          size={14}
          weight="bold"
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-y-0.5"
        />
      </a>
    </div>
  );
}
