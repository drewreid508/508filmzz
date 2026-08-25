import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PortfolioBrowser } from "@/components/portfolio/portfolio-browser";
import { FilmStrip } from "@/components/portfolio/film-strip";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Automotive, commercial, photography, and social media work by 508 Filmzz. Filter by category, search the archive, and open any frame full screen.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="The Archive"
        title="The Work"
        lead="Finished commercials up top, then every project and every frame. Filter by category or search the archive — switch to gallery view to browse the stills on their own."
      />

      <FilmStrip />

      <div className="shell pb-28 md:pb-40">
        <PortfolioBrowser />
      </div>
    </>
  );
}
