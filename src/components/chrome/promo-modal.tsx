"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Copy } from "lucide-react";

import { PROMO_CODE, DISCOUNT_LABEL } from "@/lib/offer";
import { asset } from "@/lib/asset";

const PRICING_PATH = asset("/pricing/");
const SEEN_KEY = "508-promo-seen";

/**
 * The first-time offer, shown when someone deliberately asks about price.
 *
 * ── Why it opens on the Pricing link, and only then ────────────────────────
 * An offer that appears on arrival interrupts someone who came to look at the
 * work, and one that reappears on scroll trains people to dismiss it unread.
 * Clicking "Pricing" is the one moment a visitor has said, unprompted, that
 * money is on their mind — so that is the only thing that opens this.
 *
 * ── Why it cannot trap anyone ──────────────────────────────────────────────
 * It intercepts a real navigation, so every way out of it goes on to the
 * pricing page: the button, the close control, Escape, and the backdrop. A
 * modal that swallows the click someone made is worse than no modal.
 *
 * ── Why once per session ───────────────────────────────────────────────────
 * The second time you are shown an offer you have already read, it stops being
 * an offer and starts being an obstacle. After the first view, Pricing behaves
 * like an ordinary link for the rest of the visit.
 */
export function PromoModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const goToPricing = useCallback(() => {
    setOpen(false);
    router.push("/pricing");
  }, [router]);

  // ── Intercept the Pricing link, once ────────────────────────────────────
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Leave modified clicks alone: a new tab is not a request for a modal.
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const link = (event.target as HTMLElement | null)?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href") || "";
      const isPricing =
        href === "/pricing" || href === "/pricing/" || href === PRICING_PATH;
      if (!isPricing) return;

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {
        // Private browsing can throw on access. Treat it as unseen and let the
        // modal open — a thrown read must never break the Pricing link.
      }
      if (seen) return;

      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Same again: not being able to remember is not a reason to misbehave.
      }

      // Both, and in that order. preventDefault stops the browser following the
      // href; stopPropagation stops Next's Link handler ever seeing the click
      // and routing anyway. Without the second, the modal opens and the page
      // navigates out from under it.
      event.preventDefault();
      event.stopPropagation();
      setOpen(true);
    }

    /*
      Capture phase, deliberately.

      Next's Link calls preventDefault() on the bubble to do client-side
      routing. A listener on document bubbles *after* the React root, so it
      would see a click that is already defaulted and already handled — the
      first version of this checked defaultPrevented and therefore skipped
      every single navigation. Capturing puts this ahead of Link instead.
    */
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // ── Escape closes, and still goes where the click was headed ────────────
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") goToPricing();
    }
    window.addEventListener("keydown", onKey);
    // Move focus in, so a keyboard user is not left behind the overlay.
    panelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, goToPricing]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  /**
   * Copy the code.
   *
   * The async Clipboard API is used where it exists, but iOS Safari only grants
   * it inside the gesture that triggered it and refuses outside a secure
   * context — so the old execCommand path stays as a fallback. Both run inside
   * the click handler itself for that reason; deferring either loses the
   * gesture and the copy silently fails.
   */
  async function copyCode() {
    let ok = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROMO_CODE);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      try {
        const field = document.createElement("textarea");
        field.value = PROMO_CODE;
        // Off-screen rather than hidden: iOS will not select from a field with
        // display:none, and a visible one scrolls the page under the modal.
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.top = "-1000px";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        field.setSelectionRange(0, PROMO_CODE.length);
        ok = document.execCommand("copy");
        document.body.removeChild(field);
      } catch {
        ok = false;
      }
    }

    // Confirm either way. If both paths failed the code is on screen, selectable,
    // and telling someone "copy failed" helps them not at all.
    setCopied(true);
    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="promo-title"
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        >
          <motion.button
            type="button"
            aria-label="Close and go to pricing"
            onClick={goToPricing}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/92 backdrop-blur-xl"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg border border-line-strong bg-ink-2 p-7 outline-none sm:p-10"
          >
            <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-accent" />

            <button
              type="button"
              onClick={goToPricing}
              aria-label="Close and go to pricing"
              className="absolute top-4 right-4 p-2 text-faint transition-colors duration-300 hover:text-bone"
            >
              <X size={16} strokeWidth={1.6} aria-hidden="true" />
            </button>

            <p className="eyebrow text-accent">First-Time Client Offer</p>

            <h2
              id="promo-title"
              className="display mt-5 text-[11vw] leading-[0.92] text-balance sm:text-[3.4rem]"
            >
              {DISCOUNT_LABEL} off your first booking
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-mute">
              Whether you&apos;re booking a one-time production or starting a
              monthly content package, save {DISCOUNT_LABEL} on your first
              purchase.
            </p>

            <p className="eyebrow mt-9 mb-3">Your code</p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              {/*
                Selectable on purpose. If both copy paths fail — an old browser,
                a locked-down webview — the code can still be picked up by hand.
              */}
              <p className="display flex-1 border border-dashed border-accent/60 bg-accent/[0.06] px-5 py-4 text-center text-3xl tracking-[0.14em] text-accent select-all sm:text-4xl">
                {PROMO_CODE}
              </p>

              <button
                type="button"
                onClick={copyCode}
                aria-live="polite"
                className="flex items-center justify-center gap-2.5 border border-line-strong px-6 py-4 text-[0.68rem] font-medium tracking-[0.2em] text-bone uppercase transition-colors duration-400 hover:border-accent hover:text-accent sm:px-7"
              >
                {copied ? (
                  <>
                    <Check size={13} strokeWidth={2.2} aria-hidden="true" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={13} strokeWidth={1.8} aria-hidden="true" />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            <p className="mt-5 text-[0.78rem] leading-relaxed text-faint">
              Use this code when booking to receive your first-time client
              discount. On monthly packages it applies to your first month.
            </p>

            <button
              type="button"
              onClick={goToPricing}
              className="mt-8 w-full bg-bone px-8 py-4 text-[0.72rem] font-medium tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:bg-accent hover:text-white"
            >
              View Packages
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
