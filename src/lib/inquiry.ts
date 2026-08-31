import { z } from "zod";

/*
  The service list, named the way the site names them.

  "Automotive" became "Automotive Cinematography" to match the Services page —
  a dropdown that uses different words from the page it was reached from makes
  a visitor stop and check they are in the right place.

  Drone, editing and product launches fold into Other rather than getting their
  own rows: nine options is a menu, six is a choice, and the project
  description says what Other means far better than a label would.
*/
/**
 * The option that switches the booking form to its monthly branch.
 *
 * Exported, and compared against by identity rather than retyped, because it
 * was retyped once: the form checked for "Monthly Content" while the option
 * read "Monthly Content Package", so the monthly panel never appeared and no
 * one could select a package or see the introductory rate. A string that has
 * to match another string in a different file will eventually stop matching.
 */
export const MONTHLY_PROJECT_TYPE = "Monthly Content Package";

export const PROJECT_TYPES = [
  "Commercial / Advertisement",
  "Social Content",
  "Product or Service Video",
  "Content Campaign",
  "Automotive / Dealership",
  MONTHLY_PROJECT_TYPE,
  "Other",
] as const;

/**
 * When, roughly.
 *
 * Windows rather than a clock: an automotive shoot is booked against light,
 * not against a minute, and "golden hour" is a more useful answer than 6:47pm.
 * A short dropdown also beats a native time picker on a phone.
 */
export const TIME_WINDOWS = [
  "Morning",
  "Midday",
  "Afternoon",
  "Golden hour",
  "Evening / night",
  "Flexible",
] as const;

/** Where the enquiry came from. Plain options — this is a lead source, not a survey. */
export const REFERRAL_SOURCES = [
  "Instagram",
  "TikTok",
  "Google search",
  "Business card",
  "Word of mouth",
  "Saw your work somewhere",
  "Other",
] as const;

/**
 * How often, for ongoing work.
 *
 * Only asked on the monthly branch, and kept to ranges a shoot schedule can
 * actually be built from. A Custom enquiry that does not answer this is a
 * quote that cannot be written without a phone call first, which is the one
 * thing the form exists to avoid.
 */
export const SHOOT_FREQUENCIES = [
  "Once a month",
  "Twice a month",
  "Weekly",
  "A few times a year",
  "Not sure yet — advise me",
] as const;

export const BUDGETS = [
  "$750 – $1,500",
  "$1,500 – $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Monthly retainer",
  "Not sure yet — advise me",
] as const;

export const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  businessName: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.email("Please enter a valid email address").max(180),
  phone: z.string().trim().min(7, "Please enter a contact number").max(40),
  projectType: z.enum(PROJECT_TYPES, { message: "Choose a project type" }),
  /** ISO date (yyyy-mm-dd) from the date input, or empty when flexible. */
  shootDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker")
    .optional()
    .or(z.literal("")),
  location: z.string().trim().max(180).optional().or(z.literal("")),
  referral: z.string().trim().max(80).optional().or(z.literal("")),
  shootTime: z.string().trim().max(40).optional().or(z.literal("")),
  frequency: z.string().trim().max(40).optional().or(z.literal("")),
  social: z.string().trim().max(80).optional().or(z.literal("")),
  /*
    The acknowledgement. Required, and phrased as an understanding rather than
    a waiver — it protects the date from being treated as held, which is the
    one misunderstanding that costs a shoot.
  */
  acknowledged: z.literal("on", {
    message: "Please confirm you understand this is a request",
  }),
  /*
    Text-message consent. Optional, and it has to stay that way.

    Under the TCPA this is express written consent to be texted, which is only
    valid if it is a separate, affirmative act — so it is its own unchecked box
    rather than folded into the acknowledgement above, and a booking submits
    perfectly well without it. Making it required would make every consent on
    file worthless, because a box you cannot submit without is not a choice.
  */
  smsConsent: z.literal("on").optional().or(z.literal("")),
  budget: z.enum(BUDGETS, { message: "Choose a budget range" }),
  message: z
    .string()
    .trim()
    .min(20, "Tell me a bit more — 20 characters minimum")
    .max(4000),
  /**
   * Honeypot: bots fill this, humans never see it. Deliberately NOT validated —
   * the route accepts the submission and silently drops it, so a bot never
   * learns which field gave it away.
   */
  website: z.string().optional(),
});

export type Inquiry = z.infer<typeof inquirySchema>;

/** Everything the notification channels need, after validation. */
export type Lead = Omit<Inquiry, "website"> & {
  receivedAt: string;
};

export function formatShootDate(iso: string | undefined) {
  if (!iso) return "Flexible";
  const [y, m, d] = iso.split("-").map(Number);
  // Build in local time so the label matches what the client picked.
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
