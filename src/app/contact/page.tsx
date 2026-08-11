import type { Metadata } from "next";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { Phone, Mail, MapPin, Plane, Check } from "lucide-react";

import { PageHero } from "@/components/ui/page-hero";
import { BookingForm } from "@/components/contact/booking-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section";
import { Magnetic } from "@/components/ui/magnetic";
import { site, advantages, faqs } from "@/data/site";
import { PROJECT_TYPES } from "@/lib/inquiry";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book a Shoot",
  description:
    "Book cinematic automotive, commercial, drone, and social media production with 508 Filmzz — serving Greenville, Piedmont, and Upstate South Carolina.",
  alternates: { canonical: "/contact" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Contact"
        title="Ready to create something different?"
        lead="Whether you're launching a business, showcasing a vehicle, or creating content for your brand, I'd love to hear about your project. Fill out the form below or reach out directly, and I'll get back to you as soon as possible."
      />

      {/* ── Contact details ───────────────────────────────────────────────── */}
      <section className="shell pb-20 md:pb-28" aria-label="Contact information">
        <div className="grid gap-px border-t border-l border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          <Reveal className="bg-ink p-8 md:p-9">
            <Phone size={17} strokeWidth={1.5} aria-hidden="true" className="mb-6 text-accent" />
            <p className="eyebrow mb-2">Phone</p>
            <a
              href={`tel:${site.phoneE164}`}
              className="display text-3xl transition-colors duration-400 hover:text-accent"
            >
              {site.phone}
            </a>
          </Reveal>

          <Reveal delay={0.06} className="bg-ink p-8 md:p-9">
            <Mail size={17} strokeWidth={1.5} aria-hidden="true" className="mb-6 text-accent" />
            <p className="eyebrow mb-2">Email</p>
            <a
              href={`mailto:${site.email}`}
              className="text-lg break-all transition-colors duration-400 hover:text-accent"
            >
              {site.email}
            </a>
          </Reveal>

          <Reveal delay={0.12} className="bg-ink p-8 md:p-9">
            <MapPin size={17} strokeWidth={1.5} aria-hidden="true" className="mb-6 text-accent" />
            <p className="eyebrow mb-2">Location</p>
            <p className="text-lg">{site.location}</p>
          </Reveal>

          <Reveal delay={0.18} className="bg-ink p-8 md:p-9">
            <FaInstagram aria-hidden="true" className="mb-6 text-accent" size={17} />
            <p className="eyebrow mb-2">Instagram</p>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="text-lg transition-colors duration-400 hover:text-accent"
            >
              {site.instagramHandle}
            </a>
          </Reveal>

          <Reveal delay={0.24} className="bg-ink p-8 md:p-9">
            <FaTiktok aria-hidden="true" className="mb-6 text-accent" size={17} />
            <p className="eyebrow mb-2">TikTok</p>
            <a
              href={site.tiktok}
              target="_blank"
              rel="noreferrer noopener"
              className="text-lg transition-colors duration-400 hover:text-accent"
            >
              {site.tiktokHandle}
            </a>
          </Reveal>

          <Reveal delay={0.3} className="bg-ink p-8 md:p-9">
            <Plane size={17} strokeWidth={1.5} aria-hidden="true" className="mb-6 text-accent" />
            <p className="eyebrow mb-2">Travel</p>
            <p className="text-sm leading-relaxed text-mute">{site.travel}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Booking form ──────────────────────────────────────────────────── */}
      <section
        id="book"
        className="shell scroll-mt-28 pb-24 md:pb-36"
        aria-labelledby="book-heading"
      >
        <SectionHeader
          id="book-heading"
          index="02"
          eyebrow="Book a Shoot"
          title="Tell me about your project."
        />

        <div className="mt-14 grid gap-16 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-8">
            <BookingForm />
          </div>

          <aside className="md:col-span-4">
            <Reveal>
              <div className="border-t border-line pt-7">
                <p className="eyebrow mb-5">Project Types</p>
                <ul className="flex flex-col gap-3">
                  {PROJECT_TYPES.map((type) => (
                    <li key={type} className="flex items-center gap-3 text-sm text-mute">
                      <Check
                        size={13}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="shrink-0 text-accent"
                      />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 border-t border-line pt-7">
                <p className="eyebrow mb-4">Prefer to talk?</p>
                <a
                  href={`tel:${site.phoneE164}`}
                  className="display text-3xl transition-colors duration-400 hover:text-accent"
                >
                  {site.phone}
                </a>
                <p className="mt-3 text-sm leading-relaxed text-mute">
                  Call or text — it&apos;s the fastest way to reach me.
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ── Why work with 508 ─────────────────────────────────────────────── */}
      <section className="shell pb-24 md:pb-36" aria-labelledby="why-heading">
        <SectionHeader
          id="why-heading" index="03" eyebrow="The Difference" title="Why Work With 508?" />

        <div className="mt-14 grid gap-px border-t border-l border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {advantages.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.07} className="bg-ink p-8 md:p-10">
              <p className="eyebrow mb-6">{pad(i + 1)}</p>
              <h3 className="display text-2xl leading-tight md:text-[1.75rem]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="shell pb-24 md:pb-36" aria-labelledby="faq-heading">
        <SectionHeader
          id="faq-heading" index="04" eyebrow="Good to Know" title="FAQ" />

        <dl className="mt-14 border-t border-line">
          {faqs.map((item, i) => (
            <Reveal
              key={item.q}
              delay={i * 0.05}
              className="grid gap-4 border-b border-line py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <dt className="display flex items-start gap-4 text-2xl leading-tight md:col-span-5 md:text-[1.9rem]">
                <span className="eyebrow mt-2 shrink-0">{pad(i + 1)}</span>
                {item.q}
              </dt>
              <dd className="body-lg md:col-span-6 md:col-start-7">{item.a}</dd>
            </Reveal>
          ))}
        </dl>
      </section>


      {/* ── Social ────────────────────────────────────────────────────────── */}
      {/*
        EDIT ME: the handles and URLs live in src/data/site.ts under
        `instagram`, `tiktok`, `instagramHandle`, and `tiktokHandle`.
      */}
      <section className="shell pb-24 md:pb-32" aria-labelledby="social-heading">
        <div className="border-t border-line pt-14">
          <h2 id="social-heading" className="display text-4xl md:text-5xl">
            Follow the work
          </h2>
          <p className="body-lg mt-4 max-w-lg">
            New builds, behind-the-scenes, and finished films go up first on
            social.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-4 border border-line-strong px-7 py-5 transition-colors duration-500 hover:border-accent"
            >
              <FaInstagram
                aria-hidden="true"
                size={20}
                className="text-mute transition-colors duration-500 group-hover:text-accent"
              />
              <span className="flex flex-col">
                <span className="text-[0.6rem] tracking-[0.22em] text-faint uppercase">
                  Instagram
                </span>
                <span className="text-sm">{site.instagramHandle}</span>
              </span>
            </a>

            <a
              href={site.tiktok}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-4 border border-line-strong px-7 py-5 transition-colors duration-500 hover:border-accent"
            >
              <FaTiktok
                aria-hidden="true"
                size={20}
                className="text-mute transition-colors duration-500 group-hover:text-accent"
              />
              <span className="flex flex-col">
                <span className="text-[0.6rem] tracking-[0.22em] text-faint uppercase">
                  TikTok
                </span>
                <span className="text-sm">{site.tiktokHandle}</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="shell pb-28 md:pb-40">
        <div className="flex flex-col items-start justify-between gap-10 border-y border-line py-16 md:flex-row md:items-center md:py-20">
          <div>
            <p className="eyebrow mb-5">Ready when you are</p>
            <p className="display text-[10vw] leading-[0.88] sm:text-[7vw] md:text-[4.4vw]">
              Ready to make your
              <br />
              brand stand out?
            </p>
            <p className="body-lg mt-6 max-w-md">
              Premium cinematic content starts with one conversation.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Magnetic href="#book" variant="solid">
              Book a Shoot
            </Magnetic>
            <Magnetic href="/pricing" variant="outline">
              Request a Quote
            </Magnetic>
            <a
              href={`tel:${site.phoneE164}`}
              className="text-center text-[0.7rem] tracking-[0.2em] text-mute uppercase transition-colors duration-400 hover:text-accent"
            >
              or call {site.phone}
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
