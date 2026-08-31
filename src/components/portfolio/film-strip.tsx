"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { projects, type Project } from "@/data/projects";
import { ReelPlayer } from "@/components/ui/reel-player";
import { Reveal } from "@/components/motion/reveal";
import { asset } from "@/lib/asset";
import { pad } from "@/lib/utils";

const categoryLabel: Record<Project["category"], string> = {
  automotive: "Automotive",
  commercial: "Commercial",
  social: "Social Media",
};

/**
 * The films, up front.
 *
 * A production company's product is motion, so the work page leads with the
 * finished commercials playing in place rather than burying them behind a
 * thumbnail three scrolls down. Each player is lazy — nothing is fetched until
 * it scrolls into view, and it pauses itself on the way out.
 *
 * Driven entirely by `video` blocks in src/data/projects.ts. Add a video to a
 * project and it appears here on its own.
 */
export function FilmStrip() {
  const films = projects.filter((p) => p.video);
  if (!films.length) return null;

  return (
    <section className="shell pb-20 md:pb-28" aria-labelledby="films-heading">
      <div className="mb-10 flex flex-col justify-between gap-6 border-t border-line pt-10 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-4 flex items-center gap-3">
            <span className="text-accent">{pad(films.length)}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            {/*
              Not "Finished Commercials" any more. Two of these are full
              commercials with voiceover and graphics; three are shot-and-cut
              client pieces. One label has to be true of all five.
            */}
            Client Films
          </p>
          <h2 id="films-heading" className="display text-[13vw] leading-[0.9] sm:text-[8vw] md:text-[4.4vw]">
            The Films
          </h2>
        </div>
        <p className="body-lg max-w-md md:text-right">
          Client work, start to finish — planned, produced and finished in house, from full
          commercials to rolling coverage. Press play.
        </p>
      </div>

      <div className="grid gap-12 sm:grid-cols-2 md:gap-10 lg:grid-cols-3">
        {films.map((film, i) => (
          <Reveal key={film.slug} delay={i * 0.08}>
            {/*
              Capped deliberately. These are 9:16 films — let the player fill a
              half-width column on a desktop and it stands 1130px tall, so the
              viewer can never see a whole frame at once.
            */}
            <article className="mx-auto w-full max-w-[360px]">
              <ReelPlayer
                src={asset(film.video!.src)}
                poster={film.video!.poster}
                title={`${film.title} — ${film.subject}`}
              />

              <div className="mt-6 flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <p className="eyebrow mb-2">
                    {categoryLabel[film.category]} — {film.year}
                  </p>
                  <h3 className="display text-3xl leading-none md:text-4xl">
                    {film.title}
                  </h3>
                  <p className="mt-2 truncate text-sm text-mute">{film.subject}</p>
                </div>

                <Link
                  href={`/work/${film.slug}`}
                  aria-label={`${film.title} — project details`}
                  className="group flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong transition-all duration-500 hover:border-accent hover:bg-accent hover:text-white"
                >
                  <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
