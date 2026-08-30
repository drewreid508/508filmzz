import type { Metadata } from "next";
import { Check } from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { Frame } from "@/components/ui/frame";
import { services, process, site } from "@/data/site";
import { hasMedia } from "@/lib/media";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Automotive cinematography, social media content, commercial production, drone services, photography, and video editing — serving Greenville and Upstate South Carolina.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="What I Do"
        title="Services"
        lead="Six ways to make your brand look like it belongs at the top of the market. Book one, or run the whole production through a single shoot."
      />

      {/* ── Service detail ────────────────────────────────────────────────── */}
      <section className="shell pb-24 md:pb-32" aria-label="Service detail">
        <div className="flex flex-col">
          {services.map((service, i) => (
            <Reveal
              key={service.id}
              className="grid gap-8 border-t border-line py-14 md:grid-cols-12 md:gap-12 md:py-20"
            >
              {/* Index + title */}
              <div className="md:col-span-5">
                <p className="eyebrow mb-5 flex items-center gap-3">
                  <span className="text-accent">{pad(i + 1)}</span>
                  <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                  {service.id === "drone" ? "New" : "Service"}
                </p>
                <h2 className="display text-[11vw] leading-[0.9] sm:text-[7vw] md:text-[3.6vw]">
                  {service.title}
                </h2>
                <p className="body-lg mt-5 max-w-md">{service.blurb}</p>
              </div>

              {/* Checklist */}
              <ul className="flex flex-col gap-3 md:col-span-4">
                {service.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-mute">
                    <Check
                      size={13}
                      strokeWidth={2}
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-accent"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              {/* Optional visual — services without a plate simply run wider. */}
              {service.image && hasMedia(service.image) && (
                <div className="md:col-span-3">
                  <div className="brackets overflow-hidden">
                    <Frame
                      id={service.image}
                      alt={service.title}
                      ratio={9 / 16}
                      sizes="(max-width: 768px) 92vw, 24vw"
                    />
                  </div>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section className="shell pb-24 md:pb-32" aria-labelledby="process-heading">
        <SectionHeader
          id="process-heading" index="02" eyebrow="How It Works" title="The Process" />

        <ol className="mt-12 grid gap-px border-t border-l border-line bg-line md:grid-cols-4">
          {process.map((item, i) => (
            <li key={item.step} className="bg-ink p-8 md:p-10">
              <span className="display mb-6 block text-5xl text-accent md:text-6xl">
                {pad(i + 1)}
              </span>
              <h3 className="display text-2xl md:text-3xl">{item.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="shell pb-28 md:pb-40">
        <div className="flex flex-col items-start justify-between gap-8 border-y border-line py-16 md:flex-row md:items-center md:py-20">
          <div>
            <p className="eyebrow mb-4">Not sure which one you need?</p>
            <p className="display text-[10vw] leading-[0.9] sm:text-[6vw] md:text-[3.6vw]">
              Tell me the goal<span className="text-accent">.</span>
            </p>
            <p className="body-lg mt-4 max-w-md">
              Describe what you want the finished piece to do and I&apos;ll tell you
              what it takes.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Magnetic href="/book" variant="solid">
              Book a Shoot
            </Magnetic>
            <Magnetic href="/pricing" variant="outline">
              See Pricing
            </Magnetic>
          </div>
        </div>

        <p className="mt-8 text-sm text-faint">
          Prefer to talk?{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-mute transition-colors duration-400 hover:text-accent"
          >
            {site.email}
          </a>
        </p>
      </section>
    </>
  );
}
