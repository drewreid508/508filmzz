import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { isIndexable } from "@/lib/visibility";

export default function robots(): MetadataRoute.Robots {
  // Soft launch: block every crawler and advertise no sitemap. See
  // src/lib/visibility.ts for how to lift this.
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
