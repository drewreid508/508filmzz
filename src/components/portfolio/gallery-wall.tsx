"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { categories, allGalleryItems, type CategoryId } from "@/data/projects";
import { Lightbox, type LightboxItem } from "./lightbox";
import { Frame } from "@/components/ui/frame";
import { cn, pad } from "@/lib/utils";

type Filter = "all" | CategoryId;

/**
 * Every frame in the archive, flattened out of the projects that hold them.
 *
 * Films are dropped: their only gallery entry is the poster frame, which is
 * already on this page as the still behind the player in the band above. Left
 * in, the same image would appear twice on one screen.
 *
 * Computed once at module scope rather than per render: the list never changes
 * at runtime, and `allGalleryItems()` walks every project on each call.
 */
const FRAMES = allGalleryItems().filter(({ project }) => !project.video);

/**
 * Only offer a filter that has frames behind it.
 *
 * Derived from FRAMES rather than from the project list, because a project
 * with an empty gallery would otherwise create a filter that shows nothing.
 */
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Everything" },
  ...categories
    .filter((c) => FRAMES.some((f) => f.project.category === c.id))
    .map((c) => ({ id: c.id as Filter, label: c.label })),
];

/**
 * The Work page, as one wall of photographs.
 *
 * This deliberately replaced a grid of project cards that had to be clicked
 * into. Every frame is on the page immediately — a visitor decides whether to
 * hire you from the photographs, and an album cover is a photograph they have
 * to earn. Clicking still does something (it opens the frame full screen), but
 * nothing is hidden behind it.
 *
 * The layout is a plain grid, not CSS columns. Every portfolio frame is cropped
 * to 1080×1920, so masonry would buy nothing — and CSS columns fill top-to-
 * bottom before moving right, which would put the lightbox's arrow order out of
 * step with the order the eye reads.
 */
export function GalleryWall() {
  const [filter, setFilter] = useState<Filter>("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const frames = useMemo(
    () =>
      filter === "all" ? FRAMES : FRAMES.filter((f) => f.project.category === filter),
    [filter]
  );

  const items: LightboxItem[] = frames.map(({ media, project }) => ({
    media,
    title: project.title,
    caption: project.subject,
    href: `/work/${project.slug}`,
  }));

  /**
   * Close the lightbox whenever the set changes underneath it — a held index
   * would otherwise point at a different photo, or past the end of a shorter
   * list.
   */
  function choose(next: Filter) {
    setLightbox(null);
    setFilter(next);
  }

  return (
    <>
      {/* Filters. Sticky, so the wall stays browsable from anywhere down it. */}
      <div className="sticky top-[72px] z-40 -mx-[clamp(1.25rem,4vw,3.5rem)] border-y border-line bg-ink/85 px-[clamp(1.25rem,4vw,3.5rem)] py-4 backdrop-blur-xl md:top-[86px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by category"
          >
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => choose(f.id)}
                  aria-pressed={active}
                  className={cn(
                    "border px-5 py-2.5 text-[0.64rem] font-medium tracking-[0.18em] uppercase transition-all duration-500",
                    active
                      ? "border-accent text-accent"
                      : "border-line text-mute hover:border-line-strong hover:text-bone"
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <p className="eyebrow" aria-live="polite">
            {pad(frames.length)} {frames.length === 1 ? "Frame" : "Frames"}
          </p>
        </div>
      </div>

      {/*
        Tiles render no heading of their own, so the page would jump h1 -> (none).
        Visually hidden: the filter row already says what this is.
      */}
      <h2 className="sr-only">Every frame</h2>

      {/*
        One fade on the container, keyed to the filter — not forty-five staggered
        ones on the tiles.

        Per-tile entrance animations start every frame at opacity 0 and rely on
        the rAF loop to bring them back. Where that loop is throttled — a
        restored background tab, a cheap phone, a browser under load — the wall
        can be left blank, on the one page whose entire job is to show the
        photographs immediately. A single transition cannot strand them.
      */}
      <motion.div
        key={filter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
      >
        {frames.map(({ media, project }, i) => (
          <button
            key={media}
            onClick={() => setLightbox(i)}
            className="group block w-full text-left"
            aria-label={`Open ${project.title} — ${project.subject} full screen`}
          >
            <div className="brackets relative overflow-hidden">
              <div className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                <Frame
                  id={media}
                  alt={`${project.title} — ${project.subject}`}
                  ratio={9 / 16}
                  sizes="(max-width: 768px) 48vw, (max-width: 1024px) 32vw, 24vw"
                />
              </div>

              {/*
                No caption. The frames carry themselves, and a title card over
                every one turns a wall of photographs into a contact sheet. The
                project name still reaches a screen reader through the button's
                aria-label, and the lightbox names it once a frame is open.
              */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ink/0 transition-colors duration-600 group-hover:bg-ink/15"
              />
            </div>
          </button>
        ))}
      </motion.div>

      <Lightbox
        items={items}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </>
  );
}
