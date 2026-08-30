import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";
import { discountedPrice, MINIMUM_MONTHS } from "@/lib/offer";
import type { MonthlyPackage } from "@/data/site";

/**
 * One monthly tier.
 *
 * ── Why this is a component and not markup on two pages ────────────────────
 * The tiers appear on the homepage and again on /pricing. Written twice they
 * would drift the first time a price moved, and the version a customer saw
 * would depend on which page they landed from. There is one card, so there is
 * one answer.
 *
 * ── The ten-second rule ────────────────────────────────────────────────────
 * A business owner should be able to tell Bronze from Silver without reading.
 * That is what the two big figures near the top are for — reels and shoots, the
 * two numbers that actually change — and what the Drone and Photo stills rows
 * are for below them: the same question answered in the same place on every
 * card, so the eye can run down the row instead of hunting through three lists
 * of different lengths. An included line is the accent colour; a missing one
 * still gets a line, because an omission reads as an oversight where a stated
 * "Not included" reads as a decision, and gives a reason to look at Silver.
 */
export function MonthlyCard({
  pkg,
  index,
  /** The homepage shows the tiers without the introductory-rate line. */
  showFirstMonth = true,
}: {
  pkg: MonthlyPackage;
  index: number;
  showFirstMonth?: boolean;
}) {
  const firstMonth = showFirstMonth ? discountedPrice(pkg.price) : null;
  const isCustom = pkg.price === null;

  return (
    <Reveal
      delay={(index % 4) * 0.06}
      className={cn(
        "relative flex flex-col justify-between bg-ink p-7 md:p-8",
        pkg.featured && "bg-ink-2"
      )}
    >
      {pkg.popular && (
        <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-accent" />
      )}

      <div>
        <div className="flex min-h-[1.75rem] items-start justify-between gap-3">
          <h3 className="display text-3xl leading-none md:text-[2rem]">{pkg.name}</h3>
          {pkg.popular && (
            <span className="shrink-0 border border-accent px-2.5 py-1 text-[0.56rem] font-medium tracking-[0.16em] text-accent uppercase">
              Most Popular
            </span>
          )}
        </div>

        {/* The figure. A custom tier has none, and says so at the same size. */}
        {isCustom ? (
          <p className="display mt-5 text-[2rem] leading-none text-bone md:text-4xl">
            Custom quote
          </p>
        ) : (
          <p className="display mt-5 flex items-baseline gap-1.5 text-5xl leading-none text-bone md:text-[3.4rem]">
            {pkg.price}
            <span className="text-base tracking-normal text-faint md:text-lg">
              / month
            </span>
          </p>
        )}

        {/*
          The introductory rate, derived from the figure above rather than
          written down. A discounted number stored separately goes stale the
          first time a package price moves.
        */}
        {firstMonth && (
          <p className="mt-2.5 text-[0.72rem] tracking-[0.06em] text-accent">
            {firstMonth} first month for new clients
          </p>
        )}

        {/* The two numbers that actually separate the tiers. */}
        {pkg.reels && pkg.shoots && (
          <div className="mt-6 grid grid-cols-2 gap-px border border-line bg-line">
            <Stat value={pkg.reels} label="Reels / month" />
            <Stat value={pkg.shoots} label="Shoots / month" />
          </div>
        )}

        {pkg.bestFor && (
          <p className="mt-5 text-[0.8rem] leading-relaxed text-mute">{pkg.bestFor}</p>
        )}

        <ul className="mt-6 flex flex-col gap-2.5 border-t border-line pt-6">
          {pkg.includes.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[0.82rem] text-mute">
              <Check
                size={12}
                strokeWidth={2}
                aria-hidden="true"
                className="mt-1 shrink-0 text-accent"
              />
              {item}
            </li>
          ))}
        </ul>

        {/*
          Drone and photo stills, answered in the same place on every priced
          tier. Undefined on Custom, where the honest answer is "depends on the
          quote" and a hard yes or no would be a promise nobody has made yet.
        */}
        {(pkg.drone !== undefined || pkg.stills !== undefined) && (
          <dl className="mt-6 flex flex-col gap-px border border-line bg-line">
            {pkg.drone !== undefined && (
              <UpgradeRow label="Drone" included={pkg.drone} />
            )}
            {pkg.stills !== undefined && (
              <UpgradeRow label="Photo stills" included={pkg.stills} />
            )}
          </dl>
        )}
      </div>

      <div className="mt-7">
        {!isCustom && (
          <p className="mb-4 text-[0.7rem] tracking-[0.1em] text-faint uppercase">
            {MINIMUM_MONTHS}-month minimum
          </p>
        )}
        <Magnetic
          href="/book"
          variant={pkg.featured ? "solid" : "outline"}
          wrapperClassName="w-full"
          className="w-full"
        >
          {isCustom ? "Get a Custom Quote" : "Get Started"}
        </Magnetic>
      </div>
    </Reveal>
  );
}

/** One of the two figures that actually separate the tiers. */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ink px-4 py-4">
      <p className="display text-3xl leading-none text-bone md:text-4xl">{value}</p>
      <p className="mt-2 text-[0.56rem] tracking-[0.18em] text-faint uppercase">
        {label}
      </p>
    </div>
  );
}

function UpgradeRow({ label, included }: { label: string; included: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-ink px-4 py-3.5">
      <dt className="text-[0.58rem] tracking-[0.2em] text-faint uppercase">{label}</dt>
      <dd
        className={cn(
          "flex items-center gap-2 text-[0.7rem] font-medium tracking-[0.14em] uppercase",
          included ? "text-accent" : "text-faint"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-1.5 w-1.5 shrink-0",
            included ? "bg-accent" : "border border-line-strong"
          )}
        />
        {included ? "Included" : "Not included"}
      </dd>
    </div>
  );
}
