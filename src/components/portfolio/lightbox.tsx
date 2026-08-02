"use client";

import { useCallback, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { getMedia, largest, srcSet } from "@/lib/media";
import { pad } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

export type LightboxItem = {
  media: string;
  title: string;
  caption?: string;
  href?: string;
};

export function Lightbox({
  items,
  index,
  onClose,
  onIndexChange,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const open = index !== null;

  const next = useCallback(() => {
    if (index === null) return;
    onIndexChange((index + 1) % items.length);
  }, [index, items.length, onIndexChange]);

  const prev = useCallback(() => {
    if (index === null) return;
    onIndexChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  const current = index !== null ? items[index] : null;
  const asset = current ? getMedia(current.media) : null;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <AnimatePresence>
        {open && current && asset && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-100 bg-ink/95 backdrop-blur-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-100 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Dialog.Title className="sr-only">{current.title}</Dialog.Title>
                <Dialog.Description className="sr-only">
                  Image {index + 1} of {items.length}. Use the arrow keys to browse,
                  Escape to close.
                </Dialog.Description>

                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-5 md:px-10">
                  <p className="eyebrow">
                    <span className="text-accent">{pad(index + 1)}</span>
                    <span className="mx-2 text-faint">/</span>
                    {pad(items.length)}
                  </p>
                  <Dialog.Close asChild>
                    <button
                      className="flex h-12 w-12 items-center justify-center border border-line-strong transition-colors duration-400 hover:border-accent hover:text-accent"
                      aria-label="Close gallery"
                    >
                      <X size={18} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Stage */}
                <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={current.media}
                      src={largest(asset).webp}
                      srcSet={srcSet(asset, "webp")}
                      sizes="(max-width: 768px) 92vw, 70vw"
                      alt={current.title}
                      className="max-h-full max-w-full object-contain"
                      initial={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.99, filter: "blur(8px)" }}
                      transition={{ duration: 0.55, ease: EASE }}
                    />
                  </AnimatePresence>

                  <button
                    onClick={prev}
                    aria-label="Previous image"
                    className="absolute left-2 flex h-12 w-12 items-center justify-center border border-line-strong bg-ink/40 transition-colors duration-400 hover:border-accent hover:text-accent md:left-6"
                  >
                    <ArrowLeft size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next image"
                    className="absolute right-2 flex h-12 w-12 items-center justify-center border border-line-strong bg-ink/40 transition-colors duration-400 hover:border-accent hover:text-accent md:right-6"
                  >
                    <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </div>

                {/* Caption */}
                <div className="flex items-end justify-between gap-6 px-5 py-6 md:px-10 md:py-8">
                  <div>
                    <p className="display text-2xl md:text-3xl">{current.title}</p>
                    {current.caption && (
                      <p className="mt-1 text-sm text-mute">{current.caption}</p>
                    )}
                  </div>
                  {current.href && (
                    <a
                      href={current.href}
                      className="shrink-0 border border-line-strong px-5 py-3 text-[0.64rem] tracking-[0.2em] uppercase transition-colors duration-400 hover:border-accent hover:text-accent"
                    >
                      View project
                    </a>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
