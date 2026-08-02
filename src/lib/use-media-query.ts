"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without a setState-in-effect round trip.
 * Returns `serverValue` during SSR and the first hydration pass.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query]
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue
  );
}
