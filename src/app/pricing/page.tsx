import type { Metadata } from "next";
import { Check } from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import {
  packages,
  monthlyPackages,
  pricingNote,
  monthlyNote,
  monthlyCommitment,
  valueProps,
  valueStatement,
  faqs,
  site,
} from "@/data/site";
import { cn, pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "One-off production packages for social, automotive, commercial and drone work, plus monthly content partnerships from $700. Every project custom quoted.",
  alternates: { canonical: "/pricing" },
};

/**
 * One card, used by both grids.
 *
 * The two sections have to read as siblings — same rule, same numbering, same
 * button — or the monthly tiers look like a bolted-on afterthought. Sharing the
 * component is what guarantees that, rather than two copies drifting apart the
 * first time either is edited.
 */
function PriceCard({
  index,
  name,
  price,
  summary,
  includes,
  featured,
  /** Appended after the figure. Monthly tiers pass "/month"; one-offs pass none. */
  cadence,
}: {
  index: number;
  name: string;
  price: string | null;
  summary: string;
  includes: string[];
  featured?: boolean;
  cadence?: string;
}) {
  return (
    <Reveal
      delay={(index % 3) * 0.06}
      className={cn(
        "relative flex flex-col justify-between bg-ink p-8 md:p-10",
        featured && "bg-ink-2"
      )}
    >
      {featured && (
        <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-accent" />
      )}

      <div>
        <div className="mb-7 flex items-start justify-between gap-4">
          <p className="eyebrow">{pad(index + 1)}</p>
          {featured && (
            <span className="border border-accent px-2.5 py-1 text-[0.58rem] font-medium tracking-[0.18em] text-accent uppercase">
              Most booked
            </span>
          )}
        </div>

        <h3 className="display text-3xl leading-none md:text-[2.1rem]">{name}</h3>

        {/*
          A null price is a real state, not a missing one — the custom tier has
          no figure to start from. It gets the same visual weight as a number so
          the card does not read as unfinished next to the priced ones.
        */}
        {price ? (
          <>
            <p className="mt-5 text-[0.6rem] tracking-[0.22em] text-faint uppercase">
              Starting at
            </p>
            <p className="display mt-1 flex items-baseline gap-1.5 text-5xl leading-none text-bone md:text-6xl xl:text-[3.4rem]">
              {price}
              {cadence && (
                <span className="text-lg tracking-normal text-faint md:text-xl">
                  {cadence}
                </span>
              )}
            </p>
          </>
        ) : (
          <>
            <p className="mt-5 text-[0.6rem] tracking-[0.22em] text-faint uppercase">
              Priced per brand
            </p>
            <p className="display mt-1 text-4xl leading-none text-bone md:text-5xl xl:text-[2.6rem]">
              Custom quote
            </p>
          </>
        )}

        <p className="mt-5 text-sm leading-relaxed text-mute">{summary}</p>

        <ul className="mt-7 flex flex-col gap-2.5 border-t border-line pt-6">
          {includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[0.82rem] text-mute">
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
          variant={featured ? "solid" : "outline"}
          wrapperClassName="w-full"
          className="w-full"
        >
          Get a Quote
        </Magnetic>
      </div>
    </Reveal>
  );
}

export default function PricingPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Investment"
        title="Pricing"
        lead="Two ways to work together: book a single production, or put the camera on a schedule. Every project is quoted on shoot time, location, and what you need delivered — so you always know what you're paying for."
      />

      {/* ── Why it is worth paying for ────────────────────────────────────── */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="value-heading">
        <SectionHeader
          id="value-heading"
          index="02"
          eyebrow="What It's For"
          title="Turn Views Into Customers"
          lead="Your business deserves more than a video that looks good. Every piece is built to do a job — get seen, earn trust, and end in someone getting in touch."
        />

        {/*
          The bordered five-across grid is the same construction the Drone page
          uses for its inclusions, so this reads as part of the site rather than
          a sales page dropped into it. One across on a phone and two from 640px
          up: at five columns these bodies wrap to six or seven lines, which
          stops being scannable.
        */}
        <div className="mt-14 grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {valueProps.map((item, i) => (
            <Reveal key={item.title} delay={(i % 5) * 0.05} className="bg-ink p-7 md:p-8">
              <p className="eyebrow mb-5 text-accent">{pad(i + 1)}</p>
              <h3 className="display text-2xl leading-none md:text-[1.6rem]">
                {item.title}
              </h3>
              <p className="mt-3.5 text-[0.82rem] leading-relaxed text-mute">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="display mt-14 max-w-4xl text-[7vw] leading-[0.98] text-balance sm:text-[4.4vw] md:text-[2.7vw]">
            {valueStatement}
          </p>
          <p className="eyebrow mt-6">
            508 Filmzz <span className="text-accent">—</span> {site.tagline}
          </p>
        </Reveal>
      </section>

      {/* ── One-off packages ──────────────────────────────────────────────── */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="oneoff-heading">
        <SectionHeader
          id="oneoff-heading"
          index="03"
          eyebrow="Single Productions"
          title="One-Off Packages"
          lead="Book a shoot when you need one. Priced per production, delivered, done — no commitment past the project."
        />

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg, i) => (
            <PriceCard
              key={pkg.id}
              index={i}
              name={pkg.name}
              price={pkg.price}
              summary={pkg.summary}
              includes={pkg.includes}
              featured={pkg.featured}
            />
          ))}

          {/*
            Fills the hole five cards leave in the last row.

            The hairline rules between cards are the container's background
            showing through a 1px gap, so an empty cell shows that background as
            a solid grey panel — a card-shaped block with nothing in it. One
            filler covers both breakpoints: five items leave exactly one gap in
            a two-column grid and one in a three-column grid. Single column
            needs none, hence hidden below md.
          */}
          <div aria-hidden="true" className="hidden bg-ink md:block" />
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            {pricingNote}
          </p>
        </Reveal>
      </section>

      {/* ── Monthly content ───────────────────────────────────────────────── */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="monthly-heading">
        <SectionHeader
          id="monthly-heading"
          index="04"
          eyebrow="Recurring Partnership"
          title="Monthly Content"
          lead="One shoot builds a campaign. A schedule builds a brand. A monthly package is a standing production slot — the same standard as any single shoot, booked on a rhythm — so there is always something new to publish and one consistent look running through all of it."
        />

        {/*
          Two across before four. These carry longer lists than the one-off
          cards, and four columns below 1280px squeezes the price and wraps the
          checklist mid-phrase.
        */}
        <div className="mt-14 grid gap-px border-t border-l border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {monthlyPackages.map((pkg, i) => (
            <PriceCard
              key={pkg.id}
              index={i}
              name={pkg.name}
              price={pkg.price}
              summary={pkg.summary}
              includes={pkg.includes}
              featured={pkg.featured}
              cadence="/mo"
            />
          ))}
        </div>

        {/*
          Terms, set out like any other part of the offer.

          A boxed notice in a warning colour would read as small print and put a
          question in the reader's mind at the exact moment they are weighing
          the price. This uses the same label-left, copy-right rule the rest of
          the page already uses for section headers, so it reads as one more
          detail of the package — which is what it is. It sits below the cards
          on purpose: it answers a question the prices raise, so it has to come
          after them.
        */}
        <Reveal delay={0.08}>
          <div className="mt-14 flex flex-col gap-6 border-y border-line py-10 md:flex-row md:items-start md:gap-16 md:py-12">
            <div className="md:w-60 md:shrink-0">
              <p className="eyebrow mb-3 text-accent">Commitment</p>
              <h3 className="display text-3xl leading-none md:text-[2.1rem]">
                {monthlyCommitment.label}
              </h3>
            </div>

            <div className="flex max-w-2xl flex-col gap-3 md:pt-1">
              <p className="text-sm leading-relaxed text-mute md:text-base">
                {monthlyCommitment.body}
              </p>
              <p className="text-sm leading-relaxed text-faint">
                {monthlyCommitment.custom}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            {monthlyNote}
          </p>
        </Reveal>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────────── */}
      {/*
        One band, two actions. This replaced a separate "Something bigger?"
        block that sat directly below: two full-width call-to-action bands back
        to back split the reader's attention at the exact point the page is
        asking for a decision. Both buttons still go to /contact, and the direct
        email line is kept for anyone who would rather not use a form.
      */}
      <section className="shell pb-24 md:pb-32">
        <div className="border-y border-line py-16 md:py-20">
          <div className="flex flex-col items-start justify-between gap-9 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-5">Ready to get more attention?</p>
              <p className="display max-w-3xl text-[10vw] leading-[0.9] text-balance sm:text-[6vw] md:text-[3.8vw]">
                Make people stop scrolling<span className="text-accent">.</span>
              </p>
              <p className="body-lg mt-6 max-w-xl">
                Content that gets your work seen and makes people want to do
                business with you. Book your next shoot, or tell me about a
                bigger campaign and I&apos;ll quote it per brand.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col md:items-end">
              <Magnetic
                href="/contact"
                variant="solid"
                wrapperClassName="w-full sm:w-auto"
                className="w-full sm:w-auto"
              >
                Book a Shoot
              </Magnetic>
              <Magnetic
                href="/contact"
                variant="outline"
                wrapperClassName="w-full sm:w-auto"
                className="w-full sm:w-auto"
              >
                Get a Custom Quote
              </Magnetic>
            </div>
          </div>

          <p className="mt-10 text-[0.7rem] tracking-[0.2em] text-faint uppercase">
            Or reach me directly{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-mute transition-colors duration-400 hover:text-accent"
            >
              {site.email}
            </a>
          </p>
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
