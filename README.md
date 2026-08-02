# 508 Filmzz

Premium cinematic portfolio site — **One Vision. Every Detail.**

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

## ⚠️ Before you launch

Two things in this build are placeholders and must be replaced:

1. **Reviews** — `src/data/reviews.ts` ships sample testimonials marked
   `placeholder: true`, attributed to generic roles ("Client Name — Performance
   Shop"). They are **not real quotes**. Replace each with a real testimonial you
   have permission to publish and set `placeholder: false`. `clientMarks` in the
   same file holds the trust-strip wordmarks — swap those for real client names
   once you have sign-off.
2. **Booking notifications** — the SMS, email, and Google Sheet channels are all
   built and tested, but none of them are configured. Until you add the keys in
   `.env.example`, every booking is captured to `data/inquiries.jsonl` only, and
   that file does **not** survive on serverless hosts. See
   [Booking notifications](#booking-notifications) below.

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
  category: "automotive",       // "automotive" | "business" | "outdoor"
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
  src: "/media/video/showreel.mp4",
  poster: "poster-showreel",
  aspect: 9 / 16,
  label: "Full film",
}
```

The films play inline in a custom vertical player (`ReelPlayer`) — no modal, no
leaving the page. It loads nothing until it scrolls into view and pauses itself
when it scrolls away.

---

## Booking notifications

`POST /api/contact` validates with Zod, rate-limits per IP (5 per 10 minutes),
runs a honeypot, accepts up to 5 attachments (8 MB each, 20 MB total), and then
fans the lead out to four destinations:

| Channel               | What it does                                     | Needs                                                        |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| **SMS**               | Texts the booking to your phone                  | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` |
| **Studio email**      | Full brief to `info@508filmzz.com`, reply-to client | `RESEND_API_KEY`, `CONTACT_TO`                              |
| **Client email**      | Branded confirmation to the customer             | `RESEND_API_KEY`                                              |
| **Google Sheet**      | Appends a row per lead                           | `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID` |

**They are deliberately independent.** All four run concurrently, none can
throw, and each failure is logged on its own. If Twilio is down or out of
balance, both emails still send and the row still lands in the sheet. If
everything fails, the lead is still appended to `data/inquiries.jsonl` and the
customer still gets a success page — you never lose a booking to an outage.

Setup instructions for each are inline in `.env.example`:

```bash
cp .env.example .env.local
```

Two things that catch people out:

- **Share the Google Sheet with the service-account email as an Editor.**
  Creating the key is not enough; without sharing, every append returns 403.
- **Serverless filesystems are ephemeral.** `data/inquiries.jsonl` is a local
  safety net for development, not production storage. Configure at least the
  Sheet or Resend before you launch.

After a successful submission the form redirects to `/contact/success`, a real
page (noindexed) rather than an inline state — so it can be shared, bookmarked,
and used as a conversion goal in analytics.

---

## Structure

```
src/
  app/                    routes, metadata, sitemap, robots, OG image, API
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
- 26 routes prerender as static HTML; only `/api/contact` is dynamic.
- Every animation is gated behind `prefers-reduced-motion`, including Lenis,
  which is not initialised at all when reduced motion is requested.
- Skip link, focus-visible rings, `aria-pressed` filters, `aria-live` result
  counts, labelled dialogs, keyboard-navigable lightbox (arrows + Escape).
