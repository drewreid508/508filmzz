import type { Metadata } from "next";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { BookingForm } from "@/components/contact/booking-form";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Start Your Project",
  description:
    "Start a project with 508 Filmzz — commercial advertising, social content, motion graphics, drone production and monthly content for businesses across Greenville and Upstate South Carolina.",
  alternates: { canonical: "/book" },
};

/**
 * The booking page, at /book.
 *
 * ── Why this exists next to /contact ───────────────────────────────────────
 * They answer different questions. /contact is "how do I reach you" — phone,
 * email, socials, service area. This is "I want to hire you", and it opens on
 * the form with nothing above it to scroll past.
 *
 * That matters most on the journey this site was built for: a business owner
 * scans a card, taps Start Your Project, and should land on the form itself rather
 * than on a page about how to make contact.
 *
 * The form is the same component either page renders — one form, one
 * validation path, one submit. Nothing here is a second copy to keep in sync.
 */

const REASSURANCE = [
  {
    icon: Clock,
    title: "A reply, not an auto-responder",
    body: "Every enquiry comes to me directly — not a form queue. You will hear back about availability and a real number, usually the same day.",
  },
  {
    icon: MapPin,
    title: "Greenville and the Upstate",
    body: "Based in Piedmont, working across the Upstate as standard. Projects further out are welcome — travel is simply built into the quote.",
  },
  {
    icon: Phone,
    title: "Rather just talk?",
    body: "Call or text. For anything complicated a two-minute conversation beats a form every time.",
  },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Start a Project"
        title="Start Your Project"
        lead="Tell me about your business and what you want the content to do. The more you share — what you do, who you are trying to reach, where it needs to run — the more useful the quote I send back. No obligation, and nothing is charged through this form."
      />

      {/* ── What happens next ─────────────────────────────────────────────── */}
      <section className="shell pb-16 md:pb-20" aria-label="What to expect">
        <div className="grid gap-px border-t border-l border-line bg-line md:grid-cols-3">
          {REASSURANCE.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={i * 0.06} className="bg-ink p-7 md:p-8">
                <Icon
                  size={17}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className="mb-5 text-accent"
                />
                <h2 className="display text-2xl leading-none md:text-[1.6rem]">
                  {item.title}
                </h2>
                <p className="mt-3.5 text-[0.84rem] leading-relaxed text-mute">
                  {item.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── The form ──────────────────────────────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="form-heading">
        <h2 id="form-heading" className="sr-only">
          Booking request form
        </h2>
        <BookingForm />
      </section>

      {/* ── Direct lines ──────────────────────────────────────────────────── */}
      <section className="shell pb-28 md:pb-40">
        <div className="flex flex-col gap-6 border-y border-line py-12 sm:flex-row sm:items-center sm:justify-between md:py-14">
          <p className="eyebrow">Or reach me directly</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-9">
            <a
              href={`tel:${site.phoneE164}`}
              className="flex min-h-[44px] items-center gap-3 text-sm text-bone transition-colors duration-400 hover:text-accent"
            >
              <Phone size={15} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="flex min-h-[44px] items-center gap-3 text-sm break-all text-bone transition-colors duration-400 hover:text-accent"
            >
              <Mail size={15} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
              {site.email}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
