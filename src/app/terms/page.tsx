import type { Metadata } from "next";

import { PageHero } from "@/components/ui/page-hero";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms covering use of the 508 Filmzz website and the basis on which enquiries and projects are handled.",
  alternates: { canonical: "/terms" },
};

/**
 * Website terms only — deliberately does NOT set project terms (deposits,
 * cancellation, usage licence, delivery windows). Those belong in a signed
 * project agreement, not a web page, because they vary per client and need a
 * signature to be worth anything.
 *
 * Not legal advice. Have a solicitor review before you rely on it.
 */
const UPDATED = "2 August 2026";

export default function TermsPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Legal"
        title="Terms"
        lead="The terms that cover this website and how enquiries are handled. Project terms are agreed separately, in writing."
      />

      <section className="shell pb-28 md:pb-40">
        <div className="max-w-2xl space-y-10 text-sm leading-relaxed text-mute">
          <p className="text-[0.7rem] tracking-[0.16em] text-faint uppercase">
            Last updated {UPDATED}
          </p>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Who these cover</h2>
            <p>
              This website is operated by {site.owner}, trading as {site.name},{" "}
              {site.address.city}, {site.address.stateShort}. Using the site means
              you accept these terms.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              Enquiries are not bookings
            </h2>
            <p>
              Submitting the booking form starts a conversation — it does not
              reserve a date, confirm a price, or create a contract. A booking
              exists once we have agreed scope, date, and fee in writing. Until
              then nothing is held.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              Quotes and project terms
            </h2>
            <p>
              Every project is quoted individually. Deposits, cancellation,
              rescheduling, delivery timelines, revision rounds, and the licence
              you receive for the finished work are all set out in the project
              agreement for that job. Nothing on this website overrides it.
            </p>
            <p className="mt-4">
              Turnaround figures quoted on this site (typically 3–7 business days)
              are typical, not guaranteed. Weather, location access, and scope
              changes move dates.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              Portfolio content and copyright
            </h2>
            <p>
              All photography, video, copy, and design on this site is owned by{" "}
              {site.name} or used with permission, and is protected by copyright.
              Do not reproduce, re-upload, or use it commercially without written
              permission. Vehicles, businesses, and logos shown belong to their
              respective owners and appear as examples of work produced for them.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              Acceptable use
            </h2>
            <p>
              Do not use the booking form to send spam, malware, or unlawful
              content, and do not attempt to disrupt the site or bypass its rate
              limits. Submissions that do are discarded.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">
              Availability and accuracy
            </h2>
            <p>
              The site is provided as is. I aim to keep it accurate and available
              but cannot guarantee uninterrupted access or that every detail is
              current. Where the law allows, I am not liable for loss arising from
              use of the site.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Governing law</h2>
            <p>
              These terms are governed by the laws of the State of South Carolina,
              United States.
            </p>
          </div>

          <div>
            <h2 className="display mb-4 text-2xl text-bone">Contact</h2>
            <p>
              Questions about these terms:{" "}
              <a href={`mailto:${site.email}`} className="link-inline">
                {site.email}
              </a>{" "}
              or{" "}
              <a href={`tel:${site.phoneE164}`} className="link-inline">
                {site.phone}
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
