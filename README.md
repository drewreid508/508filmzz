# 508 Filmzz

Premium cinematic portfolio site — **Cinematic Media. Built To Move.**

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Framer Motion · GSAP · Lenis · Radix

---

## Quick start

```bash
npm install
npm run dev
```

| Script              | What it does                                                 |
| ------------------- | ------------------------------------------------------------ |
| `npm run dev`       | Dev server (Turbopack)                                       |
| `npm run build`     | Production build                                             |
| `npm start`         | Serve the production build                                   |
| `npm run typecheck` | `tsc --noEmit`                                               |
| `npm run lint`      | ESLint                                                       |
| `npm run media`     | Re-encode photos + video posters and regenerate the manifest |

---

## Hosting

Live at **<https://drewreid508.github.io/508filmzz/>**, deployed to GitHub Pages
as a static export.

The custom domain `www.508filmzz.com` is temporarily detached: DNS is correct,
but GitHub would not issue a TLS certificate for it, and an `http`-only site
gets flagged **Not Secure** in every browser. See
[`docs/GITHUB-PAGES.md`](docs/GITHUB-PAGES.md) for how to switch back. Pages cannot run server code, so the booking form
posts to a Google Apps Script endpoint rather than an API route.

Two repository variables control where the build thinks it lives, and they must
always change together — `NEXT_PUBLIC_SITE_URL` (canonicals, sitemap, robots)
and `NEXT_PUBLIC_BASE_PATH` (asset paths, unset for the custom domain). The
deploy workflow asserts both and fails rather than publishing a mismatch.

Full setup — Pages, the form backend, and DNS — is in
[`docs/GITHUB-PAGES.md`](docs/GITHUB-PAGES.md).

## ⚠️ Before you launch

Two things in this build are placeholders and must be replaced:

1. **Reviews** — there are none yet, so there is no reviews section anywhere on
   the site. The home-page band is hidden and the `/reviews` page is parked at
   `src/app/_disabled/reviews/` (underscore folders are excluded from routing).
   Add real quotes to `src/data/reviews.ts` with `placeholder: false` and the
   home-page band returns on its own; the parked file's header comment covers
   restoring the full page. Only publish quotes you have permission to use.
2. **Booking notifications** — connected. Bookings post into a Google Form and
   land in its linked Sheet. Turn on Responses → ⋮ → *Get email notifications*
   or they arrive silently. The site cannot detect a rejected submission, so
   `submit-lead.ts` never sends an empty field — see
   [`docs/GITHUB-PAGES.md`](docs/GITHUB-PAGES.md).

Also double-check `src/data/site.ts`. You gave two TikTok links — I used
`@508_filmzz` (the one listed under Contact Information and in the footer);
change `site.tiktok` if `@drewreid505081` is the account you'd rather send
people to.

---

## Adding new photos and videos

The portfolio is driven by a generated media manifest, so new work only takes
two steps.

### 1. Drop the files in and run the pipeline

Source photos live outside the repo. The default source folder is set in
`scripts/build-media.mjs`:

```bash
MEDIA_SRC="/path/to/your/photo/folder" npm run media
```

For every image this writes AVIF **and** WebP at up to five widths
(420 / 720 / 1080 / 1440 / 2160, capped at the source width), plus a tiny
inlined blur placeholder and the dominant colour, into `public/media/photos/`
and `src/data/media.generated.json`.

It also trims letterboxing automatically — the original set were iPhone
screenshots with black bars, and the pipeline detects and removes them at full
resolution. Files already the right shape pass through untouched.

### 2. Reference the new ids in `src/data/projects.ts`

Media ids are the lowercased filenames (`IMG_5618.PNG` → `img_5618`). Add a
project, or extend an existing `gallery` array:

```ts
{
  slug: "new-build",
  title: "New Build",
  subject: "Client / Vehicle",
  category: "automotive",       // automotive | commercial | drone | photography | social
  year: "2026",
  featured: true,               // surfaces it on the home page
  summary: "One line for cards and search.",
  description: ["Paragraph one.", "Paragraph two."],
  deliverables: ["Hero film", "Stills set"],
  hero: "img_1234",
  gallery: ["img_1234", "img_1235"],
}
```

Everything else updates itself: the portfolio grid, category pages, filters,
search, gallery, lightbox, related projects, sitemap, and the project page at
`/work/<slug>`.

### Videos

Encode into `public/media/video/`, then add a poster frame in
`scripts/build-video-posters.mjs` and attach it to a project:

```ts
video: {
  src: "/media/video/hds-revuelto.mp4",
  poster: "poster-revuelto",
  aspect: 9 / 16,
  label: "Full film",
}
```

The films play inline in a custom vertical player (`ReelPlayer`) — no modal, no
leaving the page. It loads nothing until it scrolls into view and pauses itself
when it scrolls away.

---

## Booking notifications

GitHub Pages cannot run server code, so the form posts to a **Google Apps
Script** web app (`apps-script/Code.gs`) rather than an API route. That script
fans each lead out to four places:

| Channel | What it does | Needs |
| --- | --- | --- |
| **Google Sheet** | Appends a row per lead | `SHEET_ID` |
| **Studio email** | Full brief to you, reply-to the client | `NOTIFY_EMAIL` |
| **Client email** | Branded confirmation to the customer | *(nothing extra)* |
| **SMS** | Texts the booking to your phone | `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`, `SMS_TO` |

**They are deliberately independent.** Each is attempted on its own and none can
throw, so a dead Twilio balance or a renamed tab cannot cost you a booking. The
script only reports failure to the visitor when the Sheet, the studio email, *and*
the SMS have all failed.

Credentials live in Apps Script's Script Properties — inside Google, never in
this repo. That is what makes a public repository safe here.

Validation runs in the browser for instant field errors, then again in the
script, because the endpoint is public and the client is never trusted.

Attachments are capped at **3 files, 5 MB each**: they travel base64-encoded
inside the request body, which inflates them by about a third, and Apps Script is
stricter about payload size than a Node server.

After a successful submission the form redirects to `/contact/success`, a real
page (noindexed) rather than an inline state — so it can be bookmarked and used
as a conversion goal in analytics.

Full setup: [`docs/GITHUB-PAGES.md`](docs/GITHUB-PAGES.md).

---

## Structure

```
src/
  app/                    routes, metadata, sitemap, robots, OG image
  components/
    chrome/               header, footer, logo, preloader, cursor, transitions
    home/                 hero, marquee, services, reel panel
    portfolio/            cards, browser (filter/search), galleries, lightbox
    contact/              booking form
    reviews/              testimonial marquee, stars
    motion/               reveal, text reveal, parallax primitives
    ui/                   frame (image), magnetic button, video modal, counter
  data/                   site config, projects, reviews, generated manifest
  lib/                    media helpers, form schema, utils
scripts/                  media + poster build pipeline
apps-script/              Google Apps Script booking backend
docs/                     hosting + deployment guides
```

### Design system

Tokens live in `src/app/globals.css` under `@theme` — colours (`ink`, `ink-2`,
`surface`, `line`, `accent`), fonts, and easings. Recurring classes:

- `.display` — Bebas Neue, uppercase, tight leading
- `.eyebrow` — wide-tracked micro label
- `.shell` — page gutter and max width
- `.brackets` — the viewfinder-corner hover motif
- `.grain-overlay` — fixed film grain

Electric blue (`#1E90FF`) is used sparingly — hairlines, focus rings, hover
states, and single accent marks.

---

## Performance and accessibility

- Images ship as pre-encoded AVIF/WebP `<picture>` ladders with width/height and
  an inlined LQIP — no runtime image optimisation, no layout shift.
- Everything below the fold lazy-loads; the hero plate is `priority`.
- The reel loop only fetches once it scrolls into view (`preload="none"`).
- Every route is prerendered to static HTML — there is no server at runtime.
- Every animation is gated behind `prefers-reduced-motion`, including Lenis,
  which is not initialised at all when reduced motion is requested.
- Skip link, focus-visible rings, `aria-pressed` filters, `aria-live` result
  counts, labelled dialogs, keyboard-navigable lightbox (arrows + Escape).
