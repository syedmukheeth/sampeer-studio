/** Minimal structural type for the Lenis instance we stash on window.
 *  Avoids depending on the package's default-export type shape. */
interface LenisLike {
  on: (event: "scroll", cb: () => void) => void;
  off: (event: "scroll", cb: () => void) => void;
  raf: (time: number) => void;
  destroy: () => void;
}

declare global {
  interface Window {
    lenis?: LenisLike;
  }
}

export {};
