"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  SERVICE_INTERESTS,
  INDUSTRIES,
  BUDGETS,
  START_WINDOWS,
  REFERRAL_SOURCES,
} from "@/lib/inquiry";
import { submitLead } from "@/lib/submit-lead";
import { site } from "@/data/site";
import { cn, pad } from "@/lib/utils";

type Status = "idle" | "sending" | "error";

const fieldBase =
  "w-full border border-line bg-ink-2 px-4 py-3.5 text-sm text-bone transition-colors duration-400 outline-none placeholder:text-faint focus:border-accent";

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
    <label htmlFor={htmlFor} className="eyebrow mb-2.5 flex items-center gap-3">
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

/**
 * The enquiry form.
 *
 * ── Why it is this long ────────────────────────────────────────────────────
 * No price appears anywhere on this site, so the brief has to carry everything
 * a proposal is built from: the industry, what they want help with, the goal,
 * what is going wrong now, a budget range and a start window. The alternative
 * is a two-field contact form followed by a reply that asks all of it anyway,
 * which spends the first exchange on questions instead of on an answer.
 *
 * Length also does work here that copy cannot. A form that asks serious
 * questions reads as a business that takes on serious clients, and it filters:
 * someone shopping for a cheap video does not fill in eleven fields, and that
 * is the point rather than a side effect.
 *
 * ── Grouped, not stacked ───────────────────────────────────────────────────
 * Three sections — who you are, what you need, what you are working with — so
 * eleven fields read as three short questions rather than one long wall. The
 * numbering runs straight through, because restarting at 01 in each group
 * makes the form look longer than it is.
 */
export function BookingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setErrors({});
    setFormError(null);

    const result = await submitLead(new FormData(form));

    if (result.ok) {
      router.push("/contact/success");
      return;
    }

    setStatus("error");
    if (result.fieldErrors) setErrors(result.fieldErrors);
    if (result.error) setFormError(result.error);

    /*
      Move the reader to the first thing that needs fixing. A form this long
      scrolls well past the viewport, so an error message rendered beside a
      field two screens up is an error message nobody sees.
    */
    const firstKey = result.fieldErrors && Object.keys(result.fieldErrors)[0];
    const target = firstKey
      ? form.querySelector<HTMLElement>(`[name="${firstKey}"]`)
      : null;
    (target ?? form).scrollIntoView({ block: "center" });
    target?.focus({ preventScroll: true });
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-14">
      {/* ── Who you are ─────────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-7 border-t border-line pt-10">
        <legend className="sr-only">Your details</legend>
        <p className="eyebrow text-accent">Your business</p>

        <div className="grid gap-7 md:grid-cols-2">
          <div>
            <Label index={1} htmlFor="name">
              Your Name *
            </Label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              className={fieldBase}
              aria-invalid={Boolean(errors.name)}
            />
            <FieldError message={errors.name} />
          </div>

          <div>
            <Label index={2} htmlFor="businessName">
              Business Name *
            </Label>
            <input
              id="businessName"
              name="businessName"
              autoComplete="organization"
              className={fieldBase}
              aria-invalid={Boolean(errors.businessName)}
            />
            <FieldError message={errors.businessName} />
          </div>

          <div>
            <Label index={3} htmlFor="email">
              Email *
            </Label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={fieldBase}
              aria-invalid={Boolean(errors.email)}
            />
            <FieldError message={errors.email} />
          </div>

          <div>
            <Label index={4} htmlFor="phone">
              Phone *
            </Label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={fieldBase}
              aria-invalid={Boolean(errors.phone)}
            />
            <FieldError message={errors.phone} />
          </div>

          <div>
            <Label index={5} htmlFor="website">
              Website
            </Label>
            {/* Not type="url": people type "acmebuilders.com" and a browser
                rejecting that costs a lead over a missing "https://". */}
            <input
              id="website"
              name="website"
              inputMode="url"
              autoComplete="url"
              placeholder="yourbusiness.com"
              className={fieldBase}
            />
          </div>

          <div>
            <Label index={6} htmlFor="industry">
              Industry *
            </Label>
            <select
              id="industry"
              name="industry"
              defaultValue=""
              className={cn(fieldBase, "cursor-pointer")}
              aria-invalid={Boolean(errors.industry)}
            >
              <option value="">Select your industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i} className="bg-ink-2">
                  {i}
                </option>
              ))}
            </select>
            <FieldError message={errors.industry} />
          </div>
        </div>
      </fieldset>

      {/* ── What you need ───────────────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-7 border-t border-line pt-10">
        <legend className="sr-only">What you need</legend>
        <p className="eyebrow text-accent">What you need</p>

        <div>
          <p className="eyebrow mb-3.5 flex items-center gap-3">
            <span className="text-accent">{pad(7)}</span>
            What are you interested in? *
          </p>
          {/*
            Checkboxes, not a dropdown. Most enquiries want more than one thing,
            and a single-select would quietly turn a full-service enquiry into
            a video enquiry — which is precisely the misread this rebrand
            exists to stop.
          */}
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {SERVICE_INTERESTS.map((service) => (
              <label
                key={service}
                className="flex cursor-pointer items-center gap-3.5 bg-ink px-4 py-3.5 text-[0.84rem] text-mute transition-colors duration-300 hover:text-bone"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={service}
                  className="h-[1.05rem] w-[1.05rem] shrink-0 accent-accent"
                />
                {service}
              </label>
            ))}
          </div>
          <FieldError message={errors.interests} />
        </div>

        <div>
          <Label index={8} htmlFor="goal">
            What&apos;s your main marketing goal? *
          </Label>
          <textarea
            id="goal"
            name="goal"
            rows={3}
            placeholder="More qualified leads, moving specific inventory, launching a location, building the brand — whatever winning looks like for you."
            className={cn(fieldBase, "resize-none")}
            aria-invalid={Boolean(errors.goal)}
          />
          <FieldError message={errors.goal} />
        </div>

        <div>
          <Label index={9} htmlFor="challenges">
            What isn&apos;t working right now? *
          </Label>
          <textarea
            id="challenges"
            name="challenges"
            rows={3}
            placeholder="Ads that don't convert, no consistent content, a website nobody calls from, competitors outspending you — the honest version is the useful one."
            className={cn(fieldBase, "resize-none")}
            aria-invalid={Boolean(errors.challenges)}
          />
          <FieldError message={errors.challenges} />
        </div>
      </fieldset>

      {/* ── What you're working with ────────────────────────────────────── */}
      <fieldset className="flex flex-col gap-7 border-t border-line pt-10">
        <legend className="sr-only">Budget and timing</legend>
        <p className="eyebrow text-accent">Budget &amp; timing</p>

        <div className="grid gap-7 md:grid-cols-2">
          <div>
            <Label index={10} htmlFor="budget">
              Approximate Marketing Budget *
            </Label>
            <select
              id="budget"
              name="budget"
              defaultValue=""
              className={cn(fieldBase, "cursor-pointer")}
              aria-invalid={Boolean(errors.budget)}
            >
              <option value="">Select a range</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b} className="bg-ink-2">
                  {b}
                </option>
              ))}
            </select>
            <FieldError message={errors.budget} />
            <p className="mt-2.5 text-[0.72rem] leading-relaxed text-faint">
              A range, not a commitment. It tells me what is realistic to
              propose so the first thing you read is an approach, not a
              question about money.
            </p>
          </div>

          <div>
            <Label index={11} htmlFor="startWindow">
              Desired Start *
            </Label>
            <select
              id="startWindow"
              name="startWindow"
              defaultValue=""
              className={cn(fieldBase, "cursor-pointer")}
              aria-invalid={Boolean(errors.startWindow)}
            >
              <option value="">When would you want to start?</option>
              {START_WINDOWS.map((w) => (
                <option key={w} value={w} className="bg-ink-2">
                  {w}
                </option>
              ))}
            </select>
            <FieldError message={errors.startWindow} />
          </div>

          <div>
            <Label index={12} htmlFor="referral">
              How did you hear about me?
            </Label>
            <select
              id="referral"
              name="referral"
              defaultValue=""
              className={cn(fieldBase, "cursor-pointer")}
            >
              <option value="">Optional</option>
              {REFERRAL_SOURCES.map((r) => (
                <option key={r} value={r} className="bg-ink-2">
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label index={13} htmlFor="details">
            Anything else I should know?
          </Label>
          <textarea
            id="details"
            name="details"
            rows={4}
            placeholder="Competitors you're up against, what you've tried before, deadlines, locations, anything that would change the approach."
            className={cn(fieldBase, "resize-none")}
          />
        </div>
      </fieldset>

      {/* ── Send ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 border-t border-line pt-10">
        {formError && (
          <p role="alert" className="border border-accent/50 bg-accent/[0.06] p-4 text-sm text-bone">
            {formError}
          </p>
        )}

        {/* Honeypot. Off-screen rather than display:none — some bots skip
            hidden inputs, and none of them skip an off-screen one. */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-[9999px] opacity-0">
          <label htmlFor="website_hp">Leave this empty</label>
          <input id="website_hp" name="website_hp" tabIndex={-1} autoComplete="off" />
        </div>

        <p className="text-[0.78rem] leading-relaxed text-faint">
          Your details come straight to me — never shared, never added to a list.
        </p>

        <label
          htmlFor="acknowledged"
          className="flex cursor-pointer items-start gap-3.5 border border-line bg-ink-2 p-5 text-[0.84rem] leading-relaxed text-mute transition-colors duration-400 hover:border-line-strong"
        >
          <input
            id="acknowledged"
            name="acknowledged"
            type="checkbox"
            className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 accent-accent"
            aria-invalid={Boolean(errors.acknowledged)}
          />
          <span>
            I understand this is an{" "}
            <span className="text-bone">enquiry</span>, and that nothing is
            booked or charged until 508 Filmzz and I agree on a proposal.
          </span>
        </label>
        <FieldError message={errors.acknowledged} />

        {/*
          Text-message consent, kept deliberately separate from the box above.
          It must be unchecked on load — a pre-ticked box is not consent — and
          it must be its own decision rather than a clause inside the required
          acknowledgement, or the consent is not express. Everything carriers
          look for is in the label: who is texting, about what, that frequency
          varies, that rates apply, and how to stop.
        */}
        <label
          htmlFor="smsConsent"
          className="flex cursor-pointer items-start gap-3.5 border border-line p-5 text-[0.78rem] leading-relaxed text-faint transition-colors duration-400 hover:border-line-strong"
        >
          <input
            id="smsConsent"
            name="smsConsent"
            type="checkbox"
            className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 accent-accent"
          />
          <span>
            <span className="text-mute">Text me about this enquiry (optional).</span>{" "}
            I agree to receive text messages from 508 Filmzz about this request
            and my project. Message frequency varies. Message and data rates may
            apply. Reply STOP to opt out or HELP for help. Consent is not a
            condition of purchase.
          </span>
        </label>

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
            "Request a Custom Quote"
          )}
        </button>

        <p className="text-[0.78rem] text-faint">
          Rather talk it through? Call or text{" "}
          <a
            href={`tel:${site.phoneE164}`}
            className="text-mute underline underline-offset-4 transition-colors duration-300 hover:text-accent"
          >
            {site.phone}
          </a>
          .
        </p>
      </div>
    </form>
  );
}
