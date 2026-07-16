/** Minimal structural type for the Lenis instance we stash on window.
 *  Avoids depending on the package's default-export type shape. */
interface LenisLike {
  on: (event: "scroll", cb: () => void) => void;
  off: (event: "scroll", cb: () => void) => void;
  raf: (time: number) => void;
  /** pause/resume the scroll loop — needed so drag gestures (the
   *  automations compare slider) aren't stolen by smooth scrolling */
  stop: () => void;
  start: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    lenis?: LenisLike;
  }
}

export {};
