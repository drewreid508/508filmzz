"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so scroll-linked animations
 * and the scroll position never fall out of sync.
 *
 * ── Not on phones, deliberately ────────────────────────────────────────────
 * Lenis works by calling preventDefault() on wheel and touch events and then
 * moving the page itself, one requestAnimationFrame at a time. A browser stops
 * firing rAF the moment its tab is backgrounded — switch apps on a phone, take
 * a call, glance at a text — and on return the gesture handler is still
 * swallowing touches while nothing is left to act on them. The page accepts
 * your finger and does not move. The only way out is a reload, which is
 * exactly what was happening.
 *
 * Measured on the live site with rAF throttled: six wheel events, zero pixels
 * of movement, and <html> stuck in the `lenis-scrolling` state.
 *
 * A phone already has better inertial scrolling than this library emulates, so
 * the fix is not to patch the resume path but to leave native scrolling alone
 * on touch devices. That also drops a per-frame JavaScript loop from the
 * hardware least able to spare it. Desktop keeps the eased wheel, plus the
 * visibility handling below for a tab left in the background there.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const enabledRef = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /*
      Coarse pointer means a finger. This catches phones and tablets, including
      iPads reporting a desktop user agent, and correctly leaves a laptop with
      a touchscreen on the smooth path — it still has a wheel, and hover-capable
      is what separates the two.
    */
    const touch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

    if (reduced || touch) return;

    gsap.registerPlugin(ScrollTrigger);
    enabledRef.current = true;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /*
      Recovery for a desktop tab that was in the background.

      While hidden there are no frames, so Lenis is stopped rather than left
      accepting gestures it cannot act on. On the way back its clock is cleared
      first: Lenis derives its step from `time - this.time`, and resuming with
      a stale stamp hands it the entire hidden duration as one delta.
      ScrollTrigger is refreshed afterwards because layout may have changed
      while nobody was looking.
    */
    const onVisibility = () => {
      if (document.hidden) {
        lenis.stop();
        return;
      }
      lenis.time = 0;
      lenis.start();
      lenis.resize();
      ScrollTrigger.refresh();
    };

    /*
      Back/forward cache. Safari restores a whole live page from memory without
      re-running any of this, and `persisted` is the only signal that it did.
    */
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) onVisibility();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
      enabledRef.current = false;
    };
  }, []);

  // Jump to the top on route change — Lenis holds scroll position otherwise.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    // Only when the plugin was actually registered. On a phone, and under
    // reduced motion, ScrollTrigger is never set up and this would throw.
    if (enabledRef.current) ScrollTrigger.refresh();
  }, [pathname]);

  return <>{children}</>;
}
