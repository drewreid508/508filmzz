"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projectsByCategory, type CategoryId } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { Lightbox, type LightboxItem } from "./lightbox";
import { Frame } from "@/components/ui/frame";
import { Reveal } from "@/components/motion/reveal";
import { pad } from "@/lib/utils";

/**
 * Category page body: the project grid plus a full gallery of every frame in
 * that vertical, wired to the shared lightbox.
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
      <section className="shell pb-24 md:pb-32" aria-label="Projects">
        <p className="eyebrow mb-8">
          {pad(list.length)} {list.length === 1 ? "Project" : "Projects"}
        </p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      <section className="shell pb-28 md:pb-40" aria-label="Gallery">
        <Reveal>
          <div className="mb-8 flex items-end justify-between border-t border-line pt-10">
            <h2 className="display text-4xl md:text-5xl">Frames</h2>
            <p className="eyebrow">{pad(frames.length)} Stills</p>
          </div>
        </Reveal>

        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {frames.map(({ media, project }, i) => (
            <motion.button
              key={`${project.slug}-${media}-${i}`}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-6% 0px" }}
              transition={{ duration: 0.7, delay: (i % 8) * 0.03 }}
              onClick={() => setLightbox(i)}
              className="group block w-full break-inside-avoid text-left"
              aria-label={`Open ${project.title} — ${project.subject}`}
            >
              <div className="brackets relative overflow-hidden">
                <div className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                  <Frame
                    id={media}
                    alt={`${project.title} — ${project.subject}`}
                    sizes="(max-width: 768px) 48vw, (max-width: 1024px) 32vw, 24vw"
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-ink/0 transition-colors duration-600 group-hover:bg-ink/35"
                />
                <div className="absolute inset-x-4 bottom-4 translate-y-2 opacity-0 transition-all duration-600 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="display text-xl leading-none">{project.title}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
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
