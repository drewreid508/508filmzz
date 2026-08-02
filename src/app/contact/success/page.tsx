import type { Metadata } from "next";
import Link from "next/link";
import { Check, Phone, Mail } from "lucide-react";

import { site } from "@/data/site";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { pad } from "@/lib/utils";
import { SuccessGreeting } from "./greeting";

export const metadata: Metadata = {
  title: "Request Received",
  description: "Your 508 Filmzz booking request has been received.",
  robots: { index: false, follow: true },
};

const NEXT_STEPS = [
  {
    title: "I read it personally",
    body: "Your request goes straight to my phone — there's no inbox it sits in waiting for someone else to triage.",
  },
  {
    title: "You get a straight answer",
    body: "Availability for your date, what the project takes, and a custom quote based on your goals and deliverables.",
  },
  {
    title: "We lock the plan",
    body: "Story, shot list, and deliverables agreed before the shoot — so nothing gets decided on the day.",
  },
];

export default function BookingSuccessPage() {

  return (
    <section className="shell flex min-h-[86svh] flex-col justify-center py-36 md:py-44">
      <Reveal>
        <span className="mb-9 flex h-16 w-16 items-center justify-center rounded-full border border-accent text-accent">
          <Check size={26} strokeWidth={1.5} aria-hidden="true" />
        </span>
      </Reveal>

      <Reveal delay={0.06}>
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="text-accent">01</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          Request received
        </p>
      </Reveal>

      <SuccessGreeting />

      <Reveal delay={0.18}>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href={`tel:${site.phoneE164}`}
            className="inline-flex items-center gap-3 border border-line-strong px-7 py-4 text-[0.7rem] font-medium tracking-[0.2em] uppercase transition-colors duration-500 hover:border-accent hover:text-accent"
          >
            <Phone size={14} strokeWidth={1.5} aria-hidden="true" />
            {site.phone}
          </a>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-3 border border-line-strong px-7 py-4 text-[0.7rem] font-medium tracking-[0.2em] uppercase transition-colors duration-500 hover:border-accent hover:text-accent"
          >
            <Mail size={14} strokeWidth={1.5} aria-hidden="true" />
            Email
          </a>
        </div>
      </Reveal>

      <ol className="mt-20 grid gap-px border-t border-l border-line bg-line md:grid-cols-3">
        {NEXT_STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.08} className="bg-ink p-8 md:p-10">
            <span className="eyebrow mb-6 block">{pad(i + 1)}</span>
            <h2 className="display text-2xl md:text-3xl">{step.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{step.body}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.1}>
        <div className="mt-16 flex flex-wrap items-center gap-4">
          <Magnetic href="/portfolio" variant="solid">
            View Portfolio
          </Magnetic>
          <Link
            href="/"
            className="text-[0.7rem] tracking-[0.2em] text-mute uppercase transition-colors duration-400 hover:text-bone"
          >
            Back home
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
