import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CategoryView } from "@/components/portfolio/category-view";
import { CategoryPitch } from "@/components/portfolio/category-pitch";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "Commercial photography for automotive, product, and business — stills that carry the same lighting and grade as the film they ship alongside.",
  alternates: { canonical: "/photography" },
};

export default function PhotographyPage() {
  return (
    <>
      <PageHero
        index="04"
        eyebrow="Vertical 04"
        title="Photography"
        lead="Stills are not an afterthought on a film shoot — they are lit and graded as their own deliverable, so a campaign looks like one body of work across every placement."
      />

      <CategoryPitch
        items={[
          {
            title: "One Look",
            body: "The stills carry the same colour as the film, so your feed and your website never look like two different companies.",
          },
          {
            title: "Detail First",
            body: "Badges, stitching, machined edges, clear coat. The details are what prove the work is real.",
          },
          {
            title: "Field Or Studio",
            body: "Shot where the product lives, or under controlled light when the surface demands it.",
          },
        ]}
      />

      <CategoryView category="photography" />
    </>
  );
}
