/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS PAGE IS PARKED. IT IS NOT LIVE.
 * ─────────────────────────────────────────────────────────────────────────────
 * Any folder in `src/app` starting with an underscore is a Next.js *private
 * folder* — it is excluded from routing entirely, so nothing under
 * `_disabled/` is built or published. The file is kept here rather than
 * deleted so bringing it back is a move, not a rewrite.
 *
 * TO PUT REVIEWS BACK, once you have real quotes:
 *
 *   1. Add them to `src/data/reviews.ts` (real names, with permission).
 *   2. Move this file back to a live route:
 *        git mv src/app/_disabled/reviews src/app/reviews
 *   3. Re-add the /reviews entry to `src/app/sitemap.ts`.
 *   4. Re-add the "Read all reviews" button on the home page — see the
 *      Reviews comment block in `src/app/page.tsx`.
 *
 * Step 1 on its own is enough to bring the scrolling quotes back to the home
 * page. Steps 2–4 add the dedicated page.
 */

import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ReviewsMarquee } from "@/components/reviews/reviews-marquee";
import { Stars } from "@/components/reviews/stars";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { publicReviews, clientMarks } from "@/data/reviews";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What clients say about working with 508 Filmzz — automotive shops, detail studios, outdoor brands, and operators.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Client Feedback"
        title="Reviews"
        lead="Every project is a working relationship, not a transaction. Here's what that looks like from the other side of the camera."
      />

      {/* Trust strip */}
      <section className="shell pb-16" aria-label="Industries served">
        <Reveal>
          <p className="eyebrow mb-5">Industries shot for</p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-5 border-y border-line py-7">
            {clientMarks.map((mark) => (
              <span
                key={mark}
                className="display text-xl text-faint transition-colors duration-500 hover:text-bone md:text-2xl"
              >
                {mark}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {publicReviews.length > 0 && (
        <section className="pb-24 md:pb-32" aria-label="Scrolling reviews">
          <ReviewsMarquee />
        </section>
      )}

      {/* Full list */}
      <section className="shell pb-28 md:pb-40" aria-label="All reviews">
        {publicReviews.length === 0 && (
          <div className="border-y border-line py-20 text-center">
            <p className="display text-3xl md:text-4xl">
              First reviews landing soon<span className="text-accent">.</span>
            </p>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-mute">
              508 Filmzz is newly listed. Rather than fill this page with stock
              praise, it stays empty until real clients have their say — the work
              in the portfolio is the honest version of a testimonial.
            </p>
          </div>
        )}

        <div className="grid gap-px border-t border-l border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {publicReviews.map((review, i) => (
            <Reveal
              key={review.id}
              delay={(i % 3) * 0.08}
              className="flex flex-col justify-between bg-ink p-8 md:p-10"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="eyebrow">{pad(i + 1)}</span>
                  <Stars rating={review.rating} />
                </div>
                <blockquote className="text-base leading-relaxed text-bone/85">
                  “{review.quote}”
                </blockquote>
              </div>
              <figcaption className="mt-8 border-t border-line pt-5">
                <p className="text-sm font-medium">{review.author}</p>
                <p className="mt-1 text-[0.66rem] tracking-[0.18em] text-faint uppercase">
                  {review.role} — {review.company}
                </p>
              </figcaption>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-6 text-center">
          <p className="display text-4xl md:text-5xl">
            Add yours<span className="text-accent">.</span>
          </p>
          <p className="max-w-md text-sm text-mute">
            Worked together before? Send a line about the project and it goes up here.
          </p>
          <Magnetic href="/contact" variant="outline">
            Get in touch
          </Magnetic>
        </div>
      </section>
    </>
  );
}
