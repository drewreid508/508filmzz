"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { Frame } from "@/components/ui/frame";
import { cn, pad } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const categoryLabel: Record<Project["category"], string> = {
  automotive: "Automotive",
  commercial: "Commercial",
  social: "Social Media",
};

export function ProjectCard({
  project,
  index,
  // Portfolio frames are mastered 1080x1920, so cards stand vertical by default.
  ratio = 9 / 16,
  sizes = "(max-width: 768px) 92vw, (max-width: 1280px) 46vw, 31vw",
  className,
}: {
  project: Project;
  index: number;
  ratio?: number;
  sizes?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      layout
      initial={reduced ? false : { opacity: 0, y: 34, filter: "blur(10px)" }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={reduced ? undefined : { opacity: 0, y: -12, filter: "blur(6px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.85, ease: EASE, delay: (index % 3) * 0.07 }}
      className={cn("group relative", className)}
    >
      <Link href={`/work/${project.slug}`} className="block">
        <div className="brackets relative overflow-hidden">
          <div className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.055]">
            <Frame
              id={project.hero}
              alt={`${project.title} — ${project.subject}`}
              ratio={ratio}
              sizes={sizes}
              imgClassName="transition-[filter] duration-[900ms] group-hover:saturate-[1.12]"
            />
          </div>

          {/* Cinematic scrim so the caption always reads */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/10 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100"
          />

          <span className="eyebrow absolute top-5 left-5 text-bone/80">
            {pad(index + 1)}
          </span>

          <span className="absolute top-5 right-5 flex items-center gap-2">
            {/* Signals a finished film rather than a stills set. */}
            {project.video && (
              <span className="flex items-center gap-1.5 border border-accent bg-accent/15 px-2.5 py-1.5 text-[0.6rem] font-medium tracking-[0.18em] text-accent uppercase backdrop-blur-sm">
                <Play size={9} className="fill-current" strokeWidth={0} aria-hidden="true" />
                Film
              </span>
            )}
            <span className="border border-line-strong bg-ink/40 px-3 py-1.5 text-[0.6rem] font-medium tracking-[0.18em] text-bone/80 uppercase backdrop-blur-sm">
              {categoryLabel[project.category]}
            </span>
          </span>

          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <h3 className="display text-3xl leading-none md:text-4xl">
                {project.title}
              </h3>
              <p className="mt-1.5 truncate text-[0.78rem] tracking-wide text-mute">
                {project.subject}
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-line-strong bg-ink/30 backdrop-blur-sm transition-all duration-600 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
