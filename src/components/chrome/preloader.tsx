"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

const EASE = [0.83, 0, 0.17, 1] as const;
const KEY = "508-intro";
const DURATION = 1500;

/** Session-scoped flag, read without a setState-in-effect round trip. */
function useIntroSeen() {
  const subscribe = useCallback(() => () => {}, []);
  return useSyncExternalStore(
    subscribe,
    () => {
      try {
        return sessionStorage.getItem(KEY) === "seen";
      } catch {
        return true;
      }
    },
    // On the server, assume it has been seen so nothing is streamed into the
    // markup. The client re-renders with the real value after hydration.
    () => true
  );
}

/**
 * Opening curtain. Counts to 100, then lifts away to reveal the hero. Shown
 * once per browser session so repeat navigations stay instant.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const introSeen = useIntroSeen();
  const [finished, setFinished] = useState(false);
  const [count, setCount] = useState(0);

  const showing = !introSeen && !reduced && !finished;

  useEffect(() => {
    if (!showing) return;

    document.body.style.overflow = "hidden";
    const started = performance.now();
    let frame = 0;

    const tick = () => {
      const t = Math.min(1, (performance.now() - started) / DURATION);
      // Ease-out so the numbers sprint, then settle.
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));

      if (t < 1) {
        frame = requestAnimationFrame(tick);
        return;
      }
      try {
        sessionStorage.setItem(KEY, "seen");
      } catch {
        /* private mode — the intro simply plays again next time */
      }
      setFinished(true);
    };

    frame = requestAnimationFrame(tick);

    /*
     * Safety net. The counter is driven by requestAnimationFrame, which some
     * browsers throttle to a standstill — a backgrounded tab, iOS low-power
     * mode, a heavily loaded device. If that happens the curtain never lifts
     * and the visitor is left staring at a black screen with the site behind
     * it. This guarantees it always clears, whatever the frame loop does.
     */
    const failsafe = window.setTimeout(() => {
      try {
        sessionStorage.setItem(KEY, "seen");
      } catch {
        /* private mode */
      }
      setCount(100);
      setFinished(true);
    }, DURATION + 2000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(failsafe);
      document.body.style.overflow = "";
    };
  }, [showing]);

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          className="fixed inset-0 z-100 flex flex-col justify-between bg-ink px-6 py-8 md:px-12 md:py-10"
          exit={{ y: "-100%", transition: { duration: 1, ease: EASE } }}
          aria-hidden="true"
        >
          <div className="flex items-baseline justify-between">
            <span className="display text-2xl md:text-3xl">508 Filmzz</span>
            <span className="eyebrow">Loading</span>
          </div>

          <div className="flex items-end justify-between gap-6">
            <span className="eyebrow shrink-0 whitespace-nowrap">
              {site.tagline}
            </span>
            <span className="display text-[18vw] leading-[0.78] md:text-[11vw]">
              {String(count).padStart(3, "0")}
            </span>
          </div>

          <div className="absolute right-0 bottom-0 left-0 h-px bg-line">
            <motion.div
              className="h-full bg-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: count / 100 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
