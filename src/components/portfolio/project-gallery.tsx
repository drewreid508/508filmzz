"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { Frame } from "@/components/ui/frame";
import { Lightbox, type LightboxItem } from "./lightbox";

/**
 * Project gallery — an editorial rhythm rather than a uniform grid: every third
 * frame runs full width so the set doesn't read as a contact sheet.
 */
export function ProjectGallery({ project }: { project: Project }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items: LightboxItem[] = project.gallery.map((media) => ({
    media,
    title: project.title,
    caption: project.subject,
  }));

  return (
    <>
      {/*
       * Every frame is mastered 1080x1920, so the set runs as an even vertical
       * grid rather than the old mixed-orientation rhythm.
       */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {project.gallery.map((media, i) => (
          <motion.button
            key={`${media}-${i}`}
            initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
            onClick={() => setLightbox(i)}
            className="group block text-left"
            aria-label={`Open frame ${i + 1} of ${project.gallery.length}`}
          >
            <div className="brackets relative overflow-hidden">
              <div className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]">
                <Frame
                  id={media}
                  alt={`${project.title} — frame ${i + 1}`}
                  ratio={9 / 16}
                  sizes="(max-width: 768px) 46vw, (max-width: 1024px) 46vw, 31vw"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ink/0 transition-colors duration-600 group-hover:bg-ink/25"
              />
            </div>
          </motion.button>
        ))}
      </div>

      <Lightbox
        items={items}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </>
  );
}
