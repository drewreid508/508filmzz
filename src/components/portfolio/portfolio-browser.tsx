"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X, LayoutGrid, Images } from "lucide-react";

import { projects, categories, allGalleryItems, type CategoryId } from "@/data/projects";
import { ProjectCard } from "./project-card";
import { Lightbox, type LightboxItem } from "./lightbox";
import { Frame } from "@/components/ui/frame";
import { cn, pad } from "@/lib/utils";

type Filter = "all" | CategoryId;
type View = "projects" | "gallery";

/**
 * Only offer a filter that has work behind it.
 *
 * A category with nothing in it reads as a broken site rather than a service
 * you have not shot yet — Drone is exactly that until the first aerial job
 * lands. Add a drone project in src/data/projects.ts and the filter appears on
 * its own, no change needed here.
 */
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  ...categories
    .filter((c) => projects.some((p) => p.category === c.id))
    .map((c) => ({ id: c.id as Filter, label: c.label })),
];

export function PortfolioBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("projects");
  const [query, setQuery] = useState("");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const q = query.trim().toLowerCase();

  const visibleProjects = useMemo(() => {
    return projects.filter((p) => {
      const inCategory = filter === "all" || p.category === filter;
      if (!inCategory) return false;
      if (!q) return true;
      return [p.title, p.subject, p.summary, p.category, ...p.deliverables]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [filter, q]);

  const visibleGallery = useMemo(() => {
    return allGalleryItems().filter(({ project }) => {
      const inCategory = filter === "all" || project.category === filter;
      if (!inCategory) return false;
      if (!q) return true;
      return [project.title, project.subject, project.summary, project.category]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [filter, q]);

  const lightboxItems: LightboxItem[] = visibleGallery.map(({ media, project }) => ({
    media,
    title: project.title,
    caption: project.subject,
    href: `/work/${project.slug}`,
  }));

  const count = view === "projects" ? visibleProjects.length : visibleGallery.length;

  return (
    <>
      {/* Controls */}
      <div className="sticky top-[72px] z-40 -mx-[clamp(1.25rem,4vw,3.5rem)] border-y border-line bg-ink/85 px-[clamp(1.25rem,4vw,3.5rem)] py-4 backdrop-blur-xl md:top-[86px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by category">
            {FILTERS.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={cn(
                    "relative border px-5 py-2.5 text-[0.64rem] font-medium tracking-[0.18em] uppercase transition-all duration-500",
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

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 lg:w-64 lg:flex-none">
              <Search
                size={14}
                aria-hidden="true"
                className="absolute top-1/2 left-3.5 -translate-y-1/2 text-faint"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search work"
                aria-label="Search work"
                className="w-full border border-line bg-transparent py-2.5 pr-9 pl-10 text-[0.72rem] tracking-[0.08em] text-bone placeholder:text-faint focus:border-accent focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-faint transition-colors hover:text-bone"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              )}
            </div>

            {/* View toggle */}
            <div
              className="flex border border-line"
              role="group"
              aria-label="Change layout"
            >
              <button
                onClick={() => setView("projects")}
                aria-pressed={view === "projects"}
                aria-label="Project view"
                className={cn(
                  "flex h-[42px] w-[42px] items-center justify-center transition-colors duration-400",
                  view === "projects" ? "bg-bone text-ink" : "text-mute hover:text-bone"
                )}
              >
                <LayoutGrid size={15} strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                onClick={() => setView("gallery")}
                aria-pressed={view === "gallery"}
                aria-label="Gallery view"
                className={cn(
                  "flex h-[42px] w-[42px] items-center justify-center transition-colors duration-400",
                  view === "gallery" ? "bg-bone text-ink" : "text-mute hover:text-bone"
                )}
              >
                <Images size={15} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="eyebrow mt-6" aria-live="polite">
        {pad(count)} {view === "projects" ? (count === 1 ? "Project" : "Projects") : "Frames"}
        {filter !== "all" && ` — ${FILTERS.find((f) => f.id === filter)?.label}`}
      </p>

      {/*
        Project cards render <h3>. Without this the document jumped h1 -> h3,
        which fails axe's heading-order check and makes the page harder to
        navigate by headings in a screen reader. Visually hidden by design —
        the count line above already communicates this to sighted users.
      */}
      <h2 className="sr-only">Work</h2>

      {/* Results */}
      {count === 0 ? (
        <div className="flex flex-col items-center gap-5 py-32 text-center">
          <p className="display text-4xl">Nothing here yet</p>
          <p className="max-w-sm text-sm text-mute">
            No work matches that search. Try a different term or clear the filters.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="border border-line-strong px-6 py-3 text-[0.64rem] tracking-[0.2em] uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Reset
          </button>
        </div>
      ) : view === "projects" ? (
        <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="mt-8 columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4"
        >
          <AnimatePresence mode="popLayout">
            {visibleGallery.map(({ media, project }, i) => (
              <motion.button
                key={`${project.slug}-${media}`}
                layout
                initial={{ opacity: 0, filter: "blur(8px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: (i % 8) * 0.03 }}
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
                    <p className="mt-1 text-[0.68rem] tracking-wide text-mute">
                      {project.subject}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Lightbox
        items={lightboxItems}
        index={lightbox}
        onClose={() => setLightbox(null)}
        onIndexChange={setLightbox}
      />
    </>
  );
}
