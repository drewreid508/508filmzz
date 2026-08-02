"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { nav, site } from "@/data/site";
import { cn, pad } from "@/lib/utils";
import { Logo } from "./logo";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();

  /**
   * The menu stores the route it was opened on rather than a boolean, so
   * navigating anywhere closes it without an effect resetting state.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenedOn(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-80 transition-all duration-700",
          scrolled && !open
            ? "border-b border-line bg-ink/72 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <div className="shell flex h-[72px] items-center justify-between md:h-[86px]">
          <Link
            href="/"
            className="text-xl md:text-2xl"
            aria-label={`${site.name} — home`}
          >
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {nav.slice(1, -1).map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative py-2 text-[0.68rem] font-medium tracking-[0.2em] uppercase transition-colors duration-400",
                    active ? "text-bone" : "text-mute hover:text-bone"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-500",
                      active ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden border border-line-strong px-6 py-3 text-[0.66rem] font-medium tracking-[0.2em] uppercase transition-colors duration-500 hover:border-accent hover:text-accent md:inline-block"
            >
              Book a Shoot
            </Link>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-90 flex h-11 w-11 items-center justify-center lg:hidden"
            >
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-bone transition-all duration-500",
                    open ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 block h-px w-full bg-bone transition-all duration-500",
                    open ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-85 flex flex-col justify-between bg-ink px-6 pt-28 pb-10 lg:hidden"
            initial={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            animate={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 + i * 0.045, duration: 0.6, ease: EASE }}
                  className="border-b border-line"
                >
                  <Link
                    href={item.href}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="eyebrow w-8 shrink-0">{pad(i + 1)}</span>
                    <span
                      className={cn(
                        "display text-4xl transition-colors duration-300",
                        pathname === item.href ? "text-accent" : "text-bone"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col gap-2"
            >
              <a href={`mailto:${site.email}`} className="text-sm text-mute">
                {site.email}
              </a>
              <div className="flex gap-5 text-[0.68rem] tracking-[0.2em] text-faint uppercase">
                <a href={site.instagram} target="_blank" rel="noreferrer noopener">
                  Instagram
                </a>
                <a href={site.tiktok} target="_blank" rel="noreferrer noopener">
                  TikTok
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
