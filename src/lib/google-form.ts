/**
 * Where a booking goes.
 * ─────────────────────────────────────────────────────────────────────────────
 * GitHub Pages serves files and cannot run code, so there is no API route to
 * post to. The site posts straight into a Google Form instead; Google records
 * the response in the linked Sheet and emails the studio.
 *
 * ── REPLACING THE FORM ──────────────────────────────────────────────────────
 * If you ever rebuild the form, both halves below have to be regenerated
 * together — an endpoint pointing at one form with another form's field ids
 * fails on every submission.
 *
 *   1. Open the form's public link (Send → 🔗 link, "Shorten URL" unticked).
 *   2. View source and find `FB_PUBLIC_LOAD_DATA_`. Each question appears as
 *      [id, "Title", …] and the number in its fourth element is the entry id.
 *   3. ENDPOINT is that same link with `/viewform` swapped for `/formResponse`.
 *
 * Easier: ask Claude to read the form link and rewrite this file.
 */

/**
 * `NEXT_PUBLIC_FORM_ENDPOINT` overrides this, so a replacement form can be
 * pointed at without a code change — but the ids below must match it.
 */
export const FORM_ENDPOINT =
  process.env.NEXT_PUBLIC_FORM_ENDPOINT ||
  "https://docs.google.com/forms/d/e/1FAIpQLSd-G2A4Y1O8U1j78neP9ZGlQpFfmzmSyHqt20lie-h7ouVCFQ/formResponse";

/** Site field → Google Form entry id. Verified against the live form. */
export const FIELD_IDS = {
  name: "entry.207022369",
  businessName: "entry.444221534",
  email: "entry.1777192855",
  phone: "entry.1805905143",
  projectType: "entry.2066163859",
  budget: "entry.111280340",
  shootDate: "entry.34369500",
  location: "entry.2058135756",
  message: "entry.339321494",
} as const;

/**
 * What to send when a field the visitor left blank still has to carry a value.
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS IS NOT COSMETIC. A Google Form rejects the whole submission with a 400
 * if any question it marks Required arrives empty — and the browser cannot read
 * that 400 (see the no-cors note in submit-lead.ts), so the visitor would be
 * thanked while the booking was thrown away.
 *
 * Business Name is Required on the form but optional on the site, which is
 * exactly that trap. Rather than depend on the form's settings never changing,
 * every optional field sends real text instead of "". No blank can bounce, no
 * matter which questions get marked Required later.
 */
export const BLANK_PLACEHOLDERS = {
  businessName: "(not given)",
  shootDate: "Flexible",
  location: "(not given)",
} as const;
