/**
 * 508 FILMZZ — media build pipeline
 *
 * Source photos are iPhone screenshots (1206x2622) with black letterbox bars.
 * This script trims the bars at full resolution, then emits responsive AVIF +
 * WebP ladders plus a tiny base64 LQIP for every image, and writes a manifest
 * the site imports.
 *
 * Run:  node scripts/build-media.mjs
 */
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = process.env.MEDIA_SRC ?? "/Users/drew/Desktop/508FILMZZ WEBSITE ";
const OUT_DIR = path.resolve("public/media/photos");
const MANIFEST = path.resolve("src/data/media.generated.json");

const WIDTHS = [420, 720, 1080, 1440, 2160];
const AVIF = { quality: 54, effort: 6 };
const WEBP = { quality: 80, effort: 5 };

/**
 * Trim pure-black letterboxing. Returns { left, top, width, height } in source
 * pixel space. Falls back to the full frame if trim finds nothing.
 */
async function contentBox(file) {
  const { width, height } = await sharp(file).metadata();
  try {
    const { info } = await sharp(file)
      .trim({ background: "#000000", threshold: 12 })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const left = -(info.trimOffsetLeft ?? 0);
    const top = -(info.trimOffsetTop ?? 0);
    const box = { left, top, width: info.width, height: info.height };

    // Guard against a runaway trim (e.g. a near-black photo eaten alive).
    const area = (box.width * box.height) / (width * height);
    if (area < 0.15 || box.width < 200 || box.height < 200) {
      return { left: 0, top: 0, width, height };
    }
    return box;
  } catch {
    return { left: 0, top: 0, width, height };
  }
}

async function run() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const files = (await readdir(SRC_DIR)).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();

  const manifest = {};

  for (const file of files) {
    const abs = path.join(SRC_DIR, file);
    const slug = path.parse(file).name.toLowerCase();
    const box = await contentBox(abs);
    const srcW = box.width;
    const srcH = box.height;

    const targets = [...new Set(WIDTHS.map((t) => Math.min(t, srcW)))].sort((a, b) => a - b);

    const sizes = [];
    for (const w of targets) {
      const h = Math.round((srcH / srcW) * w);
      const pipe = sharp(abs)
        .extract(box)
        .resize(w, h, { fit: "cover", kernel: "lanczos3" });
      const avifName = `${slug}-${w}.avif`;
      const webpName = `${slug}-${w}.webp`;
      await pipe.clone().avif(AVIF).toFile(path.join(OUT_DIR, avifName));
      await pipe.clone().webp(WEBP).toFile(path.join(OUT_DIR, webpName));
      sizes.push({ w, h, avif: `/media/photos/${avifName}`, webp: `/media/photos/${webpName}` });
    }

    const lqip = await sharp(abs)
      .extract(box)
      .resize(20)
      .blur(1.2)
      .webp({ quality: 40 })
      .toBuffer();

    const { dominant } = await sharp(abs).extract(box).stats();
    const color = `#${[dominant.r, dominant.g, dominant.b]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")}`;

    manifest[slug] = {
      id: slug,
      width: srcW,
      height: srcH,
      aspect: +(srcW / srcH).toFixed(4),
      color,
      lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
      sizes,
    };

    console.log(
      `${slug}  ${srcW}x${srcH}  (was ${box.left},${box.top})  ${sizes.length} sizes  ${color}`
    );
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest).length} images → ${MANIFEST}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
