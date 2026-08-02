"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic film player. The films are shot vertical, so the modal frames them
 * at their native ratio against black rather than cropping to widescreen.
 */
export function VideoModal({
  src,
  title,
  trigger,
  aspect = 9 / 16,
}: {
  src: string;
  title: string;
  trigger: React.ReactNode;
  aspect?: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-100 bg-ink/94 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-10"
                initial={{ opacity: 0, scale: 0.96, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.97, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <Dialog.Title className="sr-only">{title}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Film player for {title}. Press Escape to close.
                </Dialog.Description>

                <div
                  className="relative h-full max-h-[86vh] w-auto"
                  style={{ aspectRatio: aspect }}
                >
                  <video
                    src={src}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full bg-black object-contain"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-3 -left-3 h-8 w-8 border-t border-l border-accent"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-3 -bottom-3 h-8 w-8 border-r border-b border-accent"
                  />
                </div>

                <Dialog.Close asChild>
                  <button
                    className="absolute top-5 right-5 flex h-12 w-12 items-center justify-center border border-line-strong transition-colors duration-400 hover:border-accent hover:text-accent md:top-8 md:right-8"
                    aria-label="Close film"
                  >
                    <X size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

/** Circular play control used as the showreel trigger. */
export function PlayButton({
  label = "Play Showreel",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "group/play flex items-center gap-4 text-left transition-opacity duration-500",
        className
      )}
      data-cursor="hover"
    >
      <span className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors duration-600 group-hover/play:border-accent">
        <Play
          size={16}
          className="ml-0.5 fill-current transition-colors duration-500 group-hover/play:text-accent"
          strokeWidth={0}
          aria-hidden="true"
        />
        <span className="absolute inset-0 rounded-full border border-accent opacity-0 transition-all duration-700 group-hover/play:scale-125 group-hover/play:opacity-40" />
      </span>
      <span className="text-[0.68rem] font-medium tracking-[0.22em] uppercase transition-colors duration-500 group-hover/play:text-accent">
        {label}
      </span>
    </button>
  );
}
