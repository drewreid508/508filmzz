# Editing the site

Everything you are likely to change lives in **two files**. You do not need to
touch a component to update content.

| I want to change… | File |
| --- | --- |
| Email, phone, Instagram, TikTok, location | `src/data/site.ts` → `site` |
| Prices | `src/data/site.ts` → `packages` |
| Services and what each includes | `src/data/site.ts` → `services` |
| Navigation links | `src/data/site.ts` → `nav` |
| FAQ answers | `src/data/site.ts` → `faqs` |
| Portfolio projects & categories | `src/data/projects.ts` |
| Reviews (once you have real ones) | `src/data/reviews.ts` |
| Hero background images | `src/components/home/hero.tsx` → `PLATES` |

**Every change goes live the same way:** save, commit, push. GitHub Actions
rebuilds and publishes in about a minute.

```bash
git add -A && git commit -m "Update prices" && git push
```

---

## Change your prices

`src/data/site.ts` → `packages`. Change the `price` string, nothing else:

```ts
{
  id: "automotive",
  name: "Automotive Production",
  price: "$300+",        // ← change this
  summary: "Rolling, static, and detail coverage for a build, a car, or a shop.",
  includes: [
    "Rolling & tracking shots",   // ← and these, if what you offer changes
    "Detail and hero frames",
  ],
  featured: true,        // ← highlights the card. Keep it on ONE package only
},
```

Prices are written as strings (`"$300+"`), so you can put anything there —
`"$1,200+"`, `"From $300"`, `"Contact for quote"`. Every price shows under a
"Starting at" label, which is why raising them later never makes a published
number wrong.

The line under the grid is `pricingNote` in the same file.

---

## Change your email or social links

All in `src/data/site.ts` → `site`:

```ts
email: "508filmz@gmail.com",
phone: "(864) 915-4071",
phoneE164: "+18649154071",              // used by tap-to-call — keep the +1 format
instagram: "https://www.instagram.com/508_filmzz/",
tiktok: "https://www.tiktok.com/@508_filmzz",
instagramHandle: "@508_filmzz",
tiktokHandle: "@508_filmzz",
```

Change it once and it updates the header, footer, contact page, social buttons,
and the structured data Google reads. Nothing hardcodes an address anywhere else.

> **Check the TikTok URL.** You gave me two different handles earlier. The site
> currently points at `@508_filmzz` because that is what appeared in your contact
> details. If your real account is different, fix `tiktok` and `tiktokHandle`.

---

## Add a new portfolio project

### 1. Prepare the images

Drop your photos into a folder and run:

```bash
MEDIA_SRC="/path/to/your/photos" npm run portfolio
```

This crops everything to 1080×1920, applies the grade, writes AVIF + WebP at
four sizes, and adds each image to `src/data/portfolio.generated.json`. Image ids
are the lowercased filename with a `pf_` prefix — `IMG_5901.PNG` → `pf_img_5901`.

### 2. Add the project

`src/data/projects.ts`, anywhere in the `projects` array. Order in the array is
the order on the site, so **put your strongest work first**:

```ts
{
  slug: "widebody-gtr",              // becomes /work/widebody-gtr
  title: "Widebody GT-R",
  subject: "Private Client",
  category: "automotive",            // automotive | commercial | drone | photography | social
  year: "2026",
  featured: true,                    // shows it on the home page
  summary: "One line for cards and search.",
  description: ["First paragraph.", "Second paragraph."],
  deliverables: ["Hero film", "Stills set"],
  hero: "pf_img_5901",               // the card image
  gallery: ["pf_img_5901", "pf_img_5902", "pf_img_5903"],
},
```

The wall, filters, lightbox, related projects, and sitemap all pick it up
automatically.

### How the Work page works now

`/portfolio` is **one wall of photographs**, not a set of albums. Every frame in
every project's `gallery` is on the page at once, filterable by category in
place, and clicking one opens it full screen. The tiles carry no caption on
purpose — the project name is in the lightbox and in the screen-reader label.

Adding a project therefore adds its frames straight to the wall. The
`/work/<slug>` page still exists for the write-up, but nobody has to go through
it to see the pictures.

**Order matters.** Frames appear in project order, then gallery order — so the
first few ids in your strongest project are the first thing anyone sees.

---

## Add a video to a project

Put the file in `public/media/video/`, then add a `video` block to the project:

```ts
video: {
  src: "/media/video/gtr-film.mp4",
  poster: "pf_img_5901",   // an image id — used as the thumbnail
  aspect: 9 / 16,          // 16 / 9 for a widescreen film
  label: "Full film",
},
```

**Keep videos under about 20 MB.** They are committed to the repo and downloaded
by every visitor who presses play. To compress:

```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -maxrate 2400k -bufsize 4800k \
  -preset slow -r 30 -pix_fmt yuv420p -c:a aac -b:a 112k \
  -movflags +faststart public/media/video/gtr-film.mp4
```

### The films on the Work page

`/portfolio` leads with a **Films** band that renders every project carrying a
`video` block — add one to a project and it appears there automatically, with a
FILM badge on its card in the grid below. Nothing else to wire up.

Current films:

| File | Project |
| --- | --- |
| `hds-revuelto.mp4` | Revuelto — HDS / Hannah's Detailing |
| `bratchers-power-washing.mp4` | Bratchers Power Washing |
| `ram-hd.mp4` | Heavy Duty — RAM HD on forged wheels |
| `g-wagon.mp4` | G-Class — Mercedes-Benz G-Class |
| `bratchers-night-wash.mp4` | Night Wash — Bratchers, overnight |

The homepage showreel and the hero play button both point at
`hds-revuelto.mp4`. To feature a different film, change the `src` and `poster`
in `src/components/home/reel-panel.tsx` and `src/components/home/hero.tsx`.

### Poster frames

After adding a video, add it to `POSTERS` in
`scripts/build-video-posters.mjs` and run:

```bash
node scripts/build-video-posters.mjs
```

Pick an `at` timestamp that reads as a thumbnail — a strong frame, not a title
card or a fade.

---

## Add your first drone project

The Drone page is live and sells the service, but the Drone **filter** is hidden
on the Work page until there is aerial work to show — an empty category reads as
a broken site rather than a new service.

1. Shoot it.
2. Run the image pipeline as above.
3. Add a project with `category: "drone"`.

That single change does three things automatically: the Drone filter appears on
the Work page, the Drone tile joins the homepage vertical grid, and the
"Newly added service" placeholder block on `/drone` disappears.

To put an aerial video at the top of the drone page, open
`src/app/drone/page.tsx` and follow the `REPLACE WITH REAL AERIAL FOOTAGE`
comment — swap `<AerialGrid />` for a `<video>` tag and keep the scrim divs so
the headline stays readable.

---

## Add real reviews

There is **no reviews section on the site right now** — no band on the home
page, and no `/reviews` page. Nothing was thrown away: the page is parked at
`src/app/_disabled/reviews/page.tsx`, and any folder in `src/app` starting with
an underscore is skipped by the router, so it is simply not built.

To bring reviews back, start with the quotes. `src/data/reviews.ts`:

```ts
export const reviews: Review[] = [
  {
    id: "r1",
    quote: "What they actually said.",
    author: "Real Name",
    company: "Their Business",
    role: "Owner",
    rating: 5,
    placeholder: false,   // must be false to publish
  },
];
```

Only publish quotes you have permission to use, with real names. Anything left
as `placeholder: true` stays hidden.

That one edit brings the scrolling band back to the home page. If you also want
the dedicated `/reviews` page, do three more things — they are listed in full at
the top of the parked file:

```bash
git mv src/app/_disabled/reviews src/app/reviews
```

then re-add the `/reviews` line to `src/app/sitemap.ts`, and re-add the "Read
all reviews" button in `src/app/page.tsx` (the Reviews comment block says
exactly where it goes).

**Why it is parked rather than left up empty.** A live "Reviews" page reading
*"first reviews landing soon"* tells every visitor that nobody has hired you
yet. A page that does not exist tells them nothing. Until there are real quotes,
the portfolio is the honest version of a testimonial.

---

## Deploying

Automatic. Push to `main` and GitHub Actions builds and publishes.

```bash
git add -A
git commit -m "Describe the change"
git push
```

Watch it in the **Actions** tab. The build deliberately fails rather than
publishing something broken if `.nojekyll`, the portfolio images, or the asset
prefix are wrong.

To redeploy without a code change — after editing a repository variable, for
example — go to **Actions → Deploy to GitHub Pages → Run workflow**.

Full hosting, custom domain, and booking-form setup:
[`docs/GITHUB-PAGES.md`](GITHUB-PAGES.md).
