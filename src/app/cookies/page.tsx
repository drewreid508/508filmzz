import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Which cookies and similar technologies 508 Filmzz uses, what they do, and how to turn them off.",
  alternates: { canonical: "/cookies" },
};

/**
 * Accurate to the current build: the site itself sets no cookies. The only
 * client-side storage is a sessionStorage key that stops the intro animation
 * replaying, and any analytics Drew later enables via env vars.
 *
 * If a cookie-setting feature is ever added, this page must change with it.
 *
 * Not legal advice. Have a solicitor review before you rely on it.
 */
const UPDATED = "2 August 2026";

export default function CookiesPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Legal"
        title="Cookies"
        lead="Short version: this site sets no cookies of its own. Here is exactly what it does store, and how to stop it."
      />

      <section className="shell pb-28 md:pb-40">
        <div className="max-w-2xl space-y-10 text-sm leading-relaxed text-mute">
          <p className="text-[0.7rem] tracking-[0.16em] text-faint uppercase">
            Last updated {UPDATED}
          </p>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              Cookies this site sets
            </h2>
            <p>
              None. There is no login, no basket, no personalisation, and no
              advertising pixel running by default — so there is nothing for a
              first-party cookie to do.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              What is stored instead
            </h2>
            <p>
              One entry in your browser&apos;s <code>sessionStorage</code>, which
              records that you have already seen the opening animation so it does
              not replay on every page. It holds no personal information, is not
              sent to any server, and is erased the moment you close the tab.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Analytics</h2>
            <p>
              Analytics are optional on this site and are only active if
              configured. When enabled, one or more of the following may set
              cookies:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-bone">Google Analytics 4</strong> —
                aggregate page views and traffic sources, with IP anonymisation
                turned on.
              </li>
              <li>
                <strong className="text-bone">Google Tag Manager</strong> — loads
                the tags above; sets no cookies by itself.
              </li>
              <li>
                <strong className="text-bone">Microsoft Clarity</strong> —
                anonymised heatmaps and session replays showing how far people
                scroll. Keystrokes in form fields are masked.
              </li>
              <li>
                <strong className="text-bone">Meta Pixel</strong> — only if
                Facebook or Instagram advertising is running, to measure results.
              </li>
            </ul>
            <p className="mt-4">
              None of these are needed for the site to work, and none are used to
              build a profile of you for sale.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              Turning them off
            </h2>
            <p>
              Every browser lets you block or delete cookies in its privacy
              settings, and most offer a &ldquo;do not track&rdquo; signal.
              Blocking cookies will not break anything here — no feature on this
              site depends on one. Browser-level tracking protection and most ad
              blockers stop the analytics above outright.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Embedded media</h2>
            <p>
              Films play from this site&apos;s own server, not from an embedded
              YouTube or Vimeo player, so watching one sets nothing. Following a
              link to Instagram or TikTok takes you to their platform, where their
              own cookie policies apply.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Questions</h2>
            <p>
              Email{" "}
              <a href={`mailto:${site.email}`} className="link-inline">
                {site.email}
              </a>{" "}
              or call{" "}
              <a href={`tel:${site.phoneE164}`} className="link-inline">
                {site.phone}
              </a>
              . See also the{" "}
              <a href="/privacy" className="link-inline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
