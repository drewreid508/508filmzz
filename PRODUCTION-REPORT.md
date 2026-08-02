# 508 Filmzz — Production Report

**2026-08-02** · Phases 1–4 and 6–10 complete. Phase 5 was already built.

Every number below was measured on this machine against a real production build.
Nothing is estimated, and where I could not measure something I say so.

---

## Lighthouse — measured, not estimated

Lighthouse 13.4.1, headless Chrome, against `next start` serving the production
build on `localhost:3212`. Desktop preset unless marked.

| Page | Performance | Accessibility | Best Practices | SEO |
|------|------------:|--------------:|---------------:|----:|
| Home (desktop) | **95** | **100** | **100** | **100** |
| Contact (desktop) | **98** | **100** | **100** | **100** |
| Portfolio (desktop) | **94** | **100** | **100** | **100** |
| Home (**mobile**) | **75** | **100** | **100** | **100** |

**Desktop home vitals:** FCP 0.3 s · LCP 1.8 s · TBT 0 ms · CLS 0.007 · SI 1.6 s
**Mobile home vitals:** FCP 0.9 s · LCP 7.0 s · TBT 0 ms · CLS 0

### Two caveats that matter

**1. These are localhost numbers.** No network latency, no TLS handshake, no
CDN. Vercel will differ — usually better on repeat visits due to edge caching,
sometimes worse on first byte. Re-run against the live URL after deploy.

**2. SEO scores 69, not 100, in the build you are actually shipping.** That is
the soft launch working as designed. The *only* failing audit is
`is-crawlable: Page is blocked from indexing`. I built an indexable version
purely to confirm the rest of the SEO category passes — it scored **100** — then
rebuilt private. Flip `NEXT_PUBLIC_SITE_INDEXABLE=true` and you get the 100.

---

## Issues found and fixed

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | **Six fabricated testimonials rendering publicly** on `/reviews`, attributed to "Client Name" | 🔴 Critical | `publicReviews` filters placeholders out of production builds; honest empty state replaces them. Verified absent from built HTML |
| 2 | Site claimed "Based in Greenville" — registered address is Piedmont | 🔴 Compliance | All copy corrected to "Piedmont, serving Greenville." Inaccurate location claims are a common suspension trigger |
| 3 | `.eyebrow` / `text-faint` at 3.24:1 contrast — below WCAG AA 4.5:1 | 🟠 A11y | `--color-faint` 0.36 → 0.47 alpha (~4.8:1). Accessibility 96 → 100 |
| 4 | Logo links: accessible name didn't contain visible text (WCAG 2.5.3) | 🟠 A11y | Real space character between "508" and "Filmzz" instead of a CSS margin |
| 5 | Hero slide buttons: `aria-label` omitted the visible "01"/"02" | 🟠 A11y | Label now leads with the number |
| 6 | Portfolio jumped `h1` → `h3`, no `h2` | 🟠 A11y | Visually-hidden `<h2>`. Portfolio a11y 98 → 100 |
| 7 | Video poster loaded the 900 px rendition (214 KB) eagerly below the fold | 🟡 Perf | New `atLeast()` helper caps it at 720 px |
| 8 | No favicon set, no apple-touch-icon, no web manifest | 🟡 Polish | All generated and wired |
| 9 | `CONTACT_TO` pointed at `info@`, not `drew@` | 🟡 Config | Updated |
| 10 | Source PNGs 6–12 MB — over Google's 5 MB photo limit | 🟡 Assets | 148 JPEGs generated, largest 674 KB |

---

## Known issue — mobile LCP 7.0 s

**This is a design decision, not a defect, so I have not changed it unilaterally.**

The cinematic preloader runs `DURATION = 1500 ms` then a 1000 ms exit slide —
2.5 s before real content is revealed, before Lighthouse's 4× CPU throttle
stretches the rAF loop further. FCP is 0.9 s (the preloader paints fast); LCP is
7.0 s (the hero appears only afterward). There are no render-blocking resources
and TBT is 0 ms — the site is not slow, it is *deliberately delayed*.

Shrinking the poster image moved LCP 7.2 s → 7.0 s, which confirms images were
never the bottleneck.

**Your options:**

| Option | Effect | Cost |
|--------|--------|------|
| Leave it | Mobile Perf ~75 | Lighthouse mobile simulates throttled 4G; real users on 5G/Wi-Fi see far better |
| `DURATION` 1500 → 800 ms, exit 1 s → 0.5 s | Perf likely low 80s | Intro still reads, just snappier |
| Skip the preloader under 768 px | Perf likely 90+ | Desktop keeps the full intro; mobile gets none |

Core Web Vitals feed ranking, and mobile is where most local search happens — so
this genuinely costs something. But it is your brand's first impression and that
is your call, not mine. Say the word and I'll implement any of the three.

---

## What was tested, and what wasn't

**Tested here:**
- Chromium (the in-app browser and headless Chrome) — desktop, tablet, mobile
- Viewports 320, 375, 768, 1024×768 — **no horizontal overflow at any width**
- Tablet rotation (768×1024 → 1024×768) — layout recalculates correctly
- Console: **zero errors** across home, contact, portfolio, reviews
- Typecheck, ESLint, production build: **clean** — 28 routes
- JSON-LD parsed from built HTML and field-by-field verified

**❌ Not tested — I cannot, and will not claim otherwise:**
- **Safari, Firefox, Edge.** Only Chromium is available in this environment.
  Safari is the real risk: this site leans on Lenis smooth scroll, Framer Motion,
  `backdrop-filter`, and `-webkit-text-stroke`. Safari is installed on your Mac —
  **open the preview and click through before launch.** iOS Safari especially.
- **Real devices.** Emulated viewports are not touch hardware.
- **The live domain.** Everything was measured on localhost.
- **The booking pipeline end to end.** No credentials configured, so no email or
  SMS has ever actually been sent. Unverifiable until you add keys.

---

## Files changed

**Modified**
```
src/data/site.ts                          contact, address, service areas, hours, owner
src/data/reviews.ts                       publicReviews production filter
src/app/layout.tsx                        icons, manifest, verification, analytics, robots
src/app/globals.css                       --color-faint contrast fix
src/app/robots.ts                         soft-launch gating
src/app/reviews/page.tsx                  publicReviews + empty state
src/app/contact/page.tsx                  location copy
src/components/seo/structured-data.tsx    address, areaServed, hours, logo, founder, FAQ
src/components/reviews/reviews-marquee.tsx  publicReviews
src/components/chrome/logo.tsx            WCAG 2.5.3 space fix
src/components/home/hero.tsx              button aria-label
src/components/portfolio/portfolio-browser.tsx  sr-only h2
src/components/ui/reel-player.tsx         smaller poster
src/lib/media.ts                          atLeast() helper
.env.example                              visibility switch + analytics vars
```

**Added**
```
src/lib/visibility.ts                     soft-launch switch
src/app/manifest.ts                       PWA manifest
src/components/analytics/analytics.tsx    GA4 / GTM / Clarity / Meta Pixel
DEPLOYMENT.md                             Vercel + DNS runbook
PRODUCTION-REPORT.md                      this file
public/brand/                             logo, social share, wordmark
public/favicon-192.png, favicon-512.png, apple-touch-icon.png
```

**Outside the repo**
```
00 BUSINESS/BRAND/                        24 brand assets + legibility/cover proofs
00 BUSINESS/IMAGES/                       148 images, manifest.json, alt text & captions
00 BUSINESS/508-FILMZZ-GOOGLE-BUSINESS-PROFILE.md
00 BUSINESS/_BACKUP_508filmzz_20260802_031139/   391-file pre-change backup
```

**Nothing was deleted.** A full backup was taken before the first edit.

---

## Remaining manual tasks — all need you

| # | Task | Why I can't |
|---|------|-------------|
| 1 | **Deploy to Vercel** | Your account |
| 2 | **Repoint DNS** — keep Squarespace nameservers, add Vercel A/CNAME | Registrar access. ⚠️ Do **not** switch nameservers — your Google Workspace MX lives there. See `DEPLOYMENT.md` |
| 3 | **Confirm `drew@508filmzz.com` receives mail** | Domain is hours old; MX routes to Google but the mailbox may not exist |
| 4 | **Add `RESEND_API_KEY` + `CONTACT_TO`** | Without it every booking is lost — `inquiries.jsonl` does not persist on serverless |
| 5 | Twilio credentials for booking SMS | Paid account |
| 6 | GA4 / GTM / Clarity / Meta Pixel IDs | Your accounts |
| 7 | Search Console verification | Your Google account |
| 8 | **Delete the 6 placeholder reviews from `reviews.ts`** | Blocked from production already, but delete them to be certain |
| 9 | **Test in Safari** | Not available here |
| 10 | Decide the preloader tradeoff | Brand call |
| 11 | Google Business verification | Explicitly out of scope per your instruction |
| 12 | Client permission for photos showing branding/people | Legal, not technical — see `IMAGES/ALT-TEXT-AND-CAPTIONS.md` |

---

## Launch readiness

| Area | Status |
|------|--------|
| Build & types | ✅ Clean, 28 routes |
| Accessibility | ✅ 100 across tested pages |
| Best practices | ✅ 100 |
| SEO (technical) | ✅ 100 when indexable |
| Desktop performance | ✅ 94–98 |
| Mobile performance | ⚠️ 75 — preloader, your call |
| Structured data | ✅ Verified from built HTML |
| Brand assets | ✅ 24 files |
| Images | ✅ 148 files, all under Google's limit |
| Google Business pack | ✅ Prepared, **not published** |
| Cross-browser | ❌ Chromium only |
| Booking pipeline | ⚠️ Built, never executed — no credentials |
| Deployment | ⛔ Needs you |

### Google Business readiness

Everything is written and locked: description (742 chars), 9 services, 18 Q&As,
30 posts, 8 products, review request and response templates, categories,
attributes, keyword strategy, 90-day ranking plan, and 148 upload-ready photos.

**Nothing has been submitted to Google. No profile exists. No verification was
requested.** Two things should happen before you start: get the site live (Google
looks at it), and line up your first three review requests.

### Ranking readiness — honest version

You are a **brand-new profile, at a Piedmont address, with zero reviews**. The
technical foundation is genuinely strong — schema, NAP consistency, service
areas, and city coverage are better than most established competitors in the
Upstate. But prominence is mostly reviews and age, and neither can be bought or
rushed.

Expect to rank for your own name and long-tail terms within weeks, own the
Piedmont/Powdersville/Easley ring within a few months, and contend for
"video production Greenville" somewhere past month six — **if review velocity
holds.** That single variable decides the outcome. Everything else is done.
