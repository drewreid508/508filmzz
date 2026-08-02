import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CategoryView } from "@/components/portfolio/category-view";
import { CategoryPitch } from "@/components/portfolio/category-pitch";

export const metadata: Metadata = {
  title: "Business Advertisements",
  description:
    "Brand films, service campaigns, and paid-social advertisements for shops, studios, and operators — built around a hook, a promise, and a call to action.",
  alternates: { canonical: "/business-ads" },
};

export default function BusinessAdsPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Vertical 02"
        title="Business Ads"
        lead="Shop films, service campaigns, and brand stories. The work is shot at the level of the hands — the person, the tool, the surface — because that is what makes a service business look worth paying for."
      />

      <CategoryPitch
        items={[
          {
            title: "Hook First",
            body: "The first two seconds decide everything. Every ad is cut backwards from the moment that stops a thumb.",
          },
          {
            title: "Proof, Not Claims",
            body: "Process footage that shows the standard instead of stating it. The result lands because the work is visible.",
          },
          {
            title: "Full Package",
            body: "One shoot, delivered as a brand film, paid-social cutdowns, and a stills set that matches the grade.",
          },
        ]}
      />

      <CategoryView category="business" />
    </>
  );
}
