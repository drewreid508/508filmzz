import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryWall } from "@/components/portfolio/gallery-wall";
import { FilmStrip } from "@/components/portfolio/film-strip";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected marketing, media and creative work by 508 Filmzz — commercial video, automotive and dealership content, brand photography and campaign creative for businesses across South Carolina.",
  alternates: { canonical: "/portfolio" },
};

/**
 * The Work page is a wall, not a set of albums.
 *
 * It used to open with project cards that had to be clicked into before a
 * single frame was visible. Now the finished films play at the top and
 * every frame sits below them, filterable in place. Clicking a frame opens it
 * full screen; nothing is hidden behind a page load.
 */
export default function PortfolioPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="The Work"
        title="Real Businesses. Real Work."
        lead="A selection rather than an archive — the work that shows what I can build for a business. Client films up top, then the frames behind them. Filter by category, or open any frame full screen."
      />

      <FilmStrip />

      <div className="shell pb-28 md:pb-40">
        <GalleryWall />
      </div>
    </>
  );
}
