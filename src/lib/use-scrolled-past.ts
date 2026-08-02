"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * True once the page is scrolled past `threshold` pixels.
 *
 * Uses useSyncExternalStore so the first value is read during render rather
 * than written back through an effect.
 */
export function useScrolledPast(threshold: number) {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange, { passive: true });
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false
  );
}

/** Variant that measures against a fraction of the viewport height. */
export function useScrolledPastViewport(fraction: number) {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange, { passive: true });
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > window.innerHeight * fraction,
    () => false
  );
}
