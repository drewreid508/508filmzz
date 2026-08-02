import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Frame } from "@/components/ui/frame";
import { Reveal, TextReveal } from "@/components/motion/reveal";
import { Parallax } from "@/components/motion/parallax";
import { Counter } from "@/components/ui/counter";
import { Magnetic } from "@/components/ui/magnetic";
import { Services } from "@/components/home/services";
import { SectionHeader } from "@/components/ui/section";
import { stats, process, site } from "@/data/site";
import { pad } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "508 Filmzz is a one-man media company. Every project is planned, filmed, edited, and delivered by one director — no outsourcing, no shortcuts.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="The Studio"
        title="One Man. Every Step."
        lead="508 Filmzz is built on one vision. Every shoot is personally planned, filmed, edited, and delivered by me. No outsourcing. No shortcuts. Just premium storytelling and attention to detail."
      />

      {/* Portrait / statement */}
      <section className="shell pb-24 md:pb-36">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-7">
            <Parallax distance={60}>
              <Frame
                id="img_5624"
                alt="Filming a build inside a working fabrication shop"
                ratio={4 / 3}
                sizes="(max-width: 768px) 92vw, 58vw"
              />
            </Parallax>
          </Reveal>

          <div className="flex flex-col justify-center gap-7 md:col-span-4 md:col-start-9">
            <Reveal>
              <p className="eyebrow">Behind the rig</p>
            </Reveal>
            <h2 className="display text-4xl leading-[0.9] md:text-5xl">
              <TextReveal text="The camera is the easy part." />
            </h2>
            <Reveal delay={0.1}>
              <p className="text-sm leading-relaxed text-mute md:text-base">
                Anyone can buy a camera. What clients actually pay for is judgement —
                knowing which shot earns its place, which take to cut on, and what the
                grade should feel like before the shoot even starts.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-sm leading-relaxed text-mute md:text-base">
                Because one person carries the project from brief to delivery, nothing
                gets lost in a handoff. The plan, the frame, and the final cut all come
                from the same head.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="shell pb-24 md:pb-36" aria-label="At a glance">
        <div className="grid grid-cols-2 gap-px border-t border-l border-line bg-line md:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="bg-ink p-7 md:p-10">
              <p className="eyebrow mb-5">{pad(i + 1)}</p>
              <p className="display text-6xl leading-none md:text-7xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 text-[0.7rem] tracking-[0.16em] text-faint uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="shell pb-24 md:pb-36" aria-labelledby="about-process">
        <h2 id="about-process" className="sr-only">
          Process
        </h2>
        <SectionHeader index="02" eyebrow="How It Works" title="The Process" />

        <ol className="mt-14 grid gap-px border-t border-l border-line bg-line md:grid-cols-4">
          {process.map((item, i) => (
            <li key={item.step} className="bg-ink p-8 md:p-10">
              <span className="display mb-7 block text-5xl text-accent md:text-6xl">
                {pad(i + 1)}
              </span>
              <h3 className="display text-2xl md:text-3xl">{item.step}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Services */}
      <section className="pb-24 md:pb-36" aria-labelledby="about-services">
        <div className="shell mb-14">
          <h2 id="about-services" className="sr-only">
            Services
          </h2>
          <SectionHeader
            index="03"
            eyebrow="What I Do"
            title="Services"
            lead="One operator, one consistent look across everything you publish."
          />
        </div>
        <Services />
      </section>

      {/* Contact CTA */}
      <section className="shell pb-28 md:pb-40">
        <div className="flex flex-col items-start justify-between gap-8 border-y border-line py-16 md:flex-row md:items-center md:py-20">
          <div>
            <p className="eyebrow mb-4">Work with 508</p>
            <p className="display text-5xl leading-none md:text-6xl">
              Tell me the vision<span className="text-accent">.</span>
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-sm text-mute transition-colors hover:text-accent"
            >
              {site.email}
            </a>
          </div>
          <Magnetic href="/contact" variant="solid">
            Book a Shoot
          </Magnetic>
        </div>
      </section>
    </>
  );
}
