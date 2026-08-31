import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CategoryView } from "@/components/portfolio/category-view";
import { CategoryPitch } from "@/components/portfolio/category-pitch";

export const metadata: Metadata = {
  title: "Commercial Production",
  description:
    "Commercial video and advertising for contractors, trades, dealerships and local businesses across Greenville and Upstate South Carolina — built around one service, one customer, and one clear next step.",
  alternates: { canonical: "/commercial" },
};

export default function CommercialPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Vertical 02"
        title="Commercial"
        lead="Brand films and service campaigns. The work is shot at the level of the hands — the person, the tool, the surface — because that is what makes a working business look worth paying for."
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
            body: "One shoot, delivered as a brand film, social cutdowns, and a stills set that matches the grade.",
          },
        ]}
      />

      <CategoryView category="commercial" />
    </>
  );
}
