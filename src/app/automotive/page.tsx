import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CategoryView } from "@/components/portfolio/category-view";
import { CategoryPitch } from "@/components/portfolio/category-pitch";

export const metadata: Metadata = {
  title: "Automotive Films",
  description:
    "Automotive video production for dealerships, detail shops and build shops — vehicle content made to sell the business behind it, not just the car in front of the camera.",
  alternates: { canonical: "/automotive" },
};

export default function AutomotivePage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Vertical 01"
        title="Automotive"
        lead="Rolling shots, static hero sequences, and detail macro work. Whether it's a GT2 RS in a blacked-out studio or a dually on a two-lane at last light, the goal is the same — make the car look like the reason the brand exists."
      />

      <CategoryPitch
        items={[
          {
            title: "Rolling & Tracking",
            body: "Rolling coverage on open road, built so every pass can be slowed right down and still look right.",
          },
          {
            title: "Studio Control",
            body: "Single-source lighting that walks the shoulder line, built to make paint and carbon read on a phone screen.",
          },
          {
            title: "Detail Macro",
            body: "Badges, stitching, forged spokes, clear coat. The details are what prove the build is real.",
          },
        ]}
      />

      <CategoryView category="automotive" />
    </>
  );
}
