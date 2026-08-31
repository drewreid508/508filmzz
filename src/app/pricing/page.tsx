import type { Metadata } from "next";
import { Check } from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { MonthlyCard } from "@/components/pricing/monthly-card";
import {
  packages,
  monthlyPackages,
  pricingNote,
  monthlyNote,
  monthlyCommitment,
  newClientOffer,
  commitmentTiers,
  faqs,
  site,
} from "@/data/site";
import { cn, pad } from "@/lib/utils";
import { DISCOUNT_LABEL } from "@/lib/offer";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Commercial video and advertising production in Greenville, SC. Projects from $750, commercials from $1,250, campaigns from $2,000, and monthly content partnerships. Every project quoted individually.",
  alternates: { canonical: "/pricing" },
};

/**
 * One one-off project card.
 *
 * The monthly tiers used to share this component and no longer do — they carry
 * reels, shoots, drone and stills, which a single booking has no equivalent
 * for, and forcing both through one card meant half its props were dead on
 * every render. They live in MonthlyCard now, which the homepage renders too,
 * so the tiers still cannot drift between pages.
 */
function PriceCard({
  index,
  name,
  price,
  summary,
  includes,
  featured,
  /** Appended after the figure. Unused by the one-off grid, kept for clarity. */
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
          href="/book"
          variant={featured ? "solid" : "outline"}
          wrapperClassName="w-full"
          className="w-full"
        >
          {price ? "Get a Quote" : "Get a Custom Quote"}
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
        lead="Two ways to work together: book a single production, or put your content on a schedule. Everything is quoted on production time, locations, travel and what you need delivered — so the number you get is the number you pay."
      />

      {/* ── Monthly content ───────────────────────────────────────────────── */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="monthly-heading">
        <SectionHeader
          id="monthly-heading"
          index="02"
          eyebrow="Ongoing Content"
          title="Monthly Content"
          lead="A monthly package is a standing production slot on your calendar — so there is always something new to publish, one consistent look across all of it, and ad creative ready when you need it."
        />

        {/*
          Two across before four. These carry longer lists than the one-off
          cards, and four columns below 1280px squeezes the price and wraps the
          checklist mid-phrase.
        */}
        {/*
          The offer sits above the tiers, not inside one.
          ──────────────────────────────────────────────────────────────────
          A badge on a card would read as that package being on sale. This is a
          term of starting a partnership, so it is stated once, in the accent,
          and the cards carry only their own derived first-month line.

          Deliberately no struck-through prices and no "was/now": that is the
          grammar of a clearance, and it teaches a client the standard rate is
          negotiable.
        */}
        <Reveal delay={0.06}>
          <div className="relative mt-14 overflow-hidden border border-accent/45 bg-accent/[0.055] p-8 md:p-11">
            <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-accent" />

            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-14">
              <div>
                <p className="eyebrow mb-4 text-accent">{newClientOffer.eyebrow}</p>
                <h3 className="display text-[9vw] leading-[0.92] text-balance sm:text-[5.4vw] md:text-[3.1vw]">
                  {DISCOUNT_LABEL} off your first month
                </h3>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-mute md:text-base">
                  {newClientOffer.body}
                </p>
              </div>

              <Magnetic
                href="/book"
                variant="solid"
                wrapperClassName="w-full shrink-0 sm:w-auto"
                className="w-full sm:w-auto"
              >
                {newClientOffer.cta}
              </Magnetic>
            </div>

            <ul className="mt-9 flex flex-col gap-2.5 border-t border-accent/25 pt-7 sm:grid sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4">
              {newClientOffer.terms.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[0.78rem] text-mute">
                  <span aria-hidden="true" className="mt-[0.44rem] h-1 w-1 shrink-0 bg-accent" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px border-t border-l border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {monthlyPackages.map((pkg, i) => (
            <MonthlyCard key={pkg.id} pkg={pkg} index={i} />
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
              <p className="text-sm leading-relaxed text-mute md:text-base">
                The introductory rate applies to month one only. The rest of the
                term is billed at the standard quoted price for your package.
              </p>
              <p className="text-sm leading-relaxed text-faint">
                {monthlyCommitment.custom}
              </p>
            </div>
          </div>
        </Reveal>

        {/*
          Term lengths.
          ──────────────────────────────────────────────────────────────────
          "Billed monthly" is stated on the block rather than in a footnote:
          "12 months" beside a saving reads as a sum due today, and a client who
          thinks a year is being asked for up front stops reading before the
          correction. The percentages come from the data, so the labels cannot
          drift from what is actually offered.
        */}
        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-px border-t border-l border-line bg-line sm:grid-cols-3">
            {commitmentTiers.map((tier) => (
              <div key={tier.term} className="bg-ink p-7 md:p-8">
                <p className="display text-3xl leading-none md:text-[2rem]">
                  {tier.term}
                </p>
                <p
                  className={cn(
                    "mt-3 text-[0.72rem] font-medium tracking-[0.18em] uppercase",
                    tier.saving > 0 ? "text-accent" : "text-faint"
                  )}
                >
                  {tier.saving > 0
                    ? `Save ${Math.round(tier.saving * 100)}% monthly`
                    : "Standard rate"}
                </p>
                <p className="mt-4 text-[0.82rem] leading-relaxed text-mute">
                  {tier.note}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-faint">
            Longer commitments receive preferred monthly pricing. Every package is
            billed monthly — nothing is charged up front for the full term.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            {monthlyNote}
          </p>
        </Reveal>
      </section>

      {/* ── One-off packages ──────────────────────────────────────────────── */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="oneoff-heading">
        <SectionHeader
          id="oneoff-heading"
          index="03"
          eyebrow="Project Work"
          title="Single Productions"
          lead="Not ready for a schedule? Book one production and use what comes out of it everywhere. Priced per project, delivered, done — no commitment past the job."
        />

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
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
            No filler cell here any more. Four one-off packages divide evenly
            into one, two and four columns, so no empty grid cell is left for
            the container background to show through.
          */}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            {pricingNote}
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
                href="/book"
                variant="solid"
                wrapperClassName="w-full sm:w-auto"
                className="w-full sm:w-auto"
              >
                Start Your Project
              </Magnetic>
              <Magnetic
                href="/book"
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
