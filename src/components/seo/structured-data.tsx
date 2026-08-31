import {
  site,
  capabilities,
  services,
  serviceAreas,
  serviceRegion,
  hours,
  faqs,
} from "@/data/site";

/**
 * JSON-LD for the business, the site, and the service catalogue. Rendered once
 * in the root layout so every page carries it. The LocalBusiness details drive
 * local search for Greenville and the Upstate.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "ProfessionalService", "MarketingAgency"],
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phoneE164,
        slogan: site.positioning,
        description: site.description,
        priceRange: "$$",
        sameAs: [site.instagram, site.tiktok],
        knowsAbout: capabilities,
        image: `${site.url}/brand/508filmzz-social-share.png`,
        logo: {
          "@type": "ImageObject",
          url: `${site.url}/brand/508filmzz-logo-1024.png`,
          width: 1024,
          height: 1024,
        },
        founder: { "@type": "Person", name: site.owner },
        foundingDate: site.founded,
        /**
         * Service-area business: locality/region only. The street line is
         * deliberately omitted — see `site.address.showStreetAddress`. Google
         * treats a PostalAddress without streetAddress as valid for an SAB.
         */
        address: {
          "@type": "PostalAddress",
          ...(site.address.showStreetAddress
            ? { streetAddress: site.address.street }
            : {}),
          addressLocality: site.address.city,
          addressRegion: site.address.stateShort,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        areaServed: [
          { "@type": "State", name: site.state },
          { "@type": "AdministrativeArea", name: serviceRegion },
          ...serviceAreas.map((city) => ({
            "@type": "City",
            name: `${city}, ${site.stateShort}`,
          })),
        ],
        openingHoursSpecification: hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: `https://schema.org/${h.day}`,
          opens: h.opens,
          closes: h.closes,
        })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Marketing, media and creative services",
          /*
            One offer per discipline, each listing its capabilities.

            Nested rather than flattened to twenty offers: the catalogue should
            describe what is sold — three parts of one engagement — not read as
            a price list of twenty separate products, which is the exact
            impression the site itself is built to avoid giving.
          */
          itemListElement: services.map((group) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: group.title,
              description: group.blurb,
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: group.title,
                itemListElement: group.items.map((item) => ({
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: item },
                })),
              },
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en-US",
      },
      /**
       * Google stopped showing FAQ rich results for most sites in 2023, so this
       * buys no SERP real estate. It stays because it is still valid markup that
       * assistants and other crawlers parse for entity understanding.
       */
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
