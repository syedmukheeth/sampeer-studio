import { useCallback, useSyncExternalStore } from "react";

/** A CSS media query as React state, read without an effect. The server (and
 *  hydration) always sees `false`, so anything gated on it renders the same
 *  markup everywhere and only switches on after the client has checked. */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** A mouse or trackpad: something that can hover and point precisely. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
