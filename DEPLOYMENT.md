# 508 Filmzz — Deployment & DNS

**Verified live 2026-08-02.** Everything in "Current state" was measured, not assumed.

---

## Current state

| Fact | Value |
|------|-------|
| Registrar | Squarespace Domains II LLC |
| Registered | **2026-08-02 07:37 UTC** (brand new) |
| Expires | 2027-08-02 — set auto-renew |
| Nameservers | `nsd1–nsd4.squarespacedns.com` (DNS managed at Squarespace) |
| Currently serving | Squarespace **"Coming Soon"** placeholder — no real content |
| Indexed? | No. `robots.txt` returns a *Private Site* page with `noindex` |
| SSL | Valid Let's Encrypt cert, issued by Squarespace, expires 2026-10-31 |
| MX | `smtp.google.com` — Google Workspace |
| SPF | `v=spf1 include:_spf.google.com ~all` |
| Transfer lock | `clientTransferProhibited` — ICANN 60-day lock, lifts ~2026-10-01 |

**Two pieces of good news.** The placeholder was never indexed, so there is no legacy SEO to preserve and no redirect map to build — a genuinely clean launch. And email is already routed to Google Workspace.

**One piece of bad news.** The Squarespace page is live at your domain right now. Anyone who types it in sees "We're under construction."

---

## ⚠️ Read before you touch DNS

**Your email records live in the Squarespace DNS panel.** MX points at Google Workspace and SPF authorises Google to send.

If you switch nameservers to Vercel, **every one of those records disappears** and `drew@508filmzz.com` stops receiving mail — including the Google Business verification email and every booking notification. This is the single most common way people break a launch.

**So: do not change nameservers.** Keep DNS at Squarespace and point two records at Vercel. Path A below.

---

## Path A — Recommended: keep Squarespace DNS, point records at Vercel

### Step 1 — Deploy to Vercel (no DNS yet)

```bash
cd ~/claude/508filmzz
npx vercel login
npx vercel --prod
```

You get a working `*.vercel.app` URL. **Test it fully before touching DNS** — if something is wrong, the live domain is unaffected.

> Requires your Vercel account. I cannot log in for you.

### Step 1b — Soft launch is already the default

The site is built to go live **noindex**: reachable by anyone you send the link
to, invisible in Google. You do not have to do anything to get this — it is what
happens when `NEXT_PUBLIC_SITE_INDEXABLE` is unset.

| State | `NEXT_PUBLIC_SITE_INDEXABLE` | robots.txt | Page meta |
|-------|------------------------------|-----------|-----------|
| **Soft launch** (default) | unset / anything else | `Disallow: /` | `noindex, nofollow, nocache` |
| Fully public | `true` | `Allow: /` + sitemap | `index, follow` |

Fail-closed on purpose: a typo leaves you private rather than accidentally
public. Both states were built and verified on 2026-08-02.

**To go fully public later:** set the variable to `true` in Vercel, **redeploy**
(it is read at build time), then confirm:

```bash
curl -s https://www.508filmzz.com/robots.txt
```

Then submit the sitemap in Search Console. Nothing else changes.

⚠️ Noindex is a request, not a lock. It stops Google listing you; it does not
stop anyone who has the URL. Do not treat the live site as private storage.

### Step 2 — Add environment variables in Vercel

Project → Settings → Environment Variables. Everything in `.env.example`, at minimum:

| Variable | Why it matters |
|----------|----------------|
| `RESEND_API_KEY` | Without it, no booking email reaches you |
| `CONTACT_TO` | `drew@508filmzz.com` |
| `CONTACT_FROM` | Sender — domain must be verified in Resend |
| `TWILIO_ACCOUNT_SID` / `_AUTH_TOKEN` / `_FROM_NUMBER` | Booking SMS |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console |
| `NEXT_PUBLIC_GA_ID` *or* `NEXT_PUBLIC_GTM_ID` | Analytics — **not both**, that double-counts |

Redeploy after adding them; env vars are baked at build time.

### Step 3 — Disconnect the domain from the Squarespace site

**Do this first or Step 4 silently fails.** Squarespace will keep asserting its own records while the domain is attached to a site.

Squarespace → Settings → Domains → `508filmzz.com` → **disconnect from the site**, keeping the domain registered and DNS managed.

Keep the Squarespace subscription only if you want it as registrar. You do not need their site plan.

### Step 4 — Add Vercel's records in the Squarespace DNS panel

Delete the Squarespace-injected A records for `@` and the `www` CNAME pointing at `ext-sq.squarespace.com`.

**Leave every MX and TXT record exactly as it is.**

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | `@` | `76.76.21.21` | 3600 |
| CNAME | `www` | `cname.vercel-dns.com` | 3600 |

Vercel prints the exact values in Project → Settings → Domains when you add the domain — **use those if they differ from the above.** Vercel occasionally rotates its apex IP.

### Step 5 — Add the domain in Vercel

Project → Settings → Domains → add `508filmzz.com` and `www.508filmzz.com`.

Set one as canonical and redirect the other. **Pick `www`** — it matches `site.url` (`https://www.508filmzz.com`), which is already baked into your canonicals, sitemap, JSON-LD, and OG tags. Choosing the apex instead means editing `site.ts` and rebuilding.

Vercel issues its own certificate automatically once DNS resolves. Do not try to move the Squarespace cert.

### Step 6 — Verify

Propagation is usually minutes, up to 48 hours.

```bash
dig +short www.508filmzz.com CNAME
curl -sSI https://www.508filmzz.com | head -5
dig +short 508filmzz.com MX
```

Expect: CNAME → `cname.vercel-dns.com`, HTTP 200 with `server: Vercel`, and **MX still `smtp.google.com`**. If MX came back empty, stop and restore it — mail is down.

Then send a test email to `drew@508filmzz.com` and confirm it arrives.

---

## Path B — Move nameservers to Vercel

Only if you want DNS fully at Vercel. Set nameservers to `ns1.vercel-dns.com` / `ns2.vercel-dns.com`, then **manually recreate**:

- MX → `smtp.google.com` (priority 1) plus any other Google MX records
- TXT → `v=spf1 include:_spf.google.com ~all`
- Any DKIM/DMARC records Google Workspace added

Recreate these **before** the switch, not after. Not recommended — more moving parts, and the failure mode is silent mail loss.

---

## What you cannot do for 60 days

`clientTransferProhibited` is ICANN's standard lock on new registrations. You **cannot transfer to another registrar until ~2026-10-01**. This does not block anything above — DNS changes work fine during the lock. It only matters if you wanted to leave Squarespace as registrar.

---

## Vercel: is it the right host?

Yes. Next.js 16 App Router, 28 routes, one dynamic API route (`/api/contact`), static-first. Vercel is Next's first-party platform and the free Hobby tier covers this traffic profile.

**Compression, caching, and CDN are on by default** — nothing to configure. Two caveats:

1. **`data/inquiries.jsonl` will not persist.** Serverless filesystems are ephemeral. It is a dev safety net only. Configure Resend or the Google Sheet before launch or you *will* lose bookings.
2. **Hobby tier is for non-commercial use.** This is a commercial site — you likely need **Pro ($20/mo)** to be within Vercel's terms. Your call; I'm flagging the licensing, not the technical limit.

---

## Pre-launch gate

- [ ] `drew@508filmzz.com` confirmed receiving mail
- [ ] Resend (or Sheet) configured — bookings cannot be lost
- [ ] `*.vercel.app` preview tested end to end, including a real booking submission
- [ ] Placeholder testimonials removed from `src/data/reviews.ts` *(already blocked from production output, but delete them to be certain)*
- [ ] Domain disconnected from the Squarespace site
- [ ] MX verified intact after the DNS change
- [ ] Confirmed `robots.txt` reads `Disallow: /` — you are soft-launched, not indexed

### Later, when you decide to go fully public

- [ ] `NEXT_PUBLIC_SITE_INDEXABLE=true` in Vercel, then redeploy
- [ ] `robots.txt` now reads `Allow: /`
- [ ] Search Console property added and verified
- [ ] Sitemap submitted: `https://www.508filmzz.com/sitemap.xml`

---

## Order of operations

DNS first, Google Business second. Google checks your website during verification, and a live professional site materially helps. A "Coming Soon" page does not.
