import { inquirySchema } from "@/lib/inquiry";
import { FORM_ENDPOINT, FIELD_IDS, BLANK_PLACEHOLDERS } from "@/lib/google-form";
import { monthlyPackages } from "@/data/site";
import { discountedPrice, DISCOUNT_LABEL, MINIMUM_MONTHS } from "@/lib/offer";

export { FORM_ENDPOINT };

export type SubmitResult =
  | { ok: true; confirmationEmailed: boolean }
  | { ok: false; fieldErrors?: Record<string, string>; error?: string };

/**
 * Validates and submits a booking.
 *
 * Validation runs here because a static site has no server to do it, and it is
 * the *only* validation there is — see the delivery note below. Everything the
 * studio needs must be right before the request leaves the browser.
 */
export async function submitLead(form: FormData): Promise<SubmitResult> {
  const raw = {
    name: String(form.get("name") ?? ""),
    businessName: String(form.get("businessName") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: String(form.get("phone") ?? ""),
    projectType: String(form.get("projectType") ?? ""),
    shootDate: String(form.get("shootDate") ?? ""),
    location: String(form.get("location") ?? ""),
    budget: String(form.get("budget") ?? ""),
    message: String(form.get("message") ?? ""),
    website: String(form.get("website") ?? ""),
  };

  /*
    Monthly terms travel inside the project details.

    The Google Form has no question for a package or a rate, and adding one
    means editing the form and re-reading its field ids. Appending labelled
    lines captures the same information today, survives a form edit, and is
    what the Apps Script reads back to fill the contract. The labels are the
    contract's parser, so they are written once and not reworded casually.
  */
  const monthlyId = String(form.get("monthlyPackage") ?? "");
  const chosen = monthlyPackages.find((p) => p.id === monthlyId);
  if (chosen) {
    const first = discountedPrice(chosen.price);
    const terms = [
      `Monthly package: ${chosen.name}`,
      chosen.price
        ? `Standard rate: ${chosen.price}/mo`
        : "Standard rate: quoted per brand",
      first ? `First month (${DISCOUNT_LABEL} off): ${first}` : null,
      `Minimum term: ${MINIMUM_MONTHS} months`,
    ].filter(Boolean);
    raw.message = `${raw.message}\n\n${terms.join("\n")}`;
  }

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  // Honeypot tripped — report success so the bot learns nothing.
  if (parsed.data.website) return { ok: true, confirmationEmailed: false };

  if (!FORM_ENDPOINT) {
    return {
      ok: false,
      error:
        "The booking form isn't connected yet. Please call or email — both work right now.",
    };
  }

  const lead = parsed.data;

  /*
   * Never send an empty string. A Required question that arrives blank rejects
   * the entire submission, and that rejection is invisible here — see
   * BLANK_PLACEHOLDERS in google-form.ts for why this is a data-loss guard
   * rather than a formatting choice.
   */
  const body = new URLSearchParams({
    [FIELD_IDS.name]: lead.name,
    [FIELD_IDS.businessName]: lead.businessName || BLANK_PLACEHOLDERS.businessName,
    [FIELD_IDS.email]: lead.email,
    [FIELD_IDS.phone]: lead.phone,
    [FIELD_IDS.projectType]: lead.projectType,
    [FIELD_IDS.budget]: lead.budget,
    [FIELD_IDS.shootDate]: formatShootDateForSheet(lead.shootDate),
    [FIELD_IDS.location]: lead.location || BLANK_PLACEHOLDERS.location,
    [FIELD_IDS.message]: lead.message,
  });

  /*
   * ── Why this is fire-and-forget ────────────────────────────────────────────
   * Google Forms sends no CORS headers, so the browser refuses to hand us the
   * response. `no-cors` lets the request through and returns an opaque result:
   * `res.status` is always 0 and `res.ok` always false, whether Google recorded
   * the booking or rejected it.
   *
   * So there is nothing to check. `fetch` still rejects when the request never
   * left the machine — offline, DNS failure, connection refused — and that is
   * the one real failure we can report. Anything past that is reported as sent,
   * which is why the payload above is built so it cannot be rejected.
   *
   * URLSearchParams sets `application/x-www-form-urlencoded`, one of the three
   * content types that skip the CORS preflight. A JSON content type would fail
   * before leaving the browser.
   */
  try {
    await fetch(FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body,
    });
  } catch {
    return {
      ok: false,
      error:
        "Couldn't reach the server — check your connection, or call (864) 915-4071.",
    };
  }

  // No confirmation email exists on this path: Google notifies the studio, not
  // the customer. The success page says so rather than promising one.
  return { ok: true, confirmationEmailed: false };
}

/** A shoot date the Sheet can be read at a glance, not an ISO string. */
function formatShootDateForSheet(iso: string | undefined): string {
  if (!iso) return BLANK_PLACEHOLDERS.shootDate;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
