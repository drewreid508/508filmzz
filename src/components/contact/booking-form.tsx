"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { PROJECT_TYPES, BUDGETS } from "@/lib/inquiry";
import { monthlyPackages, packages } from "@/data/site";
import {
  DISCOUNT_LABEL,
  MINIMUM_MONTHS,
  PROMO_CODE,
  isPromoCode,
  discountBreakdown,
} from "@/lib/offer";
import { submitLead } from "@/lib/submit-lead";
import { site } from "@/data/site";
import { cn, pad } from "@/lib/utils";

type Status = "idle" | "sending" | "error";

const fieldBase =
  "w-full border-b border-line bg-transparent py-4 text-[0.95rem] text-bone placeholder:text-faint transition-colors duration-400 focus:border-accent focus:outline-none";

function Label({
  index,
  htmlFor,
  children,
}: {
  index: number;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="eyebrow mb-1 flex items-center gap-2.5">
      <span className="text-accent">{pad(index)}</span>
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 text-[0.72rem] tracking-wide text-accent">
      {message}
    </p>
  );
}

export function BookingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  /*
    Monthly bookings need terms on screen before the form is sent — the price,
    the introductory month, and the minimum. Held in state rather than read off
    the DOM so the panel and the value posted with the request cannot disagree.
  */
  const [isMonthly, setIsMonthly] = useState(false);
  const [monthlyId, setMonthlyId] = useState("");
  const chosen = monthlyPackages.find((p) => p.id === monthlyId) ?? null;

  /* One-time bookings need a package too, or there is no price to discount. */
  const [oneOffId, setOneOffId] = useState("");
  const oneOff = packages.find((p) => p.id === oneOffId) ?? null;

  /* The package the promo actually applies to, whichever branch is in use. */
  const selected = isMonthly ? chosen : oneOff;
  const breakdown = discountBreakdown(selected?.price ?? null);

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  function applyPromo() {
    if (isPromoCode(promoInput)) {
      setPromoApplied(true);
      setPromoError(null);
    } else {
      setPromoApplied(false);
      setPromoError("That code isn't recognised.");
    }
  }
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setFormError(null);

    const data = new FormData(event.currentTarget);

    try {
      const result = await submitLead(data);

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        if (result.error) setFormError(result.error);
        setStatus("error");
        // Move focus to the first problem so keyboard users aren't stranded.
        const firstKey = result.fieldErrors && Object.keys(result.fieldErrors)[0];
        if (firstKey) document.getElementById(firstKey)?.focus();
        return;
      }

      const name = String(data.get("name") ?? "").trim();
      const params = new URLSearchParams();
      if (name) params.set("name", name.split(" ")[0]);
      if (result.confirmationEmailed) params.set("email", "1");
      router.push(`/contact/success?${params.toString()}`);
    } catch {
      setFormError(
        `Couldn't reach the server. Please call ${site.phone} or email ${site.email} directly.`
      );
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-12">
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="grid gap-8 md:grid-cols-2">
        <legend className="sr-only">Your details</legend>

        <div className="flex flex-col">
          <Label index={1} htmlFor="name">
            Name *
          </Label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={fieldBase}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="flex flex-col">
          <Label index={2} htmlFor="businessName">
            Business Name
          </Label>
          <input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            placeholder="Optional"
            className={fieldBase}
          />
        </div>

        <div className="flex flex-col">
          <Label index={3} htmlFor="email">
            Email Address *
          </Label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@business.com"
            className={fieldBase}
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError message={errors.email} />
        </div>

        <div className="flex flex-col">
          <Label index={4} htmlFor="phone">
            Phone Number *
          </Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(000) 000-0000"
            className={fieldBase}
            aria-invalid={Boolean(errors.phone)}
          />
          <FieldError message={errors.phone} />
        </div>
      </fieldset>

      <fieldset className="grid gap-8 md:grid-cols-2">
        <legend className="sr-only">Project details</legend>

        <div className="flex flex-col">
          <Label index={5} htmlFor="projectType">
            Project Type *
          </Label>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            onChange={(e) => {
              const monthly = e.target.value === "Monthly Content";
              setIsMonthly(monthly);
              if (!monthly) setMonthlyId("");
            }}
            className={cn(fieldBase, "cursor-pointer")}
            aria-invalid={Boolean(errors.projectType)}
          >
            <option value="" disabled>
              Select a project type
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-ink-2">
                {t}
              </option>
            ))}
          </select>
          <FieldError message={errors.projectType} />

          {/*
            A package for one-time work, so the promo code has a figure to work
            from. Optional — plenty of enquiries do not map to a tier, and a
            required selector would turn a booking into a configurator.
          */}
          {!isMonthly && (
            <div className="mt-7">
              {/* Unnumbered: it is a refinement of the field above, not a
                  step of its own, and a number here would renumber the form. */}
              <label
                htmlFor="oneOffPackage"
                className="eyebrow mb-1 block"
              >
                Package (optional)
              </label>
              <select
                id="oneOffPackage"
                name="oneOffPackage"
                value={oneOffId}
                onChange={(e) => setOneOffId(e.target.value)}
                className={cn(fieldBase, "cursor-pointer")}
              >
                <option value="">Not sure yet</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id} className="bg-ink-2">
                    {p.name} — {p.price}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/*
            Shown only for monthly. Everything in it is derived: the reduced
            figure comes from the package's own price, the minimum from one
            constant. Nothing here is a second copy of a number written
            elsewhere, so the form cannot quote terms the pricing page does not.
          */}
          {isMonthly && (
            <div className="mt-7 border border-accent/40 bg-accent/[0.055] p-6">
              <p className="eyebrow mb-4 text-accent">Monthly Package</p>

              <select
                id="monthlyPackage"
                name="monthlyPackage"
                value={monthlyId}
                onChange={(e) => setMonthlyId(e.target.value)}
                className={cn(fieldBase, "cursor-pointer")}
              >
                <option value="">Which package are you interested in?</option>
                {monthlyPackages.map((p) => (
                  <option key={p.id} value={p.id} className="bg-ink-2">
                    {p.name}
                    {p.price ? ` — ${p.price}/mo` : " — custom quote"}
                  </option>
                ))}
              </select>

              {chosen && (
                <dl className="mt-6 flex flex-col gap-2.5 border-t border-accent/25 pt-5 text-[0.82rem]">
                  {chosen.price ? (
                    <>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-mute">Standard monthly rate</dt>
                        <dd className="text-bone tabular-nums">{chosen.price}/mo</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-accent">
                          First month, new clients ({DISCOUNT_LABEL} off)
                        </dt>
                        <dd className="text-accent tabular-nums">{breakdown?.total}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-mute">
                          Months 2 &amp; {MINIMUM_MONTHS}
                        </dt>
                        <dd className="text-bone tabular-nums">{chosen.price}/mo</dd>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-mute">Rate</dt>
                      <dd className="text-bone">Quoted per brand</dd>
                    </div>
                  )}

                  <p className="mt-3 border-t border-accent/25 pt-4 text-[0.76rem] leading-relaxed text-faint">
                    {MINIMUM_MONTHS}-month minimum. The introductory rate applies to
                    month one only. Figures are starting points — your exact rate
                    comes from your quote.
                  </p>
                </dl>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <Label index={6} htmlFor="shootDate">
            Preferred Shoot Date
          </Label>
          <input
            id="shootDate"
            name="shootDate"
            type="date"
            min={today}
            className={cn(fieldBase, "cursor-pointer [color-scheme:dark]")}
            aria-invalid={Boolean(errors.shootDate)}
          />
          <FieldError message={errors.shootDate} />
        </div>

        <div className="flex flex-col">
          <Label index={7} htmlFor="location">
            Location
          </Label>
          <input
            id="location"
            name="location"
            autoComplete="address-level2"
            placeholder="City, or the shop / property address"
            className={fieldBase}
          />
        </div>

        <div className="flex flex-col">
          <Label index={8} htmlFor="budget">
            Estimated Budget *
          </Label>
          <select
            id="budget"
            name="budget"
            required
            defaultValue=""
            className={cn(fieldBase, "cursor-pointer")}
            aria-invalid={Boolean(errors.budget)}
          >
            <option value="" disabled>
              Select a range
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-ink-2">
                {b}
              </option>
            ))}
          </select>
          <FieldError message={errors.budget} />
        </div>
      </fieldset>

      <div className="flex flex-col">
        {/*
          Promo code.
          ────────────────────────────────────────────────────────────────────
          Deliberately not validated as "new client" here. A static page cannot
          know who has booked before, and pretending to check would only teach
          a returning client that the code works. Eligibility is settled on the
          quote, where it can actually be looked up — the Sheet records the code
          against every booking for exactly that.
        */}
        <div className="flex flex-col">
          <Label index={9} htmlFor="promoCode">
            Promo Code
          </Label>

          <div className="flex gap-3">
            <input
              id="promoCode"
              name="promoCode"
              value={promoInput}
              onChange={(e) => {
                setPromoInput(e.target.value);
                setPromoError(null);
                setPromoApplied(false);
              }}
              onKeyDown={(e) => {
                // Enter inside a promo field means "apply", not "submit the
                // whole booking" — which is what it would do by default.
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyPromo();
                }
              }}
              autoCapitalize="characters"
              autoComplete="off"
              spellCheck={false}
              placeholder="Enter code"
              className={cn(fieldBase, "flex-1 uppercase tracking-[0.14em]")}
            />
            <button
              type="button"
              onClick={applyPromo}
              className="shrink-0 border border-line-strong px-6 text-[0.68rem] font-medium tracking-[0.2em] text-bone uppercase transition-colors duration-400 hover:border-accent hover:text-accent"
            >
              Apply
            </button>
          </div>

          {promoError && (
            <p role="alert" className="mt-2 text-[0.72rem] tracking-wide text-accent">
              {promoError}
            </p>
          )}

          {promoApplied && (
            <div className="mt-4 border border-accent/45 bg-accent/[0.055] p-5">
              <p className="flex items-center gap-2 text-[0.72rem] font-medium tracking-[0.18em] text-accent uppercase">
                {PROMO_CODE} applied ✓
              </p>
              <p className="mt-1 text-[0.72rem] tracking-[0.14em] text-mute uppercase">
                {DISCOUNT_LABEL} first-time discount
              </p>

              {breakdown ? (
                <dl className="mt-5 flex flex-col gap-2.5 border-t border-accent/25 pt-4 text-[0.84rem]">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-mute">Original</dt>
                    <dd className="text-bone tabular-nums">{breakdown.original}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-mute">
                      {isMonthly ? "First month discount" : "First-time discount"}
                    </dt>
                    <dd className="text-accent tabular-nums">−{breakdown.saving}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-accent/25 pt-3">
                    <dt className="text-bone">
                      {isMonthly ? "First month total" : "Your total"}
                    </dt>
                    <dd className="display text-xl text-accent tabular-nums">
                      {breakdown.total}
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 border-t border-accent/25 pt-4 text-[0.78rem] leading-relaxed text-mute">
                  Pick a package above and the figures appear here. On a custom
                  quote the discount is applied to your quoted amount.
                </p>
              )}

              {isMonthly && (
                <p className="mt-4 text-[0.76rem] leading-relaxed text-faint">
                  {DISCOUNT_LABEL} applies to month 1 only. Regular monthly
                  pricing resumes from month 2, under the {MINIMUM_MONTHS}-month
                  minimum.
                </p>
              )}
            </div>
          )}
        </div>

        <Label index={10} htmlFor="message">
          Message *
        </Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="The vehicle, the business, or the season — and what you want the finished piece to do."
          className={cn(fieldBase, "resize-none")}
          aria-invalid={Boolean(errors.message)}
        />
        <FieldError message={errors.message} />
      </div>

      {/*
        No file upload.
        ─────────────────────────────────────────────────────────────────────
        Bookings post into a Google Form, and a Google Form's file question
        forces the visitor to sign into a Google account before it will accept
        anything. Putting that in front of a booking would cost more enquiries
        than reference images are worth. The message field asks for links
        instead, which anyone can paste.
      */}

      {formError && (
        <p
          role="alert"
          className="border border-accent/40 bg-accent/8 px-5 py-4 text-sm text-accent"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-col items-start gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-sm text-[0.72rem] leading-relaxed text-faint">
          Your details go straight to me — never shared, never added to a list.
        </p>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-3 bg-bone px-10 py-4 text-[0.72rem] font-medium tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-50 md:w-auto"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            "Book My Shoot"
          )}
        </button>
      </div>
    </form>
  );
}
