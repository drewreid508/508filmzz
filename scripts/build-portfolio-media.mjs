/**
 * 508 FILMZZ — portfolio image pipeline
 *
 * Takes the raw portfolio drop folder and produces web-ready 9:16 frames:
 *
 *   1. de-duplicate byte-identical files
 *   2. drop AI-generated and interface-screenshot files (see EXCLUDE)
 *   3. trim the black letterbox left by phone screen captures
 *   4. reframe to exactly 1080x1920 — cropping when that costs little, and
 *      extending the background when a crop would cut into the subject
 *   5. apply a restrained, adaptive commercial grade (levels / contrast /
 *      vibrance / clarity) in the spirit of a Lightroom develop preset
 *   6. emit AVIF + WebP ladders, an LQIP, and manifest entries
 *
 * Run:  node scripts/build-portfolio-media.mjs
 */
import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import sharp from "sharp";

const SRC = process.env.PF_SRC ?? "/Users/drew/Desktop/wesite vids and pics";
const OUT_DIR = path.resolve("public/media/portfolio");
const MANIFEST = path.resolve("src/data/portfolio.generated.json");

const TARGET_W = 1080;
const TARGET_H = 1920;
const TARGET_AR = TARGET_W / TARGET_H;

const WIDTHS = [360, 540, 810, 1080];
const AVIF = { quality: 58, effort: 6 };
const WEBP = { quality: 82, effort: 5 };

/**
 * Provenance exclusions. Matched case-insensitively against the filename with
 * whitespace normalised, because some names carry non-breaking spaces.
 */
const EXCLUDE = [
  [/^screenshot /i, "Lightroom interface screenshot"],
  [/^autumn stag/i, "AI-generated (impossible antler anatomy)"],
  [/^img_5817\./i, "Screenshot of the same AI-generated stag"],
  [/^foxes mid-playful/i, "AI-generated restyle of the real fox photo"],
  [/^hidden fox kit/i, "AI-generated"],
  [/^deep creek boats_/i, "AI-generated restyle"],
  [/^golden-hour boat gear/i, "AI-generated restyle"],
  [/^7f7c432a-/i, "Byte-identical duplicate of the AI boat restyle"],
  [/^rain-slick amber/i, "AI-generated restyle"],
  [/^0613c48c-/i, "Byte-identical duplicate of the AI LED restyle"],
  [/^red chevrolet truck in a nighttime/i, "AI-generated 2x2 collage"],
  [/^red silverado under garage/i, "AI-generated restyle"],
  [/^img_5812\./i, "Thumbnail-sized capture — only 32% usable, 2.8x upscale"],
  [/^img_5864\./i, "Lightroom interface screenshot (grid/selection view)"],
];

function excludedReason(name) {
  const norm = name.replace(/\s+/g, " ").trim();
  for (const [re, reason] of EXCLUDE) if (re.test(norm)) return reason;
  return null;
}

/**
 * Trim the letterbox a phone screen capture leaves behind.
 *
 * sharp's own `trim` gives up on these plates — a single stray bright pixel from
 * JPEG ringing in the matte keeps the bounding box at full height. So we scan a
 * downsampled copy ourselves and measure, per row and per column, the peak
 * deviation from the matte colour.
 *
 * Runs iteratively, because some captures are matted twice: a black letterbox
 * on the outside with a white photo frame nested inside it. Each pass re-reads
 * the corner of the box the previous pass found, so both layers come off.
 */
async function contentBox(file) {
  const { width, height } = await sharp(file).metadata();
  let box = { left: 0, top: 0, width, height };

  const SCAN_W = 120;
  const THRESHOLD = 18;
  const MAX_PASSES = 3;

  for (let pass = 0; pass < MAX_PASSES; pass++) {
    const scanH = Math.max(1, Math.round((box.height / box.width) * SCAN_W));

    let data;
    try {
      ({ data } = await sharp(file)
        .extract(box)
        .resize(SCAN_W, scanH, { fit: "fill" })
        .greyscale()
        .raw()
        .toBuffer({ resolveWithObject: true }));
    } catch {
      return box;
    }

    // The matte colour is whatever the four corners agree on.
    const corners = [
      data[0],
      data[SCAN_W - 1],
      data[(scanH - 1) * SCAN_W],
      data[scanH * SCAN_W - 1],
    ];
    const spread = Math.max(...corners) - Math.min(...corners);
    // Corners disagreeing means we are already inside the photo.
    if (spread > 26) return box;
    const matte = corners.reduce((a, b) => a + b, 0) / corners.length;

    const rowPeak = new Array(scanH).fill(0);
    const colPeak = new Array(SCAN_W).fill(0);
    for (let y = 0; y < scanH; y++) {
      for (let x = 0; x < SCAN_W; x++) {
        const d = Math.abs(data[y * SCAN_W + x] - matte);
        if (d > rowPeak[y]) rowPeak[y] = d;
        if (d > colPeak[x]) colPeak[x] = d;
      }
    }

    const firstAbove = (arr) => arr.findIndex((v) => v > THRESHOLD);
    const lastAbove = (arr) => {
      for (let i = arr.length - 1; i >= 0; i--) if (arr[i] > THRESHOLD) return i;
      return -1;
    };

    const y0 = firstAbove(rowPeak);
    const y1 = lastAbove(rowPeak);
    const x0 = firstAbove(colPeak);
    const x1 = lastAbove(colPeak);
    if (y0 < 0 || y1 <= y0 || x0 < 0 || x1 <= x0) return box;

    const sx = box.width / SCAN_W;
    const sy = box.height / scanH;

    // Step in by one scan cell so no sliver of the matte survives.
    const next = {
      left: box.left + Math.max(0, Math.round((x0 + 1) * sx)),
      top: box.top + Math.max(0, Math.round((y0 + 1) * sy)),
    };
    next.width = Math.max(1, Math.round((x1 - x0 - 1) * sx));
    next.height = Math.max(1, Math.round((y1 - y0 - 1) * sy));
    next.width = Math.min(next.width, width - next.left);
    next.height = Math.min(next.height, height - next.top);

    const area = (next.width * next.height) / (width * height);
    if (area < 0.08 || next.width < 200 || next.height < 200) return box;

    // Converged — this pass found nothing more to remove.
    const shrank =
      (next.width * next.height) / (box.width * box.height) < 0.985;
    box = next;
    if (!shrank) break;
  }

  return box;
}

/**
 * Some captures were taken with an editor's "Crop" pill still on screen, and it
 * sits over the photo rather than in the black letterbox, so the trim keeps it.
 *
 * Looks for a small high-contrast blob in the top-right where that control
 * lives, and reports how far to inset the top edge to clear it. Detection
 * rather than a hard-coded list, so future drops are handled the same way.
 */
async function uiChromeInset(file, box) {
  const scale = box.width / 1206;
  const bw = Math.round(170 * scale);
  const bh = Math.round(76 * scale);
  const bx = box.left + box.width - Math.round(232 * scale);
  const by = box.top + Math.round(48 * scale);

  if (bw < 8 || bh < 8 || by + bh > box.top + box.height) return 0;

  const read = async (left) =>
    sharp(file)
      .extract({ left, top: by, width: bw, height: bh })
      .greyscale()
      .raw()
      .toBuffer();

  try {
    const pill = await read(bx);
    const control = await read(Math.max(box.left, bx - Math.round(300 * scale)));

    const range = (buf) => {
      let min = 255;
      let max = 0;
      for (const v of buf) {
        if (v < min) min = v;
        if (v > max) max = v;
      }
      return max - min;
    };
    const brightShare = (buf) => {
      let n = 0;
      for (const v of buf) if (v > 205) n += 1;
      return n / buf.length;
    };

    const pillRange = range(pill);
    if (pillRange > 110 && brightShare(pill) > 0.02 && pillRange > range(control) * 1.25) {
      return Math.round(160 * scale);
    }
  } catch {
    /* extraction fell outside the plate — nothing to strip */
  }
  return 0;
}

/**
 * Reframe the trimmed content to 1080x1920.
 *
 * Taller-than-9:16 sources are cropped with sharp's attention strategy, which
 * keeps the busiest (almost always the subject) region. Wider sources are only
 * cropped while that stays cheap; past that the frame is completed with a
 * mirrored, blurred continuation of the plate's own edges, so the subject
 * survives intact and the fill reads as natural background falloff rather than
 * a letterbox.
 */
async function reframe(file, box) {
  const plate = sharp(file).extract(box);
  const ar = box.width / box.height;

  if (ar <= TARGET_AR) {
    // Source is narrower/taller than 9:16 — crop height, keep full width.
    return {
      buffer: await plate
        .resize(TARGET_W, TARGET_H, {
          fit: "cover",
          position: sharp.strategy.attention,
          kernel: "lanczos3",
        })
        .png({ compressionLevel: 3 })
        .toBuffer(),
      method: "crop",
    };
  }

  // Source is wider than 9:16. How much width would a straight crop cost?
  const cropW = Math.round(box.height * TARGET_AR);
  const keptWidth = cropW / box.width;

  if (keptWidth >= 0.85) {
    return {
      buffer: await plate
        .resize(TARGET_W, TARGET_H, {
          fit: "cover",
          position: sharp.strategy.attention,
          kernel: "lanczos3",
        })
        .png({ compressionLevel: 3 })
        .toBuffer(),
      method: "crop",
    };
  }

  // Too costly to crop — extend the background instead.
  const subject = await plate
    .clone()
    .resize(TARGET_W, null, { kernel: "lanczos3" })
    .png({ compressionLevel: 3 })
    .toBuffer();
  const subjectMeta = await sharp(subject).metadata();
  const subjectH = subjectMeta.height;
  const padTotal = TARGET_H - subjectH;

  if (padTotal <= 0) {
    return {
      buffer: await sharp(subject)
        .resize(TARGET_W, TARGET_H, {
          fit: "cover",
          position: sharp.strategy.attention,
        })
        .png({ compressionLevel: 3 })
        .toBuffer(),
      method: "crop",
    };
  }

  const padTop = Math.floor(padTotal / 2);
  const padBottom = padTotal - padTop;

  // Build the fill from the plate's own top/bottom edges: mirrored, stretched,
  // blurred and slightly darkened so it falls away from the subject.
  const edge = Math.max(24, Math.round(subjectH * 0.12));

  const topFill = await sharp(subject)
    .extract({ left: 0, top: 0, width: TARGET_W, height: edge })
    .flip()
    .resize(TARGET_W, padTop, { fit: "fill" })
    .blur(Math.max(8, padTop / 6))
    .modulate({ brightness: 0.9 })
    .png({ compressionLevel: 3 })
    .toBuffer();

  const bottomFill = await sharp(subject)
    .extract({ left: 0, top: subjectH - edge, width: TARGET_W, height: edge })
    .flip()
    .resize(TARGET_W, padBottom, { fit: "fill" })
    .blur(Math.max(8, padBottom / 6))
    .modulate({ brightness: 0.9 })
    .png({ compressionLevel: 3 })
    .toBuffer();

  const buffer = await sharp({
    create: {
      width: TARGET_W,
      height: TARGET_H,
      channels: 3,
      background: { r: 10, g: 10, b: 10 },
    },
  })
    .composite([
      { input: topFill, top: 0, left: 0 },
      { input: subject, top: padTop, left: 0 },
      { input: bottomFill, top: padTop + subjectH, left: 0 },
    ])
    .png({ compressionLevel: 3 })
    .toBuffer();

  return { buffer, method: "extend" };
}

/**
 * Adaptive commercial grade.
 *
 * Deliberately restrained: the black/white points are only pulled as far as the
 * histogram actually allows, and both moves are hard-capped, so the moody night
 * frames stay moody instead of being flattened into an HDR look.
 */
async function grade(buffer) {
  const image = sharp(buffer);
  const stats = await image.stats();

  // Darkest/brightest meaningful points across RGB.
  const black = Math.min(...stats.channels.slice(0, 3).map((c) => c.min));
  const white = Math.max(...stats.channels.slice(0, 3).map((c) => c.max));
  const mean =
    stats.channels.slice(0, 3).reduce((sum, c) => sum + c.mean, 0) / 3;

  // Levels — capped so we never crush detail or blow highlights.
  const blackPoint = Math.min(black, 14);
  const whitePoint = Math.max(white, 241);
  const span = Math.max(1, whitePoint - blackPoint);
  const slope = 255 / span;
  const intercept = -blackPoint * slope;

  /*
   * Nudge midtones toward a balanced exposure without clipping either end.
   * `gamma()` only brightens (sharp restricts it to 1.0–3.0), so a frame that
   * needs pulling down is darkened through `modulate` instead. Both directions
   * are tightly capped, which is what keeps the intentionally moody night
   * frames from being flattened toward a generic mid-grey.
   */
  const targetMean = 118;
  const drift = (targetMean - mean) / 255;

  let pipeline = image.linear(slope, intercept);
  let brightness = 1;

  if (drift > 0) {
    pipeline = pipeline.gamma(Math.min(1.16, 1 + drift * 0.42));
  } else {
    brightness = Math.max(0.92, 1 + drift * 0.32);
  }

  return pipeline
    .modulate({ saturation: 1.06, brightness })
    .sharpen({ sigma: 0.7, m1: 0.4, m2: 0.5 })
    .toColourspace("srgb")
    .png({ compressionLevel: 3 })
    .toBuffer();
}

async function run() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const all = (await readdir(SRC)).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();

  // Collapse byte-identical files, preferring the cleanest filename.
  const byHash = new Map();
  const dupeOf = new Map();
  const score = (n) =>
    (/ \d\.(png|jpe?g)$/i.test(n) ? 2 : 0) +
    (/^[0-9A-F]{8}-[0-9A-F]{4}-/i.test(n) ? 1 : 0);

  for (const name of all) {
    const hash = createHash("md5")
      .update(await readFile(path.join(SRC, name)))
      .digest("hex");
    const kept = byHash.get(hash);
    if (!kept) {
      byHash.set(hash, name);
      dupeOf.set(hash, []);
    } else if (score(name) < score(kept)) {
      byHash.set(hash, name);
      dupeOf.get(hash).push(kept);
    } else {
      dupeOf.get(hash).push(name);
    }
  }

  const manifest = {};
  const report = { used: [], skipped: [], duplicates: 0 };

  for (const [hash, name] of byHash.entries()) {
    report.duplicates += dupeOf.get(hash).length;

    const reason = excludedReason(name);
    if (reason) {
      report.skipped.push({ name, reason });
      continue;
    }

    const abs = path.join(SRC, name);
    const id = "pf_" + path.parse(name).name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
    const box = await contentBox(abs);

    // Strip any editor chrome the letterbox trim couldn't reach.
    const inset = await uiChromeInset(abs, box);
    if (inset) {
      box.top += inset;
      box.height -= inset;
    }

    const { buffer, method } = await reframe(abs, box);
    const graded = await grade(buffer);

    const sizes = [];
    for (const w of WIDTHS) {
      const h = Math.round((TARGET_H / TARGET_W) * w);
      const pipe = sharp(graded).resize(w, h, { kernel: "lanczos3" });
      await pipe.clone().avif(AVIF).toFile(path.join(OUT_DIR, `${id}-${w}.avif`));
      await pipe.clone().webp(WEBP).toFile(path.join(OUT_DIR, `${id}-${w}.webp`));
      sizes.push({
        w,
        h,
        avif: `/media/portfolio/${id}-${w}.avif`,
        webp: `/media/portfolio/${id}-${w}.webp`,
      });
    }

    const lqip = await sharp(graded).resize(18).blur(1.2).webp({ quality: 40 }).toBuffer();
    const { dominant } = await sharp(graded).stats();

    manifest[id] = {
      id,
      source: name,
      width: TARGET_W,
      height: TARGET_H,
      aspect: +(TARGET_W / TARGET_H).toFixed(4),
      color: `#${[dominant.r, dominant.g, dominant.b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")}`,
      lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
      sizes,
    };

    report.used.push({ id, name, method });
    console.log(`${id.padEnd(18)} ${method.padEnd(7)} ${name}`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));

  console.log(`\n── SUMMARY ──`);
  console.log(`  used:        ${report.used.length}`);
  console.log(`   ├ cropped:  ${report.used.filter((r) => r.method === "crop").length}`);
  console.log(`   └ extended: ${report.used.filter((r) => r.method === "extend").length}`);
  console.log(`  duplicates:  ${report.duplicates}`);
  console.log(`  skipped:     ${report.skipped.length}`);
  for (const s of report.skipped) console.log(`     ${s.name} — ${s.reason}`);

  await writeFile(
    path.resolve("scripts/.portfolio-report.json"),
    JSON.stringify(report, null, 2)
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
