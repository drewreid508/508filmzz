"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Scroll parallax. `distance` is the total travel in pixels across the element's
 * full pass through the viewport.
 */
export function Parallax({
  children,
  className,
  distance = 80,
  scale = 1,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);
  const s = useTransform(scrollYProgress, [0, 0.5, 1], [scale, 1, scale]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div style={{ y, scale: scale === 1 ? undefined : s }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}
