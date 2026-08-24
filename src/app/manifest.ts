import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { asset } from "@/lib/asset";

/**
 * PWA manifest. Not an install target — it exists so Android/Chrome pick the
 * right icon and theme colour when the site is added to a home screen or shown
 * in the app switcher.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: asset("/favicon-192.png"), sizes: "192x192", type: "image/png" },
      { src: asset("/favicon-512.png"), sizes: "512x512", type: "image/png" },
      {
        src: asset("/favicon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

/** Static export: no server exists to generate this per-request. */
export const dynamic = "force-static";
