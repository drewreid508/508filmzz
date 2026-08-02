"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, Calendar } from "lucide-react";
import { site } from "@/data/site";
import { useScrolledPastViewport } from "@/lib/use-scrolled-past";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Persistent booking CTA. Appears once the hero is behind you and stays put.
 * Hidden on the booking pages themselves, where it would just be noise.
 */
export function StickyCta() {
  const pathname = usePathname();
  const scrolledPastHero = useScrolledPastViewport(0.7);

  // Suppressed on the booking pages, where a second CTA is just noise.
  const visible = scrolledPastHero && !pathname.startsWith("/contact");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="fixed inset-x-0 bottom-0 z-70 flex justify-center px-4 pb-4 md:right-8 md:bottom-8 md:left-auto md:px-0 md:pb-0"
        >
          <div className="flex w-full gap-2 md:w-auto">
            {/* Tap-to-call is the fastest path on a phone, so it leads on mobile. */}
            <a
              href={`tel:${site.phoneE164}`}
              className="flex h-14 w-14 shrink-0 items-center justify-center border border-line-strong bg-ink/85 backdrop-blur-xl transition-colors duration-500 hover:border-accent hover:text-accent md:hidden"
              aria-label={`Call 508 Filmzz on ${site.phone}`}
            >
              <Phone size={17} strokeWidth={1.5} aria-hidden="true" />
            </a>

            <Link
              href="/contact"
              className="group flex h-14 flex-1 items-center justify-center gap-3 bg-bone px-7 text-[0.7rem] font-medium tracking-[0.22em] text-ink uppercase shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors duration-500 hover:bg-accent hover:text-white md:flex-none"
              data-cursor="hover"
            >
              <Calendar
                size={14}
                strokeWidth={1.6}
                aria-hidden="true"
                className="transition-transform duration-500 group-hover:-translate-y-px"
              />
              Book a Shoot
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
