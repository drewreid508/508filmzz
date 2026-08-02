import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How 508 Filmzz collects, uses, and protects the information you submit through the booking form.",
  alternates: { canonical: "/privacy" },
};

/**
 * Written against what the code actually does — the Zod schema in
 * src/lib/inquiry.ts, the rate limiter in the contact route, and the four
 * notification channels in src/lib/notify. If you change what the form
 * collects or where it sends, update this page in the same commit.
 *
 * Not legal advice. Have a solicitor review before you rely on it.
 */
const UPDATED = "2 August 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Legal"
        title="Privacy"
        lead="What gets collected when you contact 508 Filmzz, why, and who it reaches. In plain language."
      />

      <section className="shell pb-28 md:pb-40">
        <div className="prose-legal max-w-2xl space-y-10 text-sm leading-relaxed text-mute">
          <p className="text-[0.7rem] tracking-[0.16em] text-faint uppercase">
            Last updated {UPDATED}
          </p>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Who I am</h2>
            <p>
              508 Filmzz is a video production and commercial photography
              business operated by {site.owner}, based in {site.address.city},{" "}
              {site.address.stateShort}, serving {site.primaryMarket} and Upstate
              South Carolina. For any privacy question, email{" "}
              <a href={`mailto:${site.email}`} className="link-inline">
                {site.email}
              </a>{" "}
              or call{" "}
              <a href={`tel:${site.phoneE164}`} className="link-inline">
                {site.phone}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              What the booking form collects
            </h2>
            <p>When you submit an enquiry, these fields are sent to me:</p>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              <li>Your name</li>
              <li>Business name (optional)</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Project type and budget range</li>
              <li>Preferred shoot date and location (both optional)</li>
              <li>Your message</li>
              <li>Any reference files you choose to attach</li>
            </ul>
            <p className="mt-4">
              Nothing else is requested and nothing is inferred. There is no
              account to create and no password to set.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              What the server records automatically
            </h2>
            <p>
              Your IP address is held in memory briefly to rate-limit the form
              (five submissions per ten minutes) so it cannot be used to spam. It
              is not written to a database, not stored alongside your enquiry,
              and is discarded when the window expires.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Where it goes</h2>
            <p>
              Your enquiry is sent to me by email and text message, and may be
              appended to a private spreadsheet I use to track bookings. It is
              not sold, rented, or shared with advertisers, and you will not be
              added to a mailing list.
            </p>
            <p className="mt-4">
              Delivery relies on third-party providers — an email service, an SMS
              provider, and Google Sheets — who process the data solely to pass it
              to me. This site is hosted on Vercel, which processes standard
              server request logs.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">How long it is kept</h2>
            <p>
              Enquiries are kept while we are in contact and for as long as I need
              them for business records. Ask me to delete yours and I will, unless
              I am required to keep it for tax or accounting purposes.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Analytics</h2>
            <p>
              This site may use privacy-conscious analytics to understand which
              pages people visit. Where analytics are enabled they are configured
              to anonymise IP addresses. See the{" "}
              <a href="/cookies" className="link-inline">
                Cookie Policy
              </a>{" "}
              for detail and how to opt out.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Your footage</h2>
            <p>
              Photographs and video produced for you are covered by our project
              agreement, not this policy. I may show completed work in my
              portfolio and on social media unless we agree otherwise in writing
              before the shoot — just tell me and it stays private.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Your rights</h2>
            <p>
              You can ask what I hold about you, ask for a correction, or ask me
              to delete it. Email{" "}
              <a href={`mailto:${site.email}`} className="link-inline">
                {site.email}
              </a>{" "}
              and I will respond within 30 days. No form, no process.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Children</h2>
            <p>
              This site is not directed at children under 13 and I do not
              knowingly collect their information.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Changes</h2>
            <p>
              If this policy changes, the date at the top changes with it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
