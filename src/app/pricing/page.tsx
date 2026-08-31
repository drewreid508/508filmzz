import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import {
  customMarketing,
  services,
  servicesNote,
  process,
  industries,
  industriesNote,
  faqs,
  site,
} from "@/data/site";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Custom Marketing",
  description:
    "508 Filmzz builds custom marketing for automotive dealerships, construction companies, builders, real estate and established businesses in South Carolina. No packages — strategy, creative, media and advertising priced around your goals. Request a custom quote.",
  alternates: { canonical: "/pricing" },
};

/**
 * The page where a price list used to be.
 *
 * ── Why the route is still /pricing ────────────────────────────────────────
 * Business owners type the word "pricing", and they search it. The page does
 * answer the question — the answer is that the number comes out of the brief
 * rather than a menu — so the URL keeps working for the search that brought
 * them, and every existing link to it still lands somewhere true.
 *
 * ── Why there is no figure anywhere ────────────────────────────────────────
 * A published number invites a business to decide whether it can afford this
 * before it has said what it needs, and it invites the wrong comparison: rate
 * against rate, rather than what the work is supposed to bring back. The
 * businesses worth taking on are the ones weighing the outcome.
 *
 * What replaces the number is not silence. `customMarketing.factors` says what
 * actually moves a quote, so the absence reads as a considered position rather
 * than an evasion — the objection here is never "how much", it is "why won't
 * you tell me".
 */
export default function CustomMarketingPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow={customMarketing.eyebrow}
        title={customMarketing.title}
        lead={customMarketing.body}
      />

      {/* ── The offer, stated once and plainly ────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="custom-heading">
        <h2 id="custom-heading" className="sr-only">
          How pricing works
        </h2>

        <Reveal>
          <div className="relative overflow-hidden border border-accent/45 bg-accent/[0.055] p-8 md:p-12">
            <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-accent" />

            <div className="flex flex-col gap-9 md:flex-row md:items-end md:justify-between md:gap-14">
              <div>
                <p className="eyebrow mb-5 text-accent">Every engagement is quoted</p>
                <p className="body-lg max-w-2xl text-balance">
                  {customMarketing.detail}
                </p>
              </div>

              <Magnetic
                href="/book"
                variant="solid"
                wrapperClassName="w-full shrink-0 sm:w-auto"
                className="w-full sm:w-auto"
              >
                {customMarketing.cta}
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── What actually moves the number ────────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="factors-heading">
        <SectionHeader
          id="factors-heading"
          index="02"
          eyebrow="What It Depends On"
          title="Why There Isn't A Number Here"
          lead="Not evasion — these are the four things that decide what an engagement costs, and none of them are knowable until you tell me about the business."
        />

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {customMarketing.factors.map((factor, i) => (
            <Reveal key={factor.title} delay={(i % 4) * 0.06} className="bg-ink p-7 md:p-8">
              <p className="eyebrow mb-5 text-accent">{pad(i + 1)}</p>
              <h3 className="display text-2xl leading-none md:text-[1.6rem]">
                {factor.title}
              </h3>
              <p className="mt-3.5 text-[0.84rem] leading-relaxed text-mute">
                {factor.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── What can be in it ─────────────────────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="scope-heading">
        <SectionHeader
          id="scope-heading"
          index="03"
          eyebrow="What Goes In It"
          title="Marketing, Media, Creative"
          lead={servicesNote}
        />

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line md:grid-cols-3">
          {services.map((group, i) => (
            <Reveal key={group.id} delay={i * 0.07} className="bg-ink p-7 md:p-9">
              <p className="eyebrow mb-5 text-accent">{pad(i + 1)}</p>
              <h3 className="display text-3xl leading-none md:text-[2.1rem]">
                {group.title}
              </h3>
              <p className="mt-4 text-[0.84rem] leading-relaxed text-mute">
                {group.blurb}
              </p>
              <ul className="mt-7 flex flex-col gap-2.5 border-t border-line pt-6">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.82rem] text-mute"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.5rem] h-1 w-1 shrink-0 bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How it runs ───────────────────────────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="process-heading">
        <SectionHeader
          id="process-heading"
          index="04"
          eyebrow="How It Runs"
          title="Strategy First"
          lead="The order matters more than any single piece of it."
        />

        <ol className="mt-14 grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {process.map((item, i) => (
            <li key={item.step} className="bg-ink p-7 md:p-8">
              <span className="display mb-6 block text-4xl text-accent md:text-5xl">
                {pad(i + 1)}
              </span>
              <h3 className="display text-2xl md:text-[1.7rem]">{item.step}</h3>
              <p className="mt-3 text-[0.82rem] leading-relaxed text-mute">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Who this is for ───────────────────────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="who-heading">
        <SectionHeader
          id="who-heading"
          index="05"
          eyebrow="Who I Work With"
          title="Businesses With Something To Defend"
          lead={industriesNote}
        />

        <ul className="mt-12 flex flex-wrap gap-2.5">
          {industries.map((industry) => (
            <li
              key={industry}
              className="border border-line px-4 py-2.5 text-[0.78rem] tracking-[0.04em] text-mute"
            >
              {industry}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Questions ─────────────────────────────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="faq-heading">
        <SectionHeader id="faq-heading" index="06" eyebrow="Before You Ask" title="Questions" />

        <dl className="mt-12 flex flex-col border-t border-line">
          {faqs.map((faq) => (
            <Reveal key={faq.q} className="border-b border-line py-8 md:py-10">
              <dt className="display text-2xl leading-tight md:text-3xl">{faq.q}</dt>
              <dd className="mt-3 max-w-3xl text-sm leading-relaxed text-mute md:text-base">
                {faq.a}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* ── Closing ───────────────────────────────────────────────────────── */}
      <section className="shell pb-28 md:pb-40">
        <div className="border-y border-line py-16 md:py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-14">
            <div>
              <p className="eyebrow mb-5">Next step</p>
              <h2 className="display max-w-3xl text-[10vw] leading-[0.92] text-balance sm:text-[6vw] md:text-[3.4vw]">
                Tell me what you&apos;re trying to grow.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-mute md:text-base">
                A short brief is enough to start. I&apos;ll come back with what I
                think the right approach is and what it takes to run it.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Magnetic
                href="/book"
                variant="solid"
                wrapperClassName="w-full sm:w-auto"
                className="w-full sm:w-auto"
              >
                {customMarketing.cta}
              </Magnetic>
              <Magnetic
                href={`tel:${site.phoneE164}`}
                variant="outline"
                wrapperClassName="w-full sm:w-auto"
                className="w-full sm:w-auto"
              >
                {site.phone}
              </Magnetic>
            </div>
          </div>

          <p className="mt-10 flex items-center gap-3 text-[0.78rem] text-faint">
            <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" className="text-accent" />
            No package prices, because there are no packages. Every proposal is
            written for the business it is going to.
          </p>
        </div>
      </section>
    </>
  );
}
