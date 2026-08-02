"use client";

import { publicReviews as reviews } from "@/data/reviews";
import { Stars } from "./stars";

function Card({ review }: { review: (typeof reviews)[number] }) {
  return (
    <figure className="flex w-[19rem] shrink-0 flex-col justify-between border border-line bg-ink-2/60 p-7 backdrop-blur-sm transition-colors duration-600 hover:border-line-strong md:w-[24rem] md:p-9">
      <Stars rating={review.rating} />
      <blockquote className="mt-6 text-sm leading-relaxed text-bone/85 md:text-[0.95rem]">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-7 border-t border-line pt-5">
        <p className="text-[0.8rem] font-medium tracking-wide">{review.author}</p>
        <p className="mt-1 text-[0.66rem] tracking-[0.18em] text-faint uppercase">
          {review.role} — {review.company}
        </p>
      </figcaption>
    </figure>
  );
}

/**
 * Two counter-scrolling rows of testimonials. Pauses on hover so a quote can
 * actually be read.
 */
export function ReviewsMarquee() {
  const rowA = [...reviews, ...reviews];
  const rowB = [...reviews.slice().reverse(), ...reviews.slice().reverse()];

  return (
    <div className="relative flex flex-col gap-5 overflow-hidden">
      <div className="group flex w-max gap-5 animate-[slide-left_60s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {rowA.map((r, i) => (
          <Card key={`a-${r.id}-${i}`} review={r} />
        ))}
      </div>
      <div className="group flex w-max gap-5 animate-[slide-right_68s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:animate-none">
        {rowB.map((r, i) => (
          <Card key={`b-${r.id}-${i}`} review={r} />
        ))}
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-ink to-transparent md:w-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-ink to-transparent md:w-40"
      />

      <style jsx>{`
        @keyframes slide-left {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @keyframes slide-right {
          from {
            transform: translate3d(-50%, 0, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
