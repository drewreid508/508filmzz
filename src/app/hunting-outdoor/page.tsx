import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CategoryView } from "@/components/portfolio/category-view";
import { CategoryPitch } from "@/components/portfolio/category-pitch";

export const metadata: Metadata = {
  title: "Hunting & Outdoor Content",
  description:
    "Field-tested content for outdoor brands, guides, and boat builders. Product shot where it actually lives — first light to last light.",
  alternates: { canonical: "/hunting-outdoor" },
};

export default function HuntingOutdoorPage() {
  return (
    <>
      <PageHero
        index="03"
        eyebrow="Vertical 03"
        title="Hunting & Outdoor"
        lead="Product photographed where it actually lives — in the shallows, on the ridge, under a clear sky after dark. Field coverage for outdoor brands, guides, and boat builders who need their gear to look tested, not staged."
      />

      <CategoryPitch
        items={[
          {
            title: "In The Field",
            body: "Nothing shot on a seamless. The hull sits in water, the light is whatever the day gives, and the frame is better for it.",
          },
          {
            title: "Full Day Cycle",
            body: "Flat afternoon, golden hour, and full dark from a single trip — three completely different looks for one brand.",
          },
          {
            title: "Season Ready",
            body: "Coverage timed to your season so the content lands when buyers are actually shopping.",
          },
        ]}
      />

      <CategoryView category="outdoor" />
    </>
  );
}
