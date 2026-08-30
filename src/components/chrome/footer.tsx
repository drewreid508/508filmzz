import Link from "next/link";
import { FaInstagram, FaTiktok } from "react-icons/fa6";
import { MapPin, Phone, Mail } from "lucide-react";

import { nav, site, capabilities } from "@/data/site";
import { Logo } from "./logo";
import { Magnetic } from "@/components/ui/magnetic";

/**
 * Kept out of `nav` so these stay in the footer's legal strip rather than
 * appearing in the header and mobile menu.
 */
const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookies", href: "/cookies" },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-ink">
      <div className="shell">
        {/* Closing CTA */}
        <div className="grid gap-10 border-b border-line py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow mb-6">Next project</p>
            <h2 className="display text-[13vw] leading-[0.85] md:text-[6.5vw]">
              Let&apos;s build
              <br />
              something
              <span className="text-accent">.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-5 md:items-end">
            <p className="body-lg max-w-sm md:text-right">
              Tell me the vehicle, the business, or the season. I&apos;ll tell you
              exactly what it takes to make it look like this.
            </p>
            <Magnetic href="/contact" variant="solid">
              Book a Shoot
            </Magnetic>
          </div>
        </div>

        {/* Directory */}
        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="text-2xl" aria-label={`${site.name} — home`}>
              <Logo />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-mute">
              {site.positioning}
            </p>
            <div className="mt-7 flex gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${site.name} on Instagram`}
                className="flex h-11 w-11 items-center justify-center border border-line transition-colors duration-500 hover:border-accent hover:text-accent"
              >
                <FaInstagram aria-hidden="true" />
              </a>
              <a
                href={site.tiktok}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${site.name} on TikTok`}
                className="flex h-11 w-11 items-center justify-center border border-line transition-colors duration-500 hover:border-accent hover:text-accent"
              >
                <FaTiktok aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow mb-5">Quick Links</p>
            <ul className="flex flex-col">
              {nav.map((item) => (
                <li key={item.href}>
                  {/*
                    inline-flex + min-height, not padding on the text.
                    ────────────────────────────────────────────────────────
                    A 17px-tall link is a 17px-tall tap target, and on a phone
                    that is a miss waiting to happen. This gives each one a
                    44px strike area without moving anything visually — the
                    box grows, the text does not.
                  */}
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-mute transition-colors duration-400 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="eyebrow mb-5">Services</p>
            <ul className="flex flex-col gap-3">
              {capabilities.map((c) => (
                <li key={c} className="text-sm text-mute">
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-5">Contact</p>
            <ul className="flex flex-col gap-1">
              <li>
                <a
                  href={`tel:${site.phoneE164}`}
                  className="flex min-h-[44px] items-center gap-3 text-sm text-mute transition-colors duration-400 hover:text-accent"
                >
                  <Phone size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="flex min-h-[44px] items-center gap-3 text-sm break-all text-mute transition-colors duration-400 hover:text-accent"
                >
                  <Mail size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
                  {site.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-mute">
                <MapPin size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
                {site.location}
              </li>
            </ul>
            <p className="mt-5 text-[0.78rem] leading-relaxed text-faint">{site.travel}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-8 pb-24 text-[0.66rem] tracking-[0.18em] text-faint uppercase md:flex-row md:items-center md:justify-between md:pb-8">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>

          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex min-h-[44px] items-center transition-colors duration-400 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p>{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
