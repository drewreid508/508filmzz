/**
 * Extra-large renditions for the frames that run full-bleed.
 *
 * Most images are capped at 1080–1206px, which is plenty for a card but soft
 * when the same frame fills a 1440px retina hero (2880 device pixels — a 2.4x
 * shortfall). The sources are phone captures, so the detail genuinely is not
 * there and no amount of processing invents it. What this does do is resample
 * properly: a Lanczos upscale plus a light unsharp pass reads noticeably
 * crisper than leaving the browser to stretch 1206px across 2880 with bilinear
 * filtering.
 *
 * Only the ids listed below get the treatment, because only they are ever
 * displayed at 100vw. Everything else already has enough pixels.
 *
 * Run: node scripts/build-hero-renditions.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const MANIFESTS = {
  "src/data/media.generated.json": path.resolve("src/data/media.generated.json"),
  "src/data/portfolio.generated.json": path.resolve("src/data/portfolio.generated.json"),
};

/** Every id rendered at sizes="100vw" somewhere in the site. */
const FULL_BLEED = [
  // Hero plates — src/components/home/hero.tsx
  "img_5638",
  "pf_img_5850",
  "pf_img_5834",
  // Project page heroes — src/app/work/[slug]/page.tsx
  "poster-showreel",
  "pf_img_5838",
  "pf_img_5813",
  "pf_img_5860",
  "pf_img_5829",
  "pf_img_5845",
  "pf_img_5830",
];

const TARGETS = [1620, 2160];

async function main() {
  const loaded = {};
  for (const [key, file] of Object.entries(MANIFESTS)) {
    loaded[key] = JSON.parse(await readFile(file, "utf8"));
  }

  let added = 0;

  for (const id of FULL_BLEED) {
    const key = Object.keys(loaded).find((k) => loaded[k][id]);
    if (!key) {
      console.warn(`skip ${id} — not in any manifest`);
      continue;
    }
    const entry = loaded[key][id];
    const base = entry.sizes[entry.sizes.length - 1];

    // Upscale from the largest WebP: it is the cleanest existing rendition and
    // avoids re-deriving the original crop.
    const source = path.join(PUBLIC, base.webp.replace(/^\//, ""));
    const ratio = entry.height / entry.width;

    for (const w of TARGETS) {
      if (w <= base.w) continue;
      const h = Math.round(ratio * w);
      const pipe = sharp(source)
        .resize(w, h, { kernel: "lanczos3" })
        // Counteracts the softness upscaling always introduces. Kept light —
        // heavy sharpening on an upscale looks worse than the softness did.
        .sharpen({ sigma: 1.1, m1: 0.5, m2: 0.7 });

      const dir = path.dirname(source);
      const stem = path.basename(base.webp).replace(/-\d+\.webp$/, "");
      const avifName = `${stem}-${w}.avif`;
      const webpName = `${stem}-${w}.webp`;

      await pipe.clone().avif({ quality: 60, effort: 6 }).toFile(path.join(dir, avifName));
      await pipe.clone().webp({ quality: 84, effort: 5 }).toFile(path.join(dir, webpName));

      const urlDir = path.dirname(base.webp);
      entry.sizes.push({
        w,
        h,
        avif: `${urlDir}/${avifName}`,
        webp: `${urlDir}/${webpName}`,
      });
      added += 1;
    }

    entry.sizes.sort((a, b) => a.w - b.w);
    console.log(`${id.padEnd(18)} → ${entry.sizes.map((s) => s.w).join(", ")}`);
  }

  for (const [key, file] of Object.entries(MANIFESTS)) {
    await writeFile(file, JSON.stringify(loaded[key], null, 2));
  }
  console.log(`\n${added} renditions added across ${FULL_BLEED.length} frames`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
