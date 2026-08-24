"use client";

import { ReelPlayer } from "@/components/ui/reel-player";
import { asset } from "@/lib/asset";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";

/**
 * The vertical-film panel. The full film plays inline — visitors never have to
 * leave the page to watch the work.
 */
export function ReelPanel() {
  return (
    <section className="shell py-24 md:py-36" aria-labelledby="reel-heading">
      <div className="grid items-center gap-14 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5 md:col-start-1">
          <Reveal>
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="text-accent">02</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
              Showreel
            </p>
          </Reveal>

          <h2
            id="reel-heading"
            className="display text-[13vw] leading-[0.86] sm:text-[9vw] md:text-[4.6vw]"
          >
            <TextReveal text="Watch the work." />
          </h2>

          <Reveal delay={0.1}>
            <p className="body-lg mt-7 max-w-md">
              A full production cut down to the piece that matters. Every film is
              finished twice — a wide master and a vertical cut for Reels, TikTok,
              and Shorts — same colour, same sound design.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic href="/portfolio" variant="outline">
                See All Work
              </Magnetic>
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <Reveal blur={16} y={40}>
            <ReelPlayer
              src={asset("/media/video/showreel.mp4")}
              poster="poster-showreel"
              title="508 Filmzz showreel"
            />
            <div className="mx-auto mt-5 flex max-w-[380px] items-center justify-between">
              <span className="eyebrow">9:16 — Reels / Shorts</span>
              <span className="flex items-center gap-2 text-[0.62rem] tracking-[0.2em] text-faint uppercase">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent"
                  aria-hidden="true"
                />
                Full film
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
