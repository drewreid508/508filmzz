import type { NextConfig } from "next";

/**
 * Static export, because the site is hosted on GitHub Pages.
 *
 * Pages serves files, not code — there is no Node runtime, so nothing may rely
 * on request-time rendering. The booking form posts to a Google Apps Script
 * endpoint instead of an API route (see `docs/GITHUB-PAGES.md`).
 *
 * `basePath` is env-driven so the same build can serve two places:
 *   unset                       → the custom domain, assets at the root
 *   NEXT_PUBLIC_BASE_PATH=/repo → a project preview at <user>.github.io/repo
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",

  // Pages resolves directory URLs to index.html, so emit /about/index.html
  // rather than /about.html. Without this, deep links 404 on refresh.
  trailingSlash: true,

  // The optimiser needs a server. Every image here is already pre-encoded into
  // AVIF/WebP ladders by the media pipeline, so there is nothing to give up.
  images: { unoptimized: true },

  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
