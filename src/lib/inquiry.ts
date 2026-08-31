import { z } from "zod";

/**
 * ── EDIT ME: THE QUALIFICATION FORM ────────────────────────────────────────
 * What a marketing enquiry has to answer before a proposal can be written.
 *
 * This is not a contact form with extra rows. No price appears anywhere on the
 * site, which means the brief has to carry everything a number is built from —
 * the industry, the goal, what is going wrong now, the budget range and when
 * they want to start. A reply that begins "what's your budget?" wastes the
 * first exchange and reads like a quote about to be reverse-engineered.
 *
 * Two rules shaped the field list. Every question either changes the proposal
 * or is not asked. And nothing asks for a precise figure: budget is a range,
 * because a business owner who does not have an exact number yet will abandon
 * a form rather than guess one, and the range is all that is needed to know
 * whether this is a fit.
 */

/** What they want help with. Multi-select — most enquiries want more than one. */
export const SERVICE_INTERESTS = [
  "Marketing Strategy",
  "Social Media",
  "Video Production",
  "Photography",
  "Meta Advertising",
  "Ad Creative",
  "Website / Landing Page",
  "Lead Generation",
  "Full-Service Marketing",
  "Not Sure",
] as const;

/**
 * The industries this is built for.
 *
 * Listed rather than left as free text because it is the fastest signal of
 * whether an enquiry is a fit, and because a business owner picking their own
 * industry off a list reads as "he works with people like me" — which is the
 * job of every field above the fold.
 */
export const INDUSTRIES = [
  "Automotive Dealership",
  "Automotive / Performance",
  "Construction",
  "Builder / Developer",
  "Real Estate",
  "Luxury / Premium Brand",
  "Marine & Powersports",
  "Home Services",
  "Manufacturing / Fabrication",
  "Professional Services",
  "Other",
] as const;

/**
 * Budget, as a range.
 *
 * Ranges rather than a number, and "Not sure" is a real option rather than an
 * escape hatch — a business that has never bought marketing genuinely does not
 * know, and forcing a figure out of them produces a made-up one that then has
 * to be walked back.
 */
export const BUDGETS = [
  "Under $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure",
] as const;

/** When they want to start. Windows, because a date this early is a guess. */
export const START_WINDOWS = [
  "As soon as possible",
  "Within a month",
  "1–3 months",
  "Just planning ahead",
] as const;

/** Where the enquiry came from. Plain options — a lead source, not a survey. */
export const REFERRAL_SOURCES = [
  "Instagram",
  "TikTok",
  "Google search",
  "Business card",
  "Word of mouth",
  "Saw your work somewhere",
  "Other",
] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  businessName: z
    .string()
    .trim()
    .min(2, "Please enter your business name")
    .max(160),
  email: z.email("Please enter a valid email address").max(180),
  phone: z.string().trim().min(7, "Please enter a contact number").max(40),

  /*
    Website is optional and deliberately not validated as a URL. People type
    "acmebuilders.com" without a scheme far more often than they type a valid
    one, and rejecting that is rejecting a lead over a formatting rule.
  */
  website: z.string().trim().max(200).optional().or(z.literal("")),

  industry: z.enum(INDUSTRIES, { message: "Choose the closest industry" }),

  /*
    At least one service. Sent as an array from a checkbox group, so an empty
    submission is a real state rather than an impossible one.
  */
  interests: z
    .array(z.enum(SERVICE_INTERESTS))
    .min(1, "Choose at least one — pick Not Sure if you'd rather talk it through"),

  goal: z
    .string()
    .trim()
    .min(10, "A sentence is enough — what would success look like?")
    .max(1000),

  challenges: z
    .string()
    .trim()
    .min(10, "What isn't working right now? A sentence is enough")
    .max(2000),

  budget: z.enum(BUDGETS, { message: "Choose a budget range" }),
  startWindow: z.enum(START_WINDOWS, { message: "Choose a rough start window" }),

  referral: z.string().trim().max(80).optional().or(z.literal("")),
  details: z.string().trim().max(4000).optional().or(z.literal("")),

  /*
    The acknowledgement. Required, and phrased as an understanding rather than
    a waiver — it protects against the one misunderstanding that costs a
    relationship: that sending a brief has booked something.
  */
  acknowledged: z.literal("on", {
    message: "Please confirm you understand this is an enquiry",
  }),

  /*
    Text-message consent. Optional, and it has to stay that way.

    Under the TCPA this is express written consent to be texted, which is only
    valid if it is a separate, affirmative act — so it is its own unchecked box
    rather than folded into the acknowledgement above, and an enquiry submits
    perfectly well without it. Making it required would make every consent on
    file worthless, because a box you cannot submit without is not a choice.
  */
  smsConsent: z.literal("on").optional().or(z.literal("")),

  /**
   * Honeypot: bots fill this, humans never see it. Deliberately NOT validated —
   * the submission is accepted and silently dropped, so a bot never learns
   * which field gave it away.
   */
  website_hp: z.string().optional(),
});

export type Inquiry = z.infer<typeof inquirySchema>;
