import type { Metadata } from "next";
import { Check } from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { packages, pricingNote, faqs, site } from "@/data/site";
import { cn, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Starting rates for social content, automotive production, commercial production, drone coverage, and full content packages. Every project custom quoted.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Investment"
        title="Pricing"
        lead="Straight starting points, not a maze of tiers. Every project is quoted on shoot time, location, and what you need delivered — so you always know what you're paying for."
      />

      {/* ── Packages ──────────────────────────────────────────────────────── */}
      <section className="shell pb-16 md:pb-20" aria-label="Packages">
        <div className="grid gap-px border-t border-l border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <Reveal
              key={pkg.id}
              delay={(i % 3) * 0.06}
              className={cn(
                "relative flex flex-col justify-between bg-ink p-8 md:p-10",
                pkg.featured && "bg-ink-2"
              )}
            >
              {pkg.featured && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-px w-full bg-accent"
                />
              )}

              <div>
                <div className="mb-7 flex items-start justify-between gap-4">
                  <p className="eyebrow">{pad(i + 1)}</p>
                  {pkg.featured && (
                    <span className="border border-accent px-2.5 py-1 text-[0.58rem] font-medium tracking-[0.18em] text-accent uppercase">
                      Most booked
                    </span>
                  )}
                </div>

                <h2 className="display text-3xl leading-none md:text-[2.1rem]">
                  {pkg.name}
                </h2>

                <p className="mt-5 flex items-baseline gap-2">
                  <span className="text-[0.6rem] tracking-[0.22em] text-faint uppercase">
                    Starting at
                  </span>
                </p>
                <p className="display mt-1 text-6xl leading-none text-bone md:text-7xl">
                  {pkg.price}
                </p>

                <p className="mt-5 text-sm leading-relaxed text-mute">{pkg.summary}</p>

                <ul className="mt-7 flex flex-col gap-2.5 border-t border-line pt-6">
                  {pkg.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-[0.82rem] text-mute"
                    >
                      <Check
                        size={12}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-accent"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-9">
                <Magnetic
                  href="/contact"
                  variant={pkg.featured ? "solid" : "outline"}
                  wrapperClassName="w-full"
                  className="w-full"
                >
                  Get a Quote
                </Magnetic>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            {pricingNote}
          </p>
        </Reveal>
      </section>

      {/* ── Custom quote ──────────────────────────────────────────────────── */}
      <section className="shell pb-24 md:pb-32">
        <div className="flex flex-col items-start justify-between gap-8 border-y border-line py-16 md:flex-row md:items-center md:py-20">
          <div>
            <p className="eyebrow mb-4">Something bigger?</p>
            <p className="display text-[11vw] leading-[0.9] sm:text-[6vw] md:text-[4vw]">
              Get a custom quote<span className="text-accent">.</span>
            </p>
            <p className="body-lg mt-5 max-w-lg">
              Multi-car shoots, monthly content, dealership retainers, and full
              campaigns are all quoted per project.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Magnetic href="/contact" variant="solid">
              Get a Custom Quote
            </Magnetic>
            <a
              href={`mailto:${site.email}`}
              className="text-center text-[0.7rem] tracking-[0.2em] text-mute uppercase transition-colors duration-400 hover:text-accent"
            >
              {site.email}
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="shell pb-28 md:pb-40" aria-labelledby="pricing-faq">
        <h2 id="pricing-faq" className="display text-4xl md:text-5xl">
          Good to know
        </h2>

        <dl className="mt-10 border-t border-line">
          {faqs.map((item, i) => (
            <Reveal
              key={item.q}
              delay={i * 0.04}
              className="grid gap-3 border-b border-line py-7 md:grid-cols-12 md:gap-10 md:py-9"
            >
              <dt className="display flex items-start gap-4 text-xl leading-tight md:col-span-5 md:text-2xl">
                <span className="eyebrow mt-1.5 shrink-0">{pad(i + 1)}</span>
                {item.q}
              </dt>
              <dd className="text-sm leading-relaxed text-mute md:col-span-6 md:col-start-7 md:text-base">
                {item.a}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
