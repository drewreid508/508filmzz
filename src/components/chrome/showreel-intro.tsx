"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";

import { asset } from "@/lib/asset";
import { disciplines } from "@/data/site";
import { Magnetic } from "@/components/ui/magnetic";

const SEEN_KEY = "508-reel-seen";
const REEL_SECONDS = 12;

/**
 * The business-card experience.
 *
 * Someone scans a QR code standing in a shop doorway and lands here. They have
 * not chosen to visit a website — they have pointed a phone at a card — so the
 * first thing they get is twelve seconds of the work rather than a nav bar.
 *
 * ── Why it is an overlay and not a /showreel route ─────────────────────────
 * The cards are already printed, pointing at the bare domain. A separate page
 * would need new cards. This sits over the existing homepage instead, so the
 * printed QR keeps working and the homepage underneath is untouched.
 *
 * ── Why once per visit ─────────────────────────────────────────────────────
 * An intro you cannot get past is a door that sticks. After the first view the
 * homepage loads straight away for the rest of the session, and Skip is on
 * screen the entire time for anyone who wants in immediately.
 */
/*
  Hydration flag.

  The overlay must not exist in the server HTML — see the note in the component
  below. useSyncExternalStore is how you ask React "are we past hydration yet"
  without setting state from an effect: the server snapshot is false, the client
  snapshot is true, and React swaps them in the same commit as hydration rather
  than in a second cascading render.
*/
const noopSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/*
  Whether this visit should get the reel at all, worked out once per page load.

  It lives outside the component on purpose. Client-side navigation unmounts
  and remounts the homepage — tap Portfolio, tap the logo, and you are back
  here with fresh component state. Module scope survives that, so the reel
  cannot replay itself at someone who already watched or skipped it, and the
  storage and media-query reads happen exactly once.
*/
let eligibility: boolean | null = null;

function shouldPlayReel(): boolean {
  if (eligibility !== null) return eligibility;

  let seen = false;
  try {
    seen = sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    // Private browsing can throw on read. Not remembering is fine; trapping
    // someone behind a door that will not open is not.
    seen = false;
  }

  // Anyone who has asked for less motion should not be handed a 12-second
  // autoplaying film before they can read anything.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  eligibility = !seen && !reduced;
  return eligibility;
}

export function ShowreelIntro() {
  /*
    Why the overlay is client-only, deliberately.

    Rendering it in the server HTML would mean every crawler, link preview and
    reader-mode view sees a video wall instead of the homepage — and if
    JavaScript failed, a visitor would be stuck behind it with no way through.
    Turning it on after hydration makes the homepage the real page and this an
    enhancement on top.

    useSyncExternalStore is how that question gets asked without setting state
    from an effect: the server snapshot is false, the client snapshot is true,
    and React swaps them as part of hydration rather than in a second render.
  */
  const hydrated = useSyncExternalStore(noopSubscribe, clientSnapshot, serverSnapshot);
  const [dismissed, setDismissed] = useState(false);
  const [captions, setCaptions] = useState(0);
  const [needsTap, setNeedsTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = hydrated && !dismissed && shouldPlayReel();

  const dismiss = useCallback(() => {
    setDismissed(true);
    eligibility = false;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // As above — a storage failure must not become a stuck door. The module
      // flag above already covers this session; only a reload forgets.
    }
    videoRef.current?.pause();
  }, []);

  // ── Playback, and the iPhone autoplay rules ─────────────────────────────
  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    if (!video) return;

    document.body.style.overflow = "hidden";

    /*
      iOS allows autoplay only when muted and inline. Both are set on the
      element, but Low Power Mode and some data-saver settings refuse anyway —
      and a silent black rectangle is a worse first impression than no video at
      all. So a refusal surfaces a real play button rather than being swallowed.
    */
    video.play().catch(() => setNeedsTap(true));

    /*
      Pick the reel back up after an app switch.

      A phone pauses video the moment it is backgrounded — a call, a text, a
      glance at something else — and does not resume on return. Without this
      the intro sits on a frozen frame with its captions stopped, which looks
      like a broken page at the exact moment someone has just scanned a card.
    */
    const onVisible = () => {
      if (document.hidden) return;
      if (video.ended) return;
      video.play().catch(() => setNeedsTap(true));
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Caption timing, driven by the video's own clock ─────────────────────
  useEffect(() => {
    if (!open) return;
    const video = videoRef.current;
    if (!video) return;

    /*
      Tied to currentTime rather than a setTimeout chain: on a slow connection
      the video stalls while timers keep running, and the captions would finish
      before the footage did.
    */
    const onTime = () => {
      const t = video.currentTime;
      if (t < 1.5) setCaptions(0);
      else if (t < 8.5) setCaptions(1);
      else setCaptions(2);
    };
    video.addEventListener("timeupdate", onTime);
    return () => video.removeEventListener("timeupdate", onTime);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  /*
    Rendered into <body>, not in place.
    ──────────────────────────────────────────────────────────────────────────
    The page-transition wrapper this component sits inside carries a
    `filter: blur(0px)`, and any filter other than `none` makes that element the
    containing block for fixed-position descendants. Left in the tree the
    overlay stops being viewport-sized and becomes page-sized — measured at
    14,287px tall against an 812px screen, which put the buttons a full page
    below the fold — and its z-index gets trapped in the wrapper's stacking
    context, so the site header drew straight over the Skip button.

    A portal to <body> is the fix rather than a bigger z-index: the number was
    never the problem, the containing block was.
  */
  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="508 Filmzz showreel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[200] overflow-hidden bg-ink"
        >
          {/* ── The film ────────────────────────────────────────────────── */}
          <video
            ref={videoRef}
            src={asset("/media/video/showreel.mp4")}
            muted
            playsInline
            autoPlay
            preload="auto"
            onEnded={() => setCaptions(2)}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Legibility, not decoration: white type over moving footage. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/25 to-ink/90"
          />

          {/* ── Autoplay refused ────────────────────────────────────────── */}
          {needsTap && (
            <button
              type="button"
              onClick={() => {
                videoRef.current?.play().catch(() => {});
                setNeedsTap(false);
              }}
              aria-label="Play the showreel"
              className="absolute inset-0 z-20 flex items-center justify-center"
            >
              <span className="flex h-24 w-24 items-center justify-center rounded-full border border-bone/70 bg-ink/60 backdrop-blur-sm">
                <Play size={30} className="ml-1 fill-bone text-bone" strokeWidth={0} aria-hidden="true" />
              </span>
            </button>
          )}

          {/* ── Skip, always reachable ──────────────────────────────────── */}
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-[max(1.25rem,env(safe-area-inset-top))] right-5 z-30 min-h-[44px] px-3 text-[0.66rem] font-medium tracking-[0.2em] text-bone/70 uppercase transition-colors duration-300 hover:text-bone"
          >
            Skip
          </button>

          {/* ── Content ─────────────────────────────────────────────────── */}
          <div className="relative z-10 flex h-full flex-col justify-between px-6 pt-[max(4.5rem,calc(env(safe-area-inset-top)+3.5rem))] pb-[max(2rem,calc(env(safe-area-inset-bottom)+1.5rem))] sm:px-10">
            <div>
              <p className="display text-[9vw] leading-none sm:text-4xl">
                508 <span className="text-accent">Filmzz</span>
              </p>
              <p className="eyebrow mt-3 text-bone/70">Cinematic Media. Built To Move.</p>
            </div>

            <div className="pb-2">
              <AnimatePresence mode="wait">
                {captions === 1 && (
                  <motion.ul
                    key="services"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-1.5"
                  >
                    {disciplines.map((line, i) => (
                      <motion.li
                        key={line}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.45, duration: 0.4 }}
                        className="display text-[8vw] leading-[1.05] sm:text-3xl"
                      >
                        {line}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}

                {captions === 2 && (
                  <motion.p
                    key="close"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="display max-w-md text-[10vw] leading-[0.95] text-balance sm:text-4xl"
                  >
                    Your business. Your story. Your content
                    <span className="text-accent">.</span>
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="mt-8 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={dismiss}
                  className="w-full bg-bone px-8 py-4 text-[0.72rem] font-medium tracking-[0.22em] text-ink uppercase transition-colors duration-400 hover:bg-accent hover:text-white"
                >
                  Enter 508 Filmzz
                </button>
                <Magnetic
                  href="/book"
                  variant="outline"
                  wrapperClassName="w-full"
                  className="w-full"
                  onClick={dismiss}
                >
                  Start a Project
                </Magnetic>
              </div>

              {/* Progress, so the length is visible and the wait feels bounded. */}
              <div aria-hidden="true" className="mt-6 h-px w-full bg-bone/20">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: REEL_SECONDS, ease: "linear" }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Nothing to portal into until the client has a document.
  return hydrated ? createPortal(overlay, document.body) : null;
}
