import manifest from "@/data/media.generated.json";
import portfolioManifest from "@/data/portfolio.generated.json";
import { asset } from "@/lib/asset";

export type MediaSize = {
  w: number;
  h: number;
  avif: string;
  webp: string;
};

export type MediaAsset = {
  id: string;
  width: number;
  height: number;
  aspect: number;
  color: string;
  lqip: string;
  sizes: MediaSize[];
};

/**
 * Two manifests, one lookup.
 *
 * `media.generated.json` holds the site-wide plates (hero, about, posters).
 * `portfolio.generated.json` holds the 1080x1920 portfolio frames, which are
 * built by a separate pipeline on their own cadence. Portfolio ids are
 * `pf_`-prefixed, so the namespaces cannot collide.
 */
const rawAssets = {
  ...(manifest as Record<string, MediaAsset>),
  ...(portfolioManifest as Record<string, MediaAsset>),
};

/**
 * Rewrite every rendition URL for the current base path, once, at module load.
 *
 * The manifests store site-root paths (`/media/photos/...`). Doing the prefix
 * here means `srcSet`, `largest`, `atLeast`, and anything else reading a size
 * are all correct by construction, rather than each call site having to
 * remember. `lqip` is a data URI and is deliberately left alone.
 */
const assets: Record<string, MediaAsset> = Object.fromEntries(
  Object.entries(rawAssets).map(([id, a]) => [
    id,
    {
      ...a,
      sizes: a.sizes.map((s) => ({
        ...s,
        avif: asset(s.avif),
        webp: asset(s.webp),
      })),
    },
  ])
);

export function getMedia(id: string): MediaAsset {
  const found = assets[id];
  if (!found) {
    throw new Error(
      `Unknown media id "${id}". Run \`npm run media\` after adding files to the source folder.`
    );
  }
  return found;
}

export function hasMedia(id: string) {
  return Boolean(assets[id]);
}

/** Builds a srcset string for one encoding of an asset. */
export function srcSet(asset: MediaAsset, format: "avif" | "webp") {
  return asset.sizes.map((s) => `${s[format]} ${s.w}w`).join(", ");
}

/** Largest rendition — used as the <img> fallback src. */
export function largest(asset: MediaAsset) {
  return asset.sizes[asset.sizes.length - 1];
}

/**
 * Smallest rendition at least `minWidth` wide, falling back to the largest.
 *
 * For `<video poster>`, which takes a single URL and cannot use srcset. The
 * browser fetches a poster eagerly even under `preload="none"`, so handing it
 * the largest rendition puts a full-size image on the critical path of a
 * below-the-fold player — that alone was costing ~214 KB against mobile LCP.
 */
export function atLeast(asset: MediaAsset, minWidth: number) {
  return asset.sizes.find((s) => s.w >= minWidth) ?? largest(asset);
}

export const allMediaIds = Object.keys(assets);
