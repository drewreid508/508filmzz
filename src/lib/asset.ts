/**
 * Prefix a public-folder path with the deployment's base path.
 *
 * Next rewrites `basePath` into `next/link`, `next/image`, and the JS/CSS it
 * emits — but NOT into raw strings you hand to `<source srcSet>`, `<video src>`,
 * or a web manifest. On a project page served from
 * `<user>.github.io/<repo>/`, those raw paths resolve against the domain root
 * and 404, which looks like the images simply never load: the inlined blur
 * placeholder still paints, so the page renders "blurry" rather than broken.
 *
 * Route every hand-written public path through here.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  // Leave absolute URLs and data URIs alone.
  if (!path.startsWith("/")) return path;
  if (!BASE_PATH) return path;
  // Never double-prefix.
  if (path === BASE_PATH || path.startsWith(`${BASE_PATH}/`)) return path;
  return `${BASE_PATH}${path}`;
}
