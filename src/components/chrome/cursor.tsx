"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * A single hairline ring that trails the pointer and swells over interactive
 * elements. Fine-pointer devices only — never shown on touch.
 */
export function Cursor() {
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(pointer: fine)");
  const enabled = finePointer && !reduced;

  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 480, damping: 40, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 480, damping: 40, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as HTMLElement | null;
      setActive(
        Boolean(
          target?.closest(
            "a, button, [data-cursor='hover'], input, textarea, select, [role='button']"
          )
        )
      );
    };
    const leave = () => setVisible(false);

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-90 hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border"
        animate={{
          width: active ? 54 : 22,
          height: active ? 54 : 22,
          opacity: visible ? (active ? 1 : 0.55) : 0,
          borderColor: active ? "#1e90ff" : "rgba(255,255,255,0.5)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
      />
    </motion.div>
  );
}
