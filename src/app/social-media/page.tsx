import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CategoryView } from "@/components/portfolio/category-view";
import { CategoryPitch } from "@/components/portfolio/category-pitch";

export const metadata: Metadata = {
  title: "Social Media Content",
  description:
    "Social media video production for businesses — Instagram Reels, TikTok and YouTube Shorts, shot vertical from the start and cut so the first two seconds earn the rest.",
  alternates: { canonical: "/social-media" },
};

export default function SocialMediaPage() {
  return (
    <>
      <PageHero
        index="05"
        eyebrow="Vertical 05"
        title="Social Media"
        lead="Vertical-first content built for the screen people actually watch on. Framed 9:16 from the first frame rather than cropped down from a wide master afterwards."
      />

      <CategoryPitch
        items={[
          {
            title: "Two Seconds",
            body: "The hook decides whether the rest gets watched, so every cut is built backwards from it.",
          },
          {
            title: "Native Vertical",
            body: "Composed for 9:16 on set. Cropping a wide frame down is why most brand content feels off on a phone.",
          },
          {
            title: "Volume Ready",
            body: "One shoot, many cutdowns — enough to post consistently instead of once and going quiet.",
          },
        ]}
      />

      <CategoryView category="social" />
    </>
  );
}
