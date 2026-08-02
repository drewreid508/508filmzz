import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { PortfolioBrowser } from "@/components/portfolio/portfolio-browser";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Selected automotive films, business advertisements, and outdoor content by 508 Filmzz. Filter by vertical, search the archive, and open any frame full screen.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="The Archive"
        title="Portfolio"
        lead="Every project, every frame. Filter by vertical or search the archive — switch to gallery view to browse the stills on their own."
      />

      <div className="shell pb-28 md:pb-40">
        <PortfolioBrowser />
      </div>
    </>
  );
}
