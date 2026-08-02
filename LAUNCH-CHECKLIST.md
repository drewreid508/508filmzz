# 508 Filmzz — Launch Checklists

Three checklists: **site launch**, **Google Business Profile**, and
**post-launch SEO**. Work them in that order — GBP verification goes better
against a live site, and SEO work is wasted before either exists.

Everything not on these lists is already done. These are only the steps that
need one of your accounts.

---

# 1. SITE LAUNCH

## A — Before you deploy

- [ ] **Confirm `drew@508filmzz.com` receives mail.** Send yourself a test from
      another address. MX is routed to Google Workspace, but the domain is days
      old and the mailbox may not be provisioned. Everything downstream depends
      on this.
- [ ] **Create a Resend account** → verify the `508filmzz.com` domain → copy the
      API key. Without this, bookings reach nobody.
- [ ] *(Optional)* Twilio account + a phone number, for booking SMS.
- [ ] *(Optional)* Google Cloud service account + a Sheet shared with it as
      Editor, for a lead log.

## B — Deploy

- [ ] `npx vercel login`
- [ ] `npx vercel --prod` from `~/claude/508filmzz`
- [ ] Open the `*.vercel.app` URL and click every page
- [ ] Submit a real booking on the preview URL and confirm it arrives

## C — Environment variables (Vercel → Settings → Environment Variables)

**Required**

| Variable | Value |
|----------|-------|
| `RESEND_API_KEY` | from Resend |
| `CONTACT_TO` | `drew@508filmzz.com` |
| `CONTACT_FROM` | `508 Filmzz <bookings@508filmzz.com>` |

**Optional**

| Variable | Purpose |
|----------|---------|
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | Booking SMS |
| `SMS_TO_NUMBER` | Defaults to `+18649154071` |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_PRIVATE_KEY` / `GOOGLE_SHEET_ID` | Lead spreadsheet |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console |
| `NEXT_PUBLIC_GA_ID` **or** `NEXT_PUBLIC_GTM_ID` | Analytics — **not both** |
| `NEXT_PUBLIC_CLARITY_ID` | Heatmaps |
| `NEXT_PUBLIC_META_PIXEL_ID` | Only if running Meta ads |

**Leave `NEXT_PUBLIC_SITE_INDEXABLE` unset** — that keeps the soft launch.

- [ ] Redeploy after adding variables (they are read at build time)

## D — DNS (Squarespace panel)

⚠️ **Do not switch nameservers.** Your Google Workspace MX records live in the
Squarespace DNS panel and moving them breaks email silently.

- [ ] Squarespace → Settings → Domains → disconnect `508filmzz.com` from the
      Squarespace **site** (keep the domain + DNS)
- [ ] Delete the Squarespace A records for `@` and the `www` CNAME to
      `ext-sq.squarespace.com`
- [ ] Add: **A** `@` → `76.76.21.21`
- [ ] Add: **CNAME** `www` → `cname.vercel-dns.com`
- [ ] **Leave every MX and TXT record untouched**
- [ ] Vercel → Settings → Domains → add both `508filmzz.com` and
      `www.508filmzz.com`, set **`www` as canonical**

## E — Verify after DNS propagates

```bash
dig +short www.508filmzz.com CNAME
dig +short 508filmzz.com MX
curl -sSI https://www.508filmzz.com | head -5
curl -s https://www.508filmzz.com/robots.txt
```

- [ ] CNAME → `cname.vercel-dns.com`
- [ ] **MX still `smtp.google.com`** — if empty, restore it immediately
- [ ] HTTP 200, `server: Vercel`
- [ ] `robots.txt` reads `Disallow: /` (still soft-launched)
- [ ] Send another test email to `drew@`
- [ ] Submit one more booking on the live domain
- [ ] **Open the site in Safari** (desktop + iPhone) — the one browser I could
      not test. Check the intro animation, smooth scroll, backdrop blur on the
      header, and the outlined "FILMZZ" wordmark

## F — Going fully public (when you're ready)

- [ ] Set `NEXT_PUBLIC_SITE_INDEXABLE=true` in Vercel
- [ ] Redeploy
- [ ] `curl -s https://www.508filmzz.com/robots.txt` → now reads `Allow: /`

---

# 2. GOOGLE BUSINESS PROFILE

Full copy for every field is in
`00 BUSINESS/508-FILMZZ-GOOGLE-BUSINESS-PROFILE.md`. Do not start until the site
is live — Google looks at it.

## A — Create

- [ ] business.google.com → Add business
- [ ] Name: exactly `508 Filmzz` — **no keywords appended**, that is a
      suspension trigger
- [ ] Primary category: `Video production service`
- [ ] Tick **"I deliver goods and services to my customers"**
- [ ] Address: `65 Charterhouse Ave, Piedmont, SC 29673`
- [ ] Add the 13 service areas from §2 of the GBP doc
- [ ] Phone `(864) 915-4071`, website `https://www.508filmzz.com`

## B — Verify

- [ ] Request verification (postcard, phone, or video — Google chooses)
- [ ] Enter the code when it arrives

## C — ⚠️ Immediately after verification

- [ ] **Edit profile → Location → hide the street address.** It is public until
      you do this
- [ ] Load the profile in an incognito window and confirm only service areas show

## D — Fill it in

- [ ] Description — the 742-character Alternate B
- [ ] 4 additional categories: Videographer, Commercial photographer, Video
      editing service, Photographer
- [ ] 9 services with descriptions
- [ ] Attributes: Online appointments, Onsite services, Appointment required
- [ ] Hours: Mon–Fri 8–6, Sat 9–4, Sun closed
- [ ] Opening date: August 2026
- [ ] Profile photo: `BRAND/508filmzz-profile-stacked-720.png`
- [ ] Cover photo: `BRAND/cover-img_5638-branded-1200x675.jpg`
- [ ] First 10 gallery photos from `IMAGES/square/`
- [ ] All 18 Q&As (post from a second Google account, answer from the owner one)

## E — Reviews

- [ ] Get the review short link from the profile
- [ ] Save it to your phone alongside the delivery text template
- [ ] Ask **Hannah's Detailing**, **Upstate Carolina Cars**, and **Naked Metal
      Fab** — one each from detailing, dealership, and fabrication
- [ ] **Target 5 reviews.** Below 5, Google shows no star rating at all

⚠️ **Before publishing photos `5624`, `5625`, or `5630`** — they show client
branding and identifiable people. Get written permission first. A text message
is enough; keep it.

---

# 3. POST-LAUNCH SEO

## Week 1

- [ ] Search Console → add `https://www.508filmzz.com` as a URL-prefix property
- [ ] Verify via the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` meta tag
- [ ] Submit `https://www.508filmzz.com/sitemap.xml` *(only after going
      indexable — a noindexed sitemap submission just logs errors)*
- [ ] Bing Webmaster Tools — import from Search Console, it takes a minute
- [ ] Rich Results Test on the homepage → confirm LocalBusiness parses
- [ ] PageSpeed Insights on the live URL → compare against the localhost numbers
      in `PRODUCTION-REPORT.md`

## Weeks 2–4

- [ ] GBP posts 1–5 (one or two a week)
- [ ] 3–5 gallery photos a week
- [ ] Citations with **identical** name/address/phone: Bing Places, Apple
      Business Connect, Yelp, Facebook, Nextdoor, Thumbtack, Greenville Chamber
- [ ] Answer every review within 48 hours

## Months 2–3

- [ ] City landing pages: Greenville, Easley, Anderson, Greer — one page each,
      real content, not spun duplicates
- [ ] 10 then 15 reviews, each ideally naming a service and a city
- [ ] Add GBP categories **one at a time**, checking rank between each
- [ ] Add Products with real prices once you're confident in them
- [ ] Decide the preloader tradeoff (see `PRODUCTION-REPORT.md`) — it is the
      only thing holding mobile performance at 75

## Monthly, ongoing

- [ ] Local pack position for the 8 Tier 1 keywords, checked **from different
      Upstate zip codes** — checking from home only flatters you via proximity
- [ ] GBP Insights: Direct vs **Discovery** vs Branded. Discovery growth is the
      signal that the keyword work is landing
- [ ] Calls, direction requests, website clicks
- [ ] Search Console impressions and average position
- [ ] Review count and rating

---

## The one number that decides everything

Review velocity. The technical foundation here is better than most established
competitors in the Upstate — schema, NAP consistency, service areas, city
coverage, page speed. None of it outruns having zero reviews.

Five reviews in month one is worth more than every other item on this page.
