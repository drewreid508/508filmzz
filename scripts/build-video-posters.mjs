/**
 * Generates poster stills (AVIF + WebP + LQIP) for the site's video assets and
 * appends them to the media manifest under `video-*` keys.
 *
 * Run after encoding:  node scripts/build-video-posters.mjs
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const run = promisify(execFile);
const OUT_DIR = path.resolve("public/media/photos");
const MANIFEST = path.resolve("src/data/media.generated.json");
const TMP = path.resolve(".poster-tmp");

/**
 * ── EDIT ME ────────────────────────────────────────────────────────────────
 * One entry per film. `at` is the timestamp to grab, in seconds — pick a frame
 * that reads as a thumbnail, not a title card or a fade.
 */
const POSTERS = [
  { id: "poster-bratchers", video: "public/media/video/bratchers-power-washing.mp4", at: "3.2" },
  { id: "poster-revuelto", video: "public/media/video/hds-revuelto.mp4", at: "24" },
  // The wand mid-spray, with the operator in frame — the shot that says what
  // the job actually is. The wide of the empty bay reads as a parking lot.
  { id: "poster-night-wash", video: "public/media/video/bratchers-night-wash.mp4", at: "10" },
  // Headlight and brush guard: the tightest, best-lit frame in the piece.
  { id: "poster-g-wagon", video: "public/media/video/g-wagon.mp4", at: "2" },
  // The rolling highway shot, not the static bridge opener — motion is the
  // point of this one, and the thumbnail should promise it.
  { id: "poster-ram", video: "public/media/video/ram-2500.mp4", at: "24" },
];

const WIDTHS = [420, 720, 1080];

async function main() {
  await mkdir(TMP, { recursive: true });
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));

  for (const p of POSTERS) {
    const frame = path.join(TMP, `${p.id}.png`);
    await run("ffmpeg", ["-y", "-ss", p.at, "-i", p.video, "-frames:v", "1", frame, "-loglevel", "error"]);

    const meta = await sharp(frame).metadata();
    const sizes = [];
    for (const target of WIDTHS) {
      const w = Math.min(target, meta.width);
      const h = Math.round((meta.height / meta.width) * w);
      const pipe = sharp(frame).resize(w, h, { kernel: "lanczos3" });
      await pipe.clone().avif({ quality: 54, effort: 6 }).toFile(path.join(OUT_DIR, `${p.id}-${w}.avif`));
      await pipe.clone().webp({ quality: 80, effort: 5 }).toFile(path.join(OUT_DIR, `${p.id}-${w}.webp`));
      sizes.push({
        w,
        h,
        avif: `/media/photos/${p.id}-${w}.avif`,
        webp: `/media/photos/${p.id}-${w}.webp`,
      });
    }

    const lqip = await sharp(frame).resize(20).blur(1.2).webp({ quality: 40 }).toBuffer();
    const { dominant } = await sharp(frame).stats();

    manifest[p.id] = {
      id: p.id,
      width: meta.width,
      height: meta.height,
      aspect: +(meta.width / meta.height).toFixed(4),
      color: `#${[dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`,
      lqip: `data:image/webp;base64,${lqip.toString("base64")}`,
      sizes,
    };
    console.log(`${p.id}  ${meta.width}x${meta.height}`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  await rm(TMP, { recursive: true, force: true });
  console.log("posters → manifest");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
