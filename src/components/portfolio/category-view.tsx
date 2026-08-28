"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { projectsByCategory, type CategoryId } from "@/data/projects";
import { Lightbox, type LightboxItem } from "./lightbox";
import { Frame } from "@/components/ui/frame";
import { pad } from "@/lib/utils";

/**
 * Category page body: every frame in that vertical, on one wall.
 *
 * This used to lead with a grid of project cards and put the photographs
 * underneath, so the work was two clicks deep on a page whose whole job is to
 * show the work. The cards are gone — same decision as the Work page. The
 * project pages still exist and the lightbox still links to them; they are
 * somewhere to go, not somewhere you have to go first.
 */
export function CategoryView({ category }: { category: CategoryId }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const list = projectsByCategory(category);

  const frames = list.flatMap((project) =>
    project.gallery.map((media) => ({ media, project }))
  );

  const items: LightboxItem[] = frames.map(({ media, project }) => ({
    media,
    title: project.title,
    caption: project.subject,
    href: `/work/${project.slug}`,
  }));

  return (
    <>
      <section className="shell pb-28 md:pb-40" aria-label="Gallery">
        <p className="eyebrow mb-8">
          {pad(frames.length)} {frames.length === 1 ? "Frame" : "Frames"}
        </p>

        {/*
          A plain grid, not CSS columns: every frame is cropped to 1080×1920, so
          masonry gains nothing, and columns fill downward before moving right —
          which would put the lightbox's arrow order out of step with the order
          the eye reads.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-4% 0px" }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
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
      </section>

      <Lightbox
        items={items}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </>
  );
}
