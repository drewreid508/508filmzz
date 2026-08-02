"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Route transition — a short blur-dissolve. Deliberately fast: a heavy wipe
 * between pages feels slow after the second click.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, filter: "blur(10px)", y: 12 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(8px)" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
