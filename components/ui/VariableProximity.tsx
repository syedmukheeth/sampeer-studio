"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type RefObject,
} from "react";
import { motion } from "motion/react";

type Falloff = "linear" | "exponential" | "gaussian";

type VariableProximityProps = {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: Falloff;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  /** Run the weight bump once on mount, as a wave travelling left to right,
   *  before the pointer takes over. Lets the entrance show the same shape the
   *  hover does, instead of the type arriving flat and only reacting later. */
  introSweep?: boolean;
  /** seconds */
  introDelay?: number;
  introDuration?: number;
  /** Fade the label in a word at a time. Lives here rather than on a wrapper
   *  because the words are already the split unit for the proximity effect. */
  reveal?: boolean;
  revealDelay?: number;
  revealStagger?: number;
};

function useAnimationFrame(callback: () => void) {
  useEffect(() => {
    let frameId = 0;

    const loop = () => {
      callback();
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [callback]);
}

function usePointerPositionRef(containerRef: RefObject<HTMLElement | null>) {
  const positionRef = useRef({ x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY });

  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      positionRef.current = rect ? { x: x - rect.left, y: y - rect.top } : { x, y };
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [containerRef]);

  return positionRef;
}

export const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>(
  function VariableProximity(
    {
      label,
      fromFontVariationSettings,
      toFontVariationSettings,
      containerRef,
      radius = 140,
      falloff = "gaussian",
      className = "",
      onClick,
      style,
      introSweep = false,
      introDelay = 0,
      introDuration = 1.1,
      reveal,
      revealDelay = 0,
      revealStagger = 0.09,
      ...restProps
    },
    ref,
  ) {
    const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const pointerPositionRef = usePointerPositionRef(containerRef);
    const lastPositionRef = useRef({ x: NaN, y: NaN });
    const introStartRef = useRef<number | null>(null);
    // Not seeded from introSweep: callers flip it on once the section is ready,
    // so it is false on the first render and seeding would skip the sweep.
    const introDoneRef = useRef(false);

    const parsedSettings = useMemo(() => {
      const parseSettings = (settings: string) =>
        new Map(
          settings
            .split(",")
            .map((setting) => setting.trim())
            .map((setting) => {
              const [name, value] = setting.split(" ");
              return [name.replace(/['"]/g, ""), Number.parseFloat(value)] as const;
            }),
        );

      const fromSettings = parseSettings(fromFontVariationSettings);
      const toSettings = parseSettings(toFontVariationSettings);

      return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
        axis,
        fromValue,
        toValue: toSettings.get(axis) ?? fromValue,
      }));
    }, [fromFontVariationSettings, toFontVariationSettings]);

    const calculateFalloff = useCallback(
      (distance: number) => {
        const normalized = Math.min(Math.max(1 - distance / radius, 0), 1);

        if (falloff === "exponential") return normalized ** 2;
        if (falloff === "gaussian") return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
        return normalized;
      },
      [falloff, radius],
    );

    const settingsFor = useCallback(
      (strength: number) =>
        parsedSettings
          .map(({ axis, fromValue, toValue }) => {
            const value = fromValue + (toValue - fromValue) * strength;
            return `'${axis}' ${value.toFixed(2)}`;
          })
          .join(", "),
      [parsedSettings],
    );

    const updateLetters = useCallback(() => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      // Entrance: a virtual pointer crosses the line once. It runs on the same
      // per-letter falloff as the hover, so both effects are literally the same
      // gesture — one automatic, one under the cursor.
      if (introSweep && !introDoneRef.current) {
        const now = performance.now();
        introStartRef.current ??= now;
        const t = (now - introStartRef.current) / 1000 - introDelay;

        if (t < 0) return;

        const progress = Math.min(t / introDuration, 1);
        // start and end off the ends, so the first and last letters get a full
        // pass rather than opening mid-bump
        const sweepX = -radius + progress * (containerRect.width + radius * 2);

        letterRefs.current.forEach((letter) => {
          if (!letter) return;
          const rect = letter.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2 - containerRect.left;
          const distance = Math.abs(sweepX - centerX);
          letter.style.fontVariationSettings =
            distance >= radius ? fromFontVariationSettings : settingsFor(calculateFalloff(distance));
        });

        if (progress >= 1) {
          introDoneRef.current = true;
          // force the first pointer pass to recompute
          lastPositionRef.current = { x: NaN, y: NaN };
        }
        return;
      }

      const { x, y } = pointerPositionRef.current;
      if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) return;

      lastPositionRef.current = { x, y };

      letterRefs.current.forEach((letter) => {
        if (!letter) return;

        const rect = letter.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2 - containerRect.left;
        const centerY = rect.top + rect.height / 2 - containerRect.top;
        const distance = Math.hypot(x - centerX, y - centerY);

        if (distance >= radius) {
          letter.style.fontVariationSettings = fromFontVariationSettings;
          return;
        }

        letter.style.fontVariationSettings = settingsFor(calculateFalloff(distance));
      });
    }, [
      calculateFalloff,
      containerRef,
      fromFontVariationSettings,
      introDelay,
      introDuration,
      introSweep,
      pointerPositionRef,
      radius,
      settingsFor,
    ]);

    useAnimationFrame(updateLetters);

    let letterIndex = 0;
    const words = label.split(" ");

    return (
      <span
        ref={ref}
        className={`variable-proximity ${className}`}
        onClick={onClick}
        style={style}
        aria-label={label}
        {...restProps}
      >
        {words.map((word, wordIndex) => (
          <motion.span
            key={`${word}-${wordIndex}`}
            aria-hidden
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
            initial={reveal === undefined ? false : { opacity: 0, y: "0.5em", filter: "blur(10px)" }}
            animate={
              reveal === undefined
                ? undefined
                : reveal
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: "0.5em", filter: "blur(10px)" }
            }
            transition={{
              duration: 0.75,
              delay: revealDelay + wordIndex * revealStagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word.split("").map((letter) => {
              const currentLetterIndex = letterIndex++;

              return (
                <motion.span
                  key={`${letter}-${currentLetterIndex}`}
                  ref={(element) => {
                    letterRefs.current[currentLetterIndex] = element;
                  }}
                  style={{
                    display: "inline-block",
                    fontVariationSettings: fromFontVariationSettings,
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
            {wordIndex < words.length - 1 ? <span style={{ display: "inline-block" }}>&nbsp;</span> : null}
          </motion.span>
        ))}
      </span>
    );
  },
);

export default VariableProximity;
