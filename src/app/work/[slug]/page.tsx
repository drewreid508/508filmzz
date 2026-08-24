import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { projects, getProject, relatedProjects, categories } from "@/data/projects";
import { site } from "@/data/site";
import { getMedia, largest } from "@/lib/media";
import { asset } from "@/lib/asset";
import { Frame } from "@/components/ui/frame";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { VideoModal, PlayButton } from "@/components/ui/video-modal";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { pad } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

/**
 * Every project is known at build time, so anything else is a genuine 404.
 *
 * Without this, an unknown slug renders the not-found page but still answers
 * HTTP 200 — a soft 404 that lets search engines index unlimited bogus
 * /work/<anything> URLs.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found" };

  const hero = largest(getMedia(project.hero));

  return {
    title: `${project.title} — ${project.subject}`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${project.subject}`,
      description: project.summary,
      url: `${site.url}/work/${project.slug}`,
      images: [{ url: hero.webp, width: hero.w, height: hero.h, alt: project.title }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = relatedProjects(project);
  const category = categories.find((c) => c.id === project.category)!;

  return (
    <article>
      {/* Hero */}
      <header className="relative h-[86svh] min-h-[540px] w-full overflow-hidden">
        <Frame
          id={project.hero}
          alt={`${project.title} — ${project.subject}`}
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full"
          imgClassName="brightness-[0.82] saturate-[0.94]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.8)_100%)]"
        />

        <div className="shell relative flex h-full flex-col justify-end pb-14 md:pb-20">
          <Link
            href={category.href}
            className="eyebrow mb-7 inline-flex w-fit items-center gap-2.5 transition-colors duration-400 hover:text-accent"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            {category.headline}
          </Link>

          <h1 className="display text-[16vw] leading-[0.84] sm:text-[12vw] md:text-[8vw]">
            <TextReveal text={project.title} />
          </h1>

          <div className="mt-8 flex flex-col gap-6 border-t border-line pt-7 md:flex-row md:items-center md:justify-between">
            <p className="text-base tracking-wide text-mute md:text-lg">
              {project.subject}
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[0.66rem] tracking-[0.2em] text-faint uppercase">
              <span>{project.year}</span>
              <span aria-hidden="true" className="hidden h-px w-8 bg-line-strong md:block" />
              <span>{category.label}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Brief */}
      <section className="shell py-20 md:py-28" aria-label="Project brief">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow mb-6">The Brief</p>
              <ul className="flex flex-col gap-3 border-t border-line pt-6">
                {project.deliverables.map((d, i) => (
                  <li key={d} className="flex items-baseline gap-4 text-sm text-mute">
                    <span className="eyebrow shrink-0">{pad(i + 1)}</span>
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="md:col-span-7 md:col-start-6">
            {project.description.map((para, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p
                  className={
                    i === 0
                      ? "body-lg text-pretty"
                      : "mt-6 text-sm leading-relaxed text-mute md:text-base"
                  }
                >
                  {para}
                </p>
              </Reveal>
            ))}

            {project.video && (
              <Reveal delay={0.2}>
                <div className="mt-12 border-t border-line pt-10">
                  <VideoModal
                    src={asset(project.video.src)}
                    title={`${project.title} — ${project.video.label}`}
                    aspect={project.video.aspect}
                    trigger={<PlayButton label={`Play ${project.video.label}`} />}
                  />
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="shell pb-24 md:pb-36" aria-label="Gallery">
        <Reveal>
          <div className="mb-8 flex items-end justify-between border-t border-line pt-10">
            <h2 className="display text-4xl md:text-5xl">Frames</h2>
            <p className="eyebrow">{pad(project.gallery.length)} Stills</p>
          </div>
        </Reveal>
        <ProjectGallery project={project} />
      </section>

      {/* CTA */}
      <section className="shell pb-24 md:pb-36">
        <div className="flex flex-col items-start justify-between gap-8 border-y border-line py-16 md:flex-row md:items-center md:py-20">
          <div>
            <p className="eyebrow mb-4">Want this for your build?</p>
            <p className="display text-5xl leading-none md:text-6xl">
              Start a project<span className="text-accent">.</span>
            </p>
          </div>
          <Magnetic href="/contact" variant="solid">
            Book a Shoot
          </Magnetic>
        </div>
      </section>

      {/* Related */}
      <section className="shell pb-28 md:pb-40" aria-labelledby="related-heading">
        <h2 id="related-heading" className="display mb-10 text-4xl md:text-5xl">
          Related work
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>
    </article>
  );
}
