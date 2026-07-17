"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  A_SLIDER,
  A_SLIDER_AFTER,
  A_SLIDER_BEFORE,
} from "@/lib/content-automations";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Flow } from "@/components/ui/Flow";

/** §A4 Drag to compare. Two graphs stacked in one cell; the top one is
 *  revealed by clip-path so the divider reads as a wipe between two versions
 *  of the same business, not two panels side by side.
 *
 *  Pointer handling is manual (pointer events + setPointerCapture) rather than
 *  motion's drag: we need the value in percent of the container to feed
 *  clip-path, and capture means the drag survives the pointer leaving the
 *  element. Keyboard gets a real role="slider" — this is the one control on
 *  the page that would otherwise be mouse-only. */
export function BeforeAfter() {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const next = ((clientX - r.left) / r.width) * 100;
    setPct(Math.min(100, Math.max(0, next)));
  }, []);

  /** Lenis owns the wheel/touch stream page-wide. Without stopping it, a
   *  horizontal drag on touch scrolls the page out from under the handle. */
  useEffect(() => {
    if (!dragging) return;
    window.lenis?.stop();
    return () => window.lenis?.start();
  }, [dragging]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setFromClientX(e.clientX);
  }
  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPct((p) => Math.max(0, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPct((p) => Math.min(100, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPct(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setPct(100);
    }
  }

  return (
    <Section id="compare">
        <SectionHeader title={A_SLIDER.title} />
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted">
          {A_SLIDER.sub}
        </p>

        {/* the wipe is a desktop affordance; mobile gets both steppers plain */}
        <div className="mt-14 hidden md:block">
          <div className="mb-4 flex justify-between font-sans text-xs font-medium uppercase tracking-[0.18em]">
            <span className="text-faint">{A_SLIDER.leftLabel}</span>
            <span className="text-accent">{A_SLIDER.rightLabel}</span>
          </div>

          <div
            ref={box}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`relative grid touch-none overflow-hidden rounded-md border border-line bg-canvas p-8 ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="col-start-1 row-start-1">
              <Flow
                {...A_SLIDER_BEFORE}
                mode="static"
                tone="chaos"
                label={`${A_SLIDER.leftLabel} workflow`}
              />
            </div>

            {/* revealed from the right edge inward as the handle travels */}
            <div
              className="col-start-1 row-start-1 bg-canvas"
              style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
            >
              <Flow
                {...A_SLIDER_AFTER}
                mode={reduce ? "static" : "loop"}
                label={`${A_SLIDER.rightLabel} workflow`}
              />
            </div>

            {/* divider */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-px bg-accent"
              style={{ left: `${pct}%` }}
            />

            <div
              role="slider"
              tabIndex={0}
              aria-label={A_SLIDER.handleLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pct)}
              aria-valuetext={`${Math.round(pct)}% automated`}
              onKeyDown={onKeyDown}
              className="absolute top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent bg-canvas font-sans text-xs text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              style={{ left: `${pct}%` }}
            >
              <span aria-hidden>↔</span>
            </div>
          </div>
        </div>

        {/* mobile */}
        <div className="mt-12 grid gap-10 md:hidden">
          {[
            { label: A_SLIDER.leftLabel, flow: A_SLIDER_BEFORE, chaos: true },
            { label: A_SLIDER.rightLabel, flow: A_SLIDER_AFTER, chaos: false },
          ].map(({ label, flow, chaos }) => (
            <div key={label} className="rounded-md border border-line p-5">
              <p
                className={`mb-4 font-sans text-xs font-medium uppercase tracking-[0.18em] ${
                  chaos ? "text-faint" : "text-accent"
                }`}
              >
                {label}
              </p>
              <Flow
                {...flow}
                mode="static"
                tone={chaos ? "chaos" : "default"}
                label={`${label} workflow`}
              />
            </div>
          ))}
        </div>
    </Section>
  );
}
