"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, X } from "@phosphor-icons/react/dist/ssr";
import { REVIEWS_HEADER, type Review } from "@/lib/content";
import { DUR, EASE, SPRING } from "@/lib/constants";

type LenisLike = { stop: () => void; start: () => void };

/* The review theatre: one client at a time, full screen, with sound.

   The frame is the same `layoutId` as the card it was opened from, so the card
   grows into the player and shrinks back into its place on close (Motion's
   shared layout; reduced motion turns that into a cut via the MotionConfig in
   Reviews). It is a real modal: everything behind it is `inert`, Lenis stops,
   Escape closes, the arrow keys step through the reviews, focus starts on the
   close button and returns to the card that opened it. Captions are on by
   default; the transcript sits under the quote. */
export function ReviewTheatre({
  reviews,
  index,
  onClose,
  onIndex,
}: {
  reviews: Review[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  // the portal targets <body>, which only exists on the client
  const client = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const open = index !== null;
  const review = open ? reviews[index] : null;

  // modal behaviour while open: the overlay is portalled straight into
  // <body>, so everything else at that level goes inert
  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    const siblings = Array.from(document.body.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== overlay && !el.hasAttribute("inert"),
    );
    siblings.forEach((el) => el.setAttribute("inert", ""));
    const lenis = (window as unknown as { lenis?: LenisLike }).lenis;
    lenis?.stop();
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      siblings.forEach((el) => el.removeAttribute("inert"));
      root.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [open]);

  // keys
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && reviews.length > 1) onIndex(((index ?? 0) + 1) % reviews.length);
      else if (e.key === "ArrowLeft" && reviews.length > 1) onIndex(((index ?? 0) - 1 + reviews.length) % reviews.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, index, reviews.length, onClose, onIndex]);

  // start each review from the top, with sound; the click that opened the
  // theatre is the user gesture that allows it
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !review) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  }, [review]);

  if (!client) return null;

  return createPortal(
    <AnimatePresence>
      {review ? (
        <motion.div
          ref={overlayRef}
          key="theatre"
          role="dialog"
          aria-modal="true"
          aria-label={`${review.name}, ${review.business}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.base, ease: EASE.out }}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-canvas/95 backdrop-blur-xl"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={REVIEWS_HEADER.close}
            className="btn-press fixed top-4 right-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-line bg-elevated/80 text-ink backdrop-blur-md hover:border-accent-text md:top-6 md:right-6"
          >
            <X size={18} weight="bold" aria-hidden />
          </button>

          <div className="mx-auto grid min-h-full w-full max-w-6xl content-center items-center gap-8 px-4 py-20 md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:gap-12">
            {/* width follows the height cap, so a tall video stays tall instead
                of being squeezed into a box of the wrong shape */}
            <motion.div
              layoutId={`review-${review.slug}`}
              transition={SPRING.theatre}
              style={
                {
                  aspectRatio: `${review.w} / ${review.h}`,
                  borderRadius: 16,
                  "--ar": review.w / review.h,
                } as React.CSSProperties
              }
              className="relative mx-auto w-[min(100%,calc(70svh*var(--ar)))] overflow-hidden bg-elevated lg:w-[min(100%,calc(80svh*var(--ar)))]"
            >
              <video
                key={review.slug}
                ref={videoRef}
                src={review.video}
                poster={review.poster}
                controls
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full bg-canvas object-contain"
              >
                <track kind="captions" src={review.captions} srcLang="en" label="English" default />
                {review.original ? (
                  <track
                    kind="subtitles"
                    src={review.original.src}
                    srcLang={review.original.lang}
                    label={review.original.label}
                  />
                ) : null}
              </video>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.slow, ease: EASE.out, delay: DUR.fast }}
              className="min-w-0"
            >
              <p className="font-mono text-xs text-accent-text">
                {review.business} · {review.place}
              </p>
              <h2 className="mt-3 font-display text-3xl leading-tight font-[650] tracking-[-0.025em] text-ink font-stretch-semi-expanded">
                {review.name}
              </h2>
              <blockquote className="mt-6 font-display text-xl leading-snug font-medium tracking-[-0.01em] text-ink">
                <span aria-hidden className="text-accent-text">“</span>
                {review.quote}
                <span aria-hidden className="text-accent-text">”</span>
              </blockquote>
              {review.translatedFrom ? (
                <p className="mt-3 font-mono text-xs text-faint">
                  {REVIEWS_HEADER.translated} {review.translatedFrom}
                </p>
              ) : null}

              <details className="group mt-6 border-t border-line pt-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-sans text-sm font-medium text-ink">
                  {REVIEWS_HEADER.transcript}
                  <ArrowRight
                    size={14}
                    weight="bold"
                    aria-hidden
                    className="text-muted transition-transform duration-300 group-open:rotate-90"
                  />
                </summary>
                <p className="mt-3 max-h-56 overflow-y-auto pr-2 font-sans text-sm leading-relaxed whitespace-pre-line text-muted">
                  {review.transcript}
                </p>
              </details>

              {reviews.length > 1 ? (
                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onIndex((index! - 1 + reviews.length) % reviews.length)}
                    aria-label={REVIEWS_HEADER.prev}
                    className="btn-press grid h-11 w-11 place-items-center rounded-full border border-line text-ink hover:border-accent-text"
                  >
                    <ArrowLeft size={16} weight="bold" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => onIndex((index! + 1) % reviews.length)}
                    aria-label={REVIEWS_HEADER.next}
                    className="btn-press grid h-11 w-11 place-items-center rounded-full border border-line text-ink hover:border-accent-text"
                  >
                    <ArrowRight size={16} weight="bold" aria-hidden />
                  </button>
                  <span className="ml-1 font-mono text-xs text-faint tabular-nums">
                    {index! + 1} / {reviews.length}
                  </span>
                </div>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

function noop() {
  return () => {};
}
