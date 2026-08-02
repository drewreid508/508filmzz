import manifest from "@/data/media.generated.json";
import portfolioManifest from "@/data/portfolio.generated.json";

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
const assets = {
  ...(manifest as Record<string, MediaAsset>),
  ...(portfolioManifest as Record<string, MediaAsset>),
};

export function getMedia(id: string): MediaAsset {
  const asset = assets[id];
  if (!asset) {
    throw new Error(
      `Unknown media id "${id}". Run \`npm run media\` after adding files to the source folder.`
    );
  }
  return asset;
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
