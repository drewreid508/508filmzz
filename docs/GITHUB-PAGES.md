# Hosting on GitHub Pages

The site is a **static export**. GitHub Pages serves files and cannot run code,
so there is no API route — the booking form posts to a Google Apps Script
endpoint instead.

Three things to set up, in this order:

1. [Turn on Pages](#1-turn-on-pages) — gets the site live
2. [Wire up the booking form](#2-wire-up-the-booking-form) — until you do this, the form tells people to call instead
3. [Point your domain](#3-point-your-domain) — moves it to `www.508filmzz.com`

---

## 1. Turn on Pages

**Settings → Pages → Build and deployment → Source: GitHub Actions.**

That is the whole setup. The workflow in `.github/workflows/deploy.yml` builds
and publishes on every push to `main`. Watch the first run in the **Actions**
tab; it takes two or three minutes.

The build fails deliberately if `.nojekyll` or the portfolio images are missing,
so a broken deploy never goes live.

> **The repo must be public** unless you have GitHub Pro or Team. Pages will not
> publish from a private repo on the free plan.

---

## 2. Wire up the booking form

Without this the form still validates and still looks right, but it shows
*"The booking form isn't connected yet"* rather than pretending to send. Phone
and email links keep working throughout.

### a. Create the Sheet

New Google Sheet → name it something like `508 Filmzz — Leads`. Copy the id out
of the URL:

```
docs.google.com/spreadsheets/d/  THIS_LONG_STRING  /edit
```

You do **not** need to add headers. The script writes them on the first booking.

### b. Create the script

In that Sheet: **Extensions → Apps Script**. Delete the placeholder code and
paste the entire contents of [`apps-script/Code.gs`](../apps-script/Code.gs).

### c. Add your credentials

**Project Settings** (gear icon) **→ Script Properties → Add script property.**

| Property | Required | Value |
|---|---|---|
| `SHEET_ID` | **yes** | The long string from step (a) |
| `NOTIFY_EMAIL` | **yes** | Where booking alerts go — `drew@508filmzz.com` |
| `SHEET_TAB` | no | Defaults to `Leads` |
| `DRIVE_FOLDER_ID` | no | A Drive folder id, to keep uploaded reference files |
| `TWILIO_SID` | no | Twilio Account SID |
| `TWILIO_TOKEN` | no | Twilio Auth Token |
| `TWILIO_FROM` | no | Your Twilio number, `+18645551234` format |
| `SMS_TO` | no | Your phone, `+18649154071` format |

These live in Google, never in this repo. Safe with a public repository.

Skip the Twilio rows and everything still works — you just get the Sheet row and
both emails instead of a text.

### d. Test before deploying

In the script editor pick **`testBooking`** from the function dropdown and press
**Run**. Grant permissions when asked (it needs Sheets, Gmail, and Drive).

Check: a row in the Sheet, an email in your inbox, and a text if you configured
Twilio. Fix anything broken now — it is much easier here than through the site.

### e. Deploy it

**Deploy → New deployment → Web app.**

| Field | Value |
|---|---|
| Execute as | **Me** |
| Who has access | **Anyone** |

"Anyone" is required — visitors are not signed into Google. It does not expose
your Sheet; it only allows POSTs to this script.

Copy the **Web app URL**. It looks like
`https://script.google.com/macros/s/AKfy.../exec`.

### f. Give the URL to the site

In GitHub: **Settings → Secrets and variables → Actions → Variables → New
repository variable.**

| Name | Value |
|---|---|
| `NEXT_PUBLIC_FORM_ENDPOINT` | the Web app URL |

A **variable**, not a secret — it is compiled into the browser bundle and is
public either way. Your Twilio and Gmail credentials stay in Apps Script.

Then **Actions → Deploy to GitHub Pages → Run workflow**. Changing a variable
does not rebuild on its own.

> **Whenever you edit the script**, deploy again as **Manage deployments → Edit →
> New version**. Editing the code alone changes nothing that is live.

---

## 3. Point your domain

Your DNS is at **Squarespace** and your MX records route mail to Google
Workspace.

> ### Do not change your nameservers
>
> Your email records live in the Squarespace DNS panel. Switching nameservers
> deletes them and `drew@508filmzz.com` stops receiving mail — including your own
> booking notifications. Add records instead. This is the single most common way
> people break a launch.

In the Squarespace DNS panel add:

| Type | Host | Value |
|---|---|---|
| CNAME | `www` | `YOUR-USERNAME.github.io` |

For the bare `508filmzz.com` to work too, add four A records pointing at
GitHub's Pages IPs — the current addresses are listed in
[GitHub's apex domain docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
Verify them there rather than trusting a copy; they change occasionally.

Then in **Settings → Pages → Custom domain**, enter `www.508filmzz.com` and tick
**Enforce HTTPS** once the certificate is issued (usually under an hour).

`public/CNAME` already carries this domain, so the setting survives every deploy.

### Status: parked, on purpose

DNS is correct and finished — `www` CNAMEs to GitHub, the apex has the four A
records, and both resolve from every public resolver. But **GitHub never issued
the TLS certificate.** Over two hours, three provisioning restarts and a
redeploy, the API kept answering *"The certificate does not exist yet"*, so
`https://www.508filmzz.com` refused every connection while `http://` worked.

Rather than leave a live site that browsers flag as **Not Secure**, the custom
domain is currently **detached** and the site serves at
`https://drewreid508.github.io/508filmzz/`, which has a valid certificate. The
domain itself is untouched — only GitHub's Pages setting was cleared.

**To go back**, once the certificate can be issued: set
`NEXT_PUBLIC_BASE_PATH` = `/508filmzz`'s opposite (delete it), set
`NEXT_PUBLIC_SITE_URL` = `https://www.508filmzz.com`, and re-enter
`www.508filmzz.com` under Settings → Pages → Custom domain. `public/CNAME`
still carries the domain, so the deploy re-asserts it.

If it stalls again, verify the domain at the account level first —
[github.com/settings/pages](https://github.com/settings/pages) → **Add a
domain** → add the TXT record it gives you in Squarespace → **Verify**. That is
GitHub's own documented fix for a certificate that will not provision.

**Still outstanding:** the bare `508filmzz.com` has *no* A records, so it does
not resolve at all — someone typing it without the `www` gets nothing. Add the
four A records described above in Squarespace to fix it.

---

## Preview vs custom domain

The repo variable `NEXT_PUBLIC_BASE_PATH` decides where the build expects to be
served from. These two modes are mutually exclusive:

| Mode | `NEXT_PUBLIC_BASE_PATH` | `NEXT_PUBLIC_SITE_URL` | Serves at |
|---|---|---|---|
| **Subpath** *(current)* | `/508filmzz` | `https://drewreid508.github.io/508filmzz` | `drewreid508.github.io/508filmzz/` |
| Custom domain | *(delete it)* | `https://www.508filmzz.com` | `www.508filmzz.com` |

Clearing the Pages **Custom domain** setting is part of the switch. Removing
`CNAME` from the build artifact alone does *not* clear it — GitHub remembers the
domain, and `github.io/508filmzz` keeps 301-redirecting to it.

In preview mode the workflow removes `CNAME` from the build, because a CNAME
forces Pages to serve at the domain root and the two cannot coexist.

The two variables must always be changed **together**. `NEXT_PUBLIC_BASE_PATH`
governs where assets are loaded from; `NEXT_PUBLIC_SITE_URL` governs what the
canonical tags, sitemap, and `robots.txt` claim. Changing one without the other
produces a site that either loads unstyled or tells Google it lives somewhere it
does not — both fail silently. The workflow asserts both and fails the build
rather than publishing the mismatch.

Why this matters: with the wrong prefix every page still returns 200 while every
stylesheet and script 404s — the site loads as unstyled HTML. A status-code check
cannot see it, so the workflow asserts the prefix in `index.html` matches the
deploy target and fails the build if it does not.

---

## Going live in search

`NEXT_PUBLIC_SITE_INDEXABLE` is set to `true`, so the site is **public and
indexable**. Confirm with:

```bash
curl -s https://www.508filmzz.com/robots.txt
```

`Allow: /` means public. Setting the variable to anything else and re-running
the workflow puts `Disallow: /` back — it is read at build time, so a redeploy
is always required either way.

**Submit the sitemap** at [Google Search Console](https://search.google.com/search-console):
add `www.508filmzz.com` as a property, then submit `sitemap.xml`. Do this only
once HTTPS is working — every URL in the sitemap is an `https://` address, and
submitting while the certificate is still pending just feeds Google 24 fetch
errors.

---

## What changed from a server host

Pages cannot run server code, so:

- `src/app/api/contact/route.ts` and `src/lib/notify/*` were removed. The logic
  now lives in `apps-script/Code.gs`. The originals are in git history
  (`git show HEAD~1:src/app/api/contact/route.ts`) if you ever move to a host
  with a Node runtime.
- Form validation runs in the browser *and* again in the script. Never trust the
  client.
- Attachments are capped at **3 files, 5 MB each**, down from 5 × 8 MB. They
  travel base64-encoded inside the request, which inflates them by about a
  third, and Apps Script is stricter about payload size than a Node server.
- The confirmation page reads the visitor's name from the query string in the
  browser rather than on the server.

## Troubleshooting

**Every asset 404s / the site is unstyled.** `.nojekyll` is missing from `out/`.
Jekyll strips directories beginning with `_`, which kills `_next/`. The workflow
checks for this, so a passing build rules it out.

**The form says it isn't connected.** `NEXT_PUBLIC_FORM_ENDPOINT` is unset, or
you set it after the last build. Add the variable, then re-run the workflow.

**The form fails silently in the browser console with a CORS error.** The script
was deployed with "Who has access" set to anything other than **Anyone**, or you
edited the code without creating a **new version**.

**Bookings stop arriving.** Open the script → **Executions**. Every failed
channel is logged with its reason. As long as the Sheet, the studio email, or the
SMS succeeded, the lead was captured — the script only reports failure when all
three fail.
