import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Hero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { Services } from "@/components/home/services";
import { ReelPanel } from "@/components/home/reel-panel";
import { ProjectCard } from "@/components/portfolio/project-card";
import { ShowreelIntro } from "@/components/chrome/showreel-intro";
import { Pipeline } from "@/components/home/pipeline";
import { MonthlyCard } from "@/components/pricing/monthly-card";
import { SectionHeader } from "@/components/ui/section";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Magnetic } from "@/components/ui/magnetic";
import { Frame } from "@/components/ui/frame";
import { ReviewsMarquee } from "@/components/reviews/reviews-marquee";
import { projects, categories } from "@/data/projects";
import { publicReviews } from "@/data/reviews";
import {
  packages,
  benefits,
  ownerPledge,
  pipelineNote,
  batchNote,
  monthlyPackages,
  monthlyNote,
} from "@/data/site";
import { pad } from "@/lib/utils";

export default function HomePage() {
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <>
      {/* The business-card landing. Overlays this page once per visit. */}
      <ShowreelIntro />

      <Hero />
      <Marquee />

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section className="shell py-24 md:py-36" aria-labelledby="about-heading">
        <div className="grid gap-14 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="text-accent">01</span>
                <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
                The Studio
              </p>
            </Reveal>
            <h2
              id="about-heading"
              className="display text-[14vw] leading-[0.86] sm:text-[10vw] md:text-[5vw]"
            >
              <TextReveal text="One Man." />
              <br />
              <TextReveal text="Every Step." delay={0.12} />
            </h2>
          </div>

          <div className="flex flex-col gap-7 md:col-span-6 md:col-start-7">
            <Reveal delay={0.08}>
              <p className="body-lg text-pretty">
                508 Filmzz is built on one vision. Every shoot is personally planned,
                filmed, edited, and delivered by me.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="text-sm leading-relaxed text-mute md:text-base">
                No outsourcing. No shortcuts. Just premium storytelling and attention to
                detail — the kind that makes a local business look like it has a national
                budget behind it.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-2">
                <Magnetic href="/about" variant="outline">
                  More about the work
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </div>

      </section>

      {/* ── Why it is worth paying for ────────────────────────────────────
        Sits before any price on the page. A figure means nothing until the
        reader knows what it is for, and this is the answer in the language a
        business owner already uses rather than in production terms.
      */}
      <section className="shell pb-24 md:pb-36" aria-labelledby="why-heading">
        <SectionHeader
          id="why-heading"
          index="02"
          eyebrow="Why It Matters"
          title="More Than Just A Video."
          lead="Your customers are already scrolling. Make sure they stop on your business."
        />

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 0.06} className="bg-ink p-7 md:p-8">
              <p className="eyebrow mb-5 text-accent">{pad(i + 1)}</p>
              <h3 className="display text-2xl leading-none md:text-[1.6rem]">
                {item.title}
              </h3>
              <p className="mt-3.5 text-[0.84rem] leading-relaxed text-mute">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>

        {/* The objection those four cards raise: yes, but who does all that? */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col gap-9 border-y border-line py-12 md:flex-row md:items-end md:justify-between md:gap-14 md:py-14">
            <div>
              <h3 className="display text-[9vw] leading-[0.94] sm:text-[5.6vw] md:text-[3.2vw]">
                {ownerPledge.lines[0]}
                <br />
                {ownerPledge.lines[1]}
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-mute md:text-base">
                {ownerPledge.body}
              </p>
            </div>
            <Magnetic
              href="/book"
              variant="solid"
              wrapperClassName="w-full shrink-0 sm:w-auto"
              className="w-full sm:w-auto"
            >
              {ownerPledge.cta}
            </Magnetic>
          </div>
        </Reveal>
      </section>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section className="pb-24 md:pb-36" aria-labelledby="services-heading">
        <div className="shell mb-14">
          <SectionHeader
          id="services-heading"
            index="03"
            eyebrow="What I Do"
            title="Services"
            lead="Four ways I film for a business, one operator, one consistent look across everything you publish."
          />
        </div>
        <Services />
      </section>

      {/* ── What the money actually buys ───────────────────────────────────
        Replaces the old four-step process grid. Same idea, a fifth of the
        height: the thing being sold looks from outside like a thirty-second
        video, and a thirty-second video sounds like thirty seconds of work.
      */}
      <section className="shell pb-24 md:pb-36" aria-labelledby="getting-heading">
        <SectionHeader
          id="getting-heading"
          index="04"
          eyebrow="How It Works"
          title="What You're Really Getting"
          lead="You're not just paying for a short video."
        />

        <div className="mt-14">
          <Pipeline />
        </div>

        <Reveal delay={0.12}>
          <p className="display mt-12 max-w-3xl text-[7vw] leading-[1.02] text-balance sm:text-[4.2vw] md:text-[2.5vw]">
            {pipelineNote}
          </p>
        </Reveal>
      </section>

      {/* ── Monthly content ────────────────────────────────────────────────
        The tiers themselves, not a teaser linking to them. Someone who scanned
        a business card is on a phone and will not tap through to a second page
        to find out what it costs — so the numbers are here, and /pricing keeps
        the longer version with the terms.
      */}
      <section className="shell pb-24 md:pb-36" aria-labelledby="monthly-heading">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            id="monthly-heading"
            index="05"
            eyebrow="Ongoing Content"
            title="Monthly Content"
            lead="Consistent content without the hassle."
          />
          <Reveal delay={0.1}>
            <Magnetic href="/pricing" variant="outline">
              Full pricing
            </Magnetic>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line md:grid-cols-2 xl:grid-cols-4">
          {monthlyPackages.map((pkg, i) => (
            <MonthlyCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        {/* Why a schedule beats a one-off, for anyone still weighing the two. */}
        <Reveal delay={0.1}>
          <div className="mt-14 flex flex-col gap-6 border-y border-line py-12 md:flex-row md:items-start md:gap-16 md:py-14">
            <h3 className="display max-w-md text-[8vw] leading-[0.98] text-balance sm:text-[5vw] md:w-1/2 md:shrink-0 md:text-[2.6vw]">
              {batchNote.title}
            </h3>
            <p className="max-w-xl text-sm leading-relaxed text-mute md:pt-2 md:text-base">
              {batchNote.body}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-faint">
            {monthlyNote}
          </p>
        </Reveal>
      </section>

      {/* ── One-time projects ──────────────────────────────────────────────
        Kept separate and after the tiers, for businesses not ready for a
        schedule. Deliberately lighter than the monthly cards: this is the
        smaller commitment and should look like it.
      */}
      <section className="shell pb-24 md:pb-36" aria-labelledby="onetime-heading">
        <SectionHeader
          id="onetime-heading"
          index="06"
          eyebrow="One-Time Projects"
          title="One-Time Projects"
          lead="Not ready for a monthly schedule? Book a single production instead."
        />

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg, i) => (
            <Reveal key={pkg.id} delay={(i % 4) * 0.06} className="flex flex-col justify-between bg-ink p-7 md:p-8">
              <div>
                <h3 className="display text-2xl leading-tight md:text-[1.7rem]">
                  {pkg.name}
                </h3>
                {pkg.price ? (
                  <>
                    <p className="mt-5 text-[0.56rem] tracking-[0.22em] text-faint uppercase">
                      Starting at
                    </p>
                    <p className="display mt-1 text-4xl leading-none text-bone md:text-5xl">
                      {pkg.price}
                    </p>
                  </>
                ) : (
                  <p className="display mt-5 text-3xl leading-none text-bone md:text-4xl">
                    Custom quote
                  </p>
                )}
                <p className="mt-5 text-[0.82rem] leading-relaxed text-mute">
                  {pkg.summary}
                </p>
              </div>
              <div className="mt-7">
                <Magnetic
                  href="/book"
                  variant="outline"
                  wrapperClassName="w-full"
                  className="w-full"
                >
                  Get a Quote
                </Magnetic>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Selected work ─────────────────────────────────────────────────── */}
      <section className="shell py-10 md:py-16" aria-labelledby="work-heading">

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeader
            id="work-heading"
            index="07"
            eyebrow="Selected Work"
            title="Real Businesses. Real Content."
            lead="See how 508 Filmzz turns businesses, products and services into content people actually stop to watch."
          />
          <Reveal delay={0.1}>
            <Magnetic href="/portfolio" variant="outline">
              See every frame
            </Magnetic>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ── Verticals ─────────────────────────────────────────────────────── */}
      <section className="mt-24 md:mt-36" aria-labelledby="verticals-heading">
        <h2 id="verticals-heading" className="sr-only">
          Verticals
        </h2>
        {/*
          Only verticals with work behind them. A category with nothing to show
          would render an empty tile, which reads as a gap rather than a filter;
          adding a project to a new category brings its tile back on its own.
        */}
        <div className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {categories
            .filter((cat) => projects.some((p) => p.category === cat.id))
            .map((cat, i) => {
            const cover = projects.find((p) => p.category === cat.id)!;
            return (
              <Reveal
                key={cat.id}
                delay={i * 0.08}
                className="border-b border-line md:border-r"
              >
                <Link href={cat.href} className="group relative block overflow-hidden">
                  <Parallax distance={54} className="h-[54vh] min-h-[380px]">
                    <div className="h-[calc(100%+54px)] -translate-y-[27px] transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
                      <Frame
                        id={cover.hero}
                        alt={cat.headline}
                        ratio={0.62}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="h-full w-full"
                      />
                    </div>
                  </Parallax>

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/20 transition-all duration-700 group-hover:from-ink"
                  />

                  <div className="absolute inset-x-7 bottom-7">
                    <p className="eyebrow mb-3">{cat.eyebrow}</p>
                    <h3 className="display flex items-center gap-3 text-4xl leading-none md:text-5xl">
                      {cat.headline}
                      <ArrowUpRight
                        size={22}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="translate-y-0.5 opacity-0 transition-all duration-600 group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100"
                      />
                    </h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-mute">
                      {cat.blurb}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>


      <ReelPanel />

      {/*
        ── Reviews ──────────────────────────────────────────────────────────
        Hidden entirely until a real testimonial exists. An empty "Client
        Feedback" heading over a blank marquee looks broken and quietly signals
        that nobody has hired you — worse than not having the section at all.

        Add a real quote to src/data/reviews.ts and this band returns on its
        own. The dedicated /reviews page is parked at src/app/_disabled/reviews
        until then; its header comment explains how to bring it back, and the
        "Read all reviews" button that linked to it belongs right here when you
        do.
      */}
      {publicReviews.length > 0 && (
        <section className="pb-24 md:pb-36" aria-labelledby="reviews-heading">
          <div className="shell mb-14">
            <SectionHeader
          id="reviews-heading" index="08" eyebrow="Client Feedback" title="Reviews" />
          </div>
          <ReviewsMarquee />
        </section>
      )}

      {/* ── Book a shoot ──────────────────────────────────────────────────── */}
      <section className="shell pb-28 md:pb-40" aria-labelledby="book-heading">
        <div className="border-y border-line py-20 text-center md:py-28">
          <Reveal>
            <p className="eyebrow mb-7">Let&apos;s work</p>
          </Reveal>
          <h2
            id="book-heading"
            className="display mx-auto max-w-5xl text-[12vw] leading-[0.88] sm:text-[8vw] md:text-[5.2vw]"
          >
            <TextReveal text="Ready to create something different?" />
          </h2>
          <Reveal delay={0.12}>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <Magnetic href="/book" variant="solid">
                Book a Shoot
              </Magnetic>
              <Magnetic href="/pricing" variant="outline">
                Request a Quote
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
