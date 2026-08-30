import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryWall } from "@/components/portfolio/gallery-wall";
import { FilmStrip } from "@/components/portfolio/film-strip";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Real businesses, real content. Automotive, commercial and social media video by 508 Filmzz, a video production company in Greenville, SC — every finished film and frame on one page.",
  alternates: { canonical: "/portfolio" },
};

/**
 * The Work page is a wall, not a set of albums.
 *
 * It used to open with project cards that had to be clicked into before a
 * single photograph was visible. Now the two finished films play at the top and
 * every frame sits below them, filterable in place. Clicking a frame opens it
 * full screen; nothing is hidden behind a page load.
 */
export default function PortfolioPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="The Work"
        title="Real Businesses. Real Content."
        lead="See how 508 Filmzz turns businesses, products and services into content people actually stop to watch. Client films up top, then every frame in the archive on one page — filter by category, or click any frame to open it full screen."
      />

      <FilmStrip />

      <div className="shell pb-28 md:pb-40">
        <GalleryWall />
      </div>
    </>
  );
}
