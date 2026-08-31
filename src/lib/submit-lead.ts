import { inquirySchema } from "@/lib/inquiry";
import { FORM_ENDPOINT, FIELD_IDS, BLANK_PLACEHOLDERS } from "@/lib/google-form";

export { FORM_ENDPOINT };

export type SubmitResult =
  | { ok: true }
  | { ok: false; fieldErrors?: Record<string, string>; error?: string };

/**
 * Validates and submits an enquiry.
 *
 * Validation runs here because a static site has no server to do it, and it is
 * the *only* validation there is — see the delivery note at the bottom. What
 * leaves the browser has to be right, because nothing downstream will tell us
 * if it was not.
 */
export async function submitLead(form: FormData): Promise<SubmitResult> {
  const raw = {
    name: String(form.get("name") ?? ""),
    businessName: String(form.get("businessName") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: String(form.get("phone") ?? ""),
    website: String(form.get("website") ?? ""),
    industry: String(form.get("industry") ?? ""),
    // A checkbox group: every ticked box arrives under the same key.
    interests: form.getAll("interests").map(String),
    goal: String(form.get("goal") ?? ""),
    challenges: String(form.get("challenges") ?? ""),
    budget: String(form.get("budget") ?? ""),
    startWindow: String(form.get("startWindow") ?? ""),
    referral: String(form.get("referral") ?? ""),
    details: String(form.get("details") ?? ""),
    acknowledged: String(form.get("acknowledged") ?? ""),
    smsConsent: String(form.get("smsConsent") ?? ""),
    website_hp: String(form.get("website_hp") ?? ""),
  };

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
  if (parsed.data.website_hp) return { ok: true };

  if (!FORM_ENDPOINT) {
    return {
      ok: false,
      error:
        "The enquiry form isn't connected yet. Please call or email — both work right now.",
    };
  }

  const lead = parsed.data;

  /*
    ── Mapping eleven answers onto nine Google Form questions ────────────────
    The backing form's question ids are fixed; new questions cannot be added
    from here. Seven fields map one-to-one. The rest are composed into the free
    text question below under fixed labels, which is the same approach the form
    has always used for anything the backing form has no slot for.

    The labels are a parser, not prose: the Apps Script that builds the text
    alert and the proposal reads them back out. Reword them and the alert
    silently starts arriving with blanks in it.
  */
  const brief = [
    `Industry: ${lead.industry}`,
    `Interested in: ${lead.interests.join(", ")}`,
    `Website: ${lead.website || "(not given)"}`,
    "",
    "Main marketing goal:",
    lead.goal,
    "",
    "Current challenges:",
    lead.challenges,
  ];

  if (lead.details) brief.push("", "Additional information:", lead.details);
  if (lead.referral) brief.push("", `Heard about 508 Filmzz via: ${lead.referral}`);

  /*
    Consent is recorded on every enquiry, including the refusals. A row that
    says nothing about texting is indistinguishable from one where the box was
    never rendered, and if a complaint ever lands the only useful record is the
    one saying which answer this person actually gave.
  */
  brief.push("", `SMS consent: ${lead.smsConsent === "on" ? "Yes" : "No"}`);

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
    // Repurposed slots. The values were verified against the live form: both
    // questions accept free text, so the new vocabulary is not rejected.
    [FIELD_IDS.projectType]: lead.interests.join(", "),
    [FIELD_IDS.budget]: lead.budget,
    [FIELD_IDS.shootDate]: lead.startWindow,
    [FIELD_IDS.location]: lead.website || BLANK_PLACEHOLDERS.location,
    [FIELD_IDS.message]: brief.join("\n"),
  });

  /*
   * ── Why this is fire-and-forget ────────────────────────────────────────────
   * Google Forms sends no CORS headers, so the browser refuses to hand us the
   * response. `no-cors` lets the request through and returns an opaque result:
   * `res.status` is always 0 and `res.ok` always false, whether Google recorded
   * the enquiry or rejected it.
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

  return { ok: true };
}
