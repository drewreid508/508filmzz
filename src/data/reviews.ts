/**
 * Client testimonials.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS LIST IS EMPTY ON PURPOSE.
 * ─────────────────────────────────────────────────────────────────────────────
 * It previously held six sample quotes attributed to a fictional "Client Name",
 * written to demonstrate the layout. They were rendering publicly on /reviews.
 * Publishing invented testimonials on a commercial site is dishonest and runs
 * against the FTC endorsement guidelines, so they have been removed rather than
 * rewritten.
 *
 * To add a real one: append an entry below with the client's actual name and
 * business, once you have their permission to publish it. `placeholder` exists
 * only as a safety net — anything left `true` is stripped from production
 * builds by `publicReviews`.
 *
 * While this array is empty there is no reviews section anywhere on the site:
 * the scrolling marquee on the home page is hidden, and the dedicated /reviews
 * page is parked at src/app/_disabled/reviews (an underscore folder is excluded
 * from routing) rather than published as an empty shell.
 *
 * Adding the first real entry below brings the home-page band back on its own.
 * The full page needs a one-line move — see the header comment on the parked
 * file for the four steps.
 */

export type Review = {
  id: string;
  quote: string;
  author: string;
  company: string;
  role: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** Leave false for genuine testimonials. True = never shown in production. */
  placeholder: boolean;
};

export const reviews: Review[] = [
  // Example of the shape — delete this comment when you add the first real one:
  //
  // {
  //   id: "r1",
  //   quote: "Exact words the client gave you, unedited.",
  //   author: "Hannah Smith",
  //   company: "Hannah's Detailing & Supply",
  //   role: "Owner",
  //   rating: 5,
  //   placeholder: false,
  // },
];

/**
 * Industries served, shown as the trust strip on /reviews under the heading
 * "Industries served". These are honest category labels, not client wordmarks —
 * every one corresponds to real work in the portfolio. Swap them for actual
 * client names only once you have written permission to use each brand.
 */
/**
 * Industries shot for — deliberately generic sector names, never client names
 * or logos, so nothing here implies a customer who has not agreed to be named.
 * Swap for real client wordmarks only once you have written permission.
 */
export const clientMarks = [
  "AUTOMOTIVE",
  "FABRICATION",
  "DETAILING",
  "TRUCKING",
  "MARINE",
  "COMMERCIAL",
];

export const hasRealReviews = reviews.some((r) => !r.placeholder);

/**
 * The ONLY list any public surface may render.
 *
 * Filtering here rather than at each call site means a new page cannot
 * accidentally reintroduce unpublishable content. In development, placeholder
 * entries still render so the layout stays reviewable; in production they are
 * stripped.
 */
export const publicReviews: Review[] =
  process.env.NODE_ENV === "production"
    ? reviews.filter((r) => !r.placeholder)
    : reviews;
