import type { Metadata } from "next";
import { Check } from "lucide-react";

import { Reveal, TextReveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section";
import { Magnetic } from "@/components/ui/magnetic";
import { AerialGrid } from "@/components/drone/aerial-grid";
import { services, site } from "@/data/site";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Drone Services",
  description:
    "Cinematic aerial footage for automotive, property, real estate, and commercial production. Establishing shots, top-down movement, and tracking work across Upstate South Carolina.",
  alternates: { canonical: "/drone" },
};

const drone = services.find((s) => s.id === "drone")!;

/**
 * ── EDIT ME ────────────────────────────────────────────────────────────────
 * What aerial coverage is used for. Purely descriptive of the service — no
 * client names or job counts, because none have been shot yet.
 */
const USE_CASES = [
  {
    title: "Automotive",
    body: "A top-down over a build, or a follow shot down an empty road. Aerial is what gives a car scale that a ground camera cannot reach.",
  },
  {
    title: "Property & Real Estate",
    body: "Orbit a building, reveal the lot, and show the approach. The shot that makes a property feel like a place rather than a listing.",
  },
  {
    title: "Business & Commercial",
    body: "Establish the shop, the yard, or the fleet in a single move — the opening frame that tells a customer how big the operation is.",
  },
  {
    title: "Events",
    body: "Coverage from above for shows, meets, and gatherings, cut alongside ground footage into one film.",
  },
];

export default function DronePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden pt-36 pb-16 md:pt-52 md:pb-24">
        {/*
          REPLACE WITH REAL AERIAL FOOTAGE
          ---------------------------------------------------------------
          When you have drone work, swap <AerialGrid /> for a looping video
          or a Frame:

            <video src="/media/video/drone-reel.mp4" autoPlay muted loop
                   playsInline className="h-full w-full object-cover" />

          Keep the scrim divs below so the headline stays readable.
        */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <AerialGrid className="h-[130%] w-auto min-w-[130%] opacity-70 md:min-w-0 md:h-[150%]" />
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink"
        />

        <div className="shell relative">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-accent">01</span>
              <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
              Aerial Production
            </p>
          </Reveal>

          <h1 className="display mt-7 text-[17vw] leading-[0.84] sm:text-[13vw] md:text-[8.5vw]">
            <TextReveal text="Drone" />
            <br />
            <TextReveal text="Services" delay={0.1} />
          </h1>

          <Reveal delay={0.14}>
            <p className="body-lg mt-8 max-w-2xl text-pretty">
              Aerial reveals, establishing shots, and top-down movement — added to
              any production or booked on its own. The shot that shows scale, and
              the one people remember.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic href="/contact" variant="solid">
                Book Aerial Coverage
              </Magnetic>
              <Magnetic href="/pricing" variant="outline">
                Drone Pricing
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ── What's included ───────────────────────────────────────────────── */}
      <section className="shell pb-24 md:pb-32" aria-labelledby="included-heading">
        <SectionHeader
          id="included-heading" index="02" eyebrow="The Offer" title="What's Included" />

        <div className="mt-12 grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {drone.points.map((point, i) => (
            <Reveal
              key={point}
              delay={(i % 5) * 0.05}
              className="flex items-start gap-3 bg-ink p-6 md:p-7"
            >
              <Check
                size={13}
                strokeWidth={2}
                aria-hidden="true"
                className="mt-1 shrink-0 text-accent"
              />
              <span className="text-sm leading-relaxed text-mute">{point}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Use cases ─────────────────────────────────────────────────────── */}
      <section className="shell pb-24 md:pb-32" aria-labelledby="usecases-heading">
        <SectionHeader
          id="usecases-heading" index="03" eyebrow="Where It Works" title="Built For" />

        <div className="mt-12 grid gap-px border-t border-l border-line bg-line md:grid-cols-2">
          {USE_CASES.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.07} className="bg-ink p-8 md:p-12">
              <p className="eyebrow mb-6">{pad(i + 1)}</p>
              <h3 className="display text-3xl md:text-4xl">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Aerial work placeholder ───────────────────────────────────────── */}
      {/*
        ADDING YOUR FIRST DRONE PROJECT
        -----------------------------------------------------------------
        1. Drop the stills into your photo folder and run `npm run portfolio`.
        2. Add a project to src/data/projects.ts with category: "drone".
        3. This whole section disappears on its own, and Drone starts
           appearing as a filter on the Work page.
      */}
      <section className="shell pb-24 md:pb-32" aria-label="Aerial portfolio">
        <div className="border border-dashed border-line px-8 py-16 text-center md:py-20">
          <p className="eyebrow mb-5">Aerial Reel</p>
          <p className="display text-[9vw] leading-[0.95] sm:text-[5vw] md:text-[3vw]">
            Newly added service
          </p>
          <p className="body-lg mx-auto mt-5 max-w-lg">
            Drone coverage is now available on every production. Aerial work from
            upcoming shoots will land here — ask about adding it to your booking.
          </p>
          <div className="mt-9 flex justify-center">
            <Magnetic href="/contact" variant="outline">
              Ask About Aerial
            </Magnetic>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="shell pb-28 md:pb-40">
        <div className="flex flex-col items-start justify-between gap-8 border-y border-line py-16 md:flex-row md:items-center md:py-20">
          <div>
            <p className="eyebrow mb-4">Add it to any shoot</p>
            <p className="display text-[10vw] leading-[0.9] sm:text-[6vw] md:text-[3.6vw]">
              Get the shot from above<span className="text-accent">.</span>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Magnetic href="/book" variant="solid">
              Book a Shoot
            </Magnetic>
            <a
              href={`mailto:${site.email}`}
              className="text-center text-[0.7rem] tracking-[0.2em] text-mute uppercase transition-colors duration-400 hover:text-accent"
            >
              or email {site.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
