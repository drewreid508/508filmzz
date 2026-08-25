"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from "framer-motion";
import { Frame } from "@/components/ui/frame";
import { asset } from "@/lib/asset";
import { Magnetic } from "@/components/ui/magnetic";
import { VideoModal, PlayButton } from "@/components/ui/video-modal";
import { pad } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * ── EDIT ME ────────────────────────────────────────────────────────────────
 * The frames the hero cycles through. Any key from portfolio.generated.json or
 * media.generated.json works — add or remove entries and the indicator on the
 * right adjusts itself.
 */
const PLATES = [
  { id: "img_5638", label: "Porsche 911 GT2 RS", vertical: "Automotive" },
  { id: "pf_img_5850", label: "Lifted Super Duty", vertical: "Automotive" },
  { id: "pf_img_5834", label: "Owner-Operator Rig", vertical: "Commercial" },
];

const HOLD = 5200;

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % PLATES.length), HOLD);
    return () => clearInterval(timer);
  }, [reduced]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden"
      aria-label="Introduction"
    >
      {/* Plate stack */}
      <motion.div
        className="absolute inset-0"
        style={reduced ? undefined : { y: plateY, scale: plateScale }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={PLATES[active].id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08, filter: "blur(16px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{
              opacity: { duration: 1.5, ease: EASE },
              filter: { duration: 1.5, ease: EASE },
              scale: { duration: HOLD / 1000 + 1.5, ease: "linear" },
            }}
          >
            <Frame
              id={PLATES[active].id}
              alt={PLATES[active].label}
              priority={active === 0}
              sizes="100vw"
              className="h-full w-full"
              imgClassName="object-cover brightness-[0.78] saturate-[0.92] contrast-[1.06]"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Cinematic grade: vignette + bottom scrim + a whisper of blue in the shadows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/40 to-ink"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_18%,rgba(10,10,10,0.9)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(180deg, rgba(30,144,255,0.16) 0%, transparent 42%, rgba(30,144,255,0.10) 100%)",
        }}
      />

      {/* Copy */}
      <motion.div
        className="shell relative flex h-full flex-col justify-end pb-14 md:pb-20"
        style={reduced ? undefined : { y: copyY, opacity: copyOpacity }}
      >
        <motion.p
          className="eyebrow mb-7 flex items-center gap-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.9, ease: EASE }}
        >
          <span className="h-px w-10 bg-accent" aria-hidden="true" />
          Cinematic Media — Est. 508
        </motion.p>

        <h1 className="display text-[17vw] leading-[0.82] sm:text-[15vw] md:text-[11.5vw] lg:text-[10.5vw]">
          {["Cinematic Media.", "Built To Move."].map((line, li) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "104%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.32 + li * 0.11, duration: 1.25, ease: EASE }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          className="mt-9 flex flex-col gap-9 border-t border-line pt-8 md:flex-row md:items-center md:justify-between"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 1, ease: EASE }}
        >
          <p className="body-lg max-w-lg text-balance">
            Automotive filmmaking, commercial content, photography, and aerial
            production built to make your brand stand out.
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Magnetic
              href="/portfolio"
              variant="solid"
              wrapperClassName="w-full sm:w-auto"
              className="w-full sm:w-auto"
            >
              View Work
            </Magnetic>
            <Magnetic
              href="/contact"
              variant="outline"
              wrapperClassName="w-full sm:w-auto"
              className="w-full sm:w-auto"
            >
              Book a Shoot
            </Magnetic>
          </div>
        </motion.div>
      </motion.div>

      {/* Plate index + showreel trigger */}
      <motion.div
        className="absolute top-1/2 right-[clamp(1.25rem,4vw,3.5rem)] hidden -translate-y-1/2 flex-col items-end gap-5 lg:flex"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1, ease: EASE }}
      >
        {PLATES.map((plate, i) => (
          <button
            key={plate.id}
            onClick={() => setActive(i)}
            // Must contain the visible "01"/"02" text, or the accessible name
            // and the visible label disagree (WCAG 2.5.3 Label in Name).
            aria-label={`${pad(i + 1)} — show ${plate.label}`}
            aria-current={i === active}
            className="group flex items-center gap-3"
          >
            <span
              className={`text-[0.6rem] tracking-[0.2em] uppercase transition-colors duration-500 ${
                i === active ? "text-bone" : "text-faint group-hover:text-mute"
              }`}
            >
              {pad(i + 1)}
            </span>
            <span
              className={`h-px transition-all duration-700 ${
                i === active ? "w-12 bg-accent" : "w-6 bg-line-strong group-hover:w-9"
              }`}
            />
          </button>
        ))}
      </motion.div>

      <motion.div
        className="absolute top-[22%] right-[clamp(1.25rem,4vw,3.5rem)] hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 1 }}
      >
        <VideoModal
          src={asset("/media/video/hds-revuelto.mp4")}
          title="Revuelto — HDS commercial"
          aspect={9 / 16}
          trigger={<PlayButton label="Watch The Film" />}
        />
      </motion.div>
    </section>
  );
}
