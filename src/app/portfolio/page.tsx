import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { GalleryWall } from "@/components/portfolio/gallery-wall";
import { FilmStrip } from "@/components/portfolio/film-strip";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Automotive, commercial, and photography work by 508 Filmzz — finished commercials and every frame from the archive, on one page.",
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
        eyebrow="The Archive"
        title="The Work"
        lead="Finished commercials up top, then every frame in the archive on one page. Filter by category, or click any photograph to open it full screen."
      />

      <FilmStrip />

      <div className="shell pb-28 md:pb-40">
        <GalleryWall />
      </div>
    </>
  );
}
