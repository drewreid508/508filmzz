/**
 * The origin the site actually answers on.
 *
 * Lives in its own module because `src/data/site.ts` exports a const named
 * `process` (the four-step production process), which shadows Node's global
 * `process` for that entire file — reading `process.env` there is a
 * temporal-dead-zone error, not an env lookup.
 *
 * Every canonical tag, the sitemap, robots.txt, and the JSON-LD are built from
 * this, so it has to match reality: a canonical pointing at a host that does
 * not resolve tells search engines the real page is somewhere they cannot
 * fetch, and the pages that do exist go unindexed.
 *
 * Once DNS points at www.508filmzz.com, clear NEXT_PUBLIC_SITE_URL (and
 * NEXT_PUBLIC_BASE_PATH) and the default below takes over.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.508filmzz.com";
