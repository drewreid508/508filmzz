/**
 * Search visibility switch.
 *
 * The site launches "soft": live at the real domain for anyone with the link,
 * but carrying noindex so it never appears in search results. This is the one
 * place that decision is made — `robots.ts`, the sitemap, and the root metadata
 * all read from here, so they can never disagree with each other.
 *
 * FAIL-CLOSED BY DESIGN: anything other than the exact string "true" keeps the
 * site private, including the variable being unset or misspelled. A forgotten
 * flag costs you traffic you never had; a leaked launch costs you a first
 * impression you cannot take back.
 *
 * To go fully public:
 *   1. Set NEXT_PUBLIC_SITE_INDEXABLE=true in Vercel → Settings → Env Variables
 *   2. Redeploy (the value is read at build time, so a redeploy is required)
 *   3. Verify: curl -s https://www.508filmzz.com/robots.txt
 *      — should read "Allow: /" rather than "Disallow: /"
 *   4. Submit the sitemap in Google Search Console
 */
export const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

/** Robots directives for Next's `metadata.robots`. */
export const robotsMeta = isIndexable
  ? {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" as const },
    }
  : {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    };
