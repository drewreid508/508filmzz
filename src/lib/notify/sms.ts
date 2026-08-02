import { site } from "@/data/site";
import { formatShootDate, type Lead } from "@/lib/inquiry";
import { failed, skipped, type ChannelResult } from "./types";

/**
 * Texts a new booking to Drew's phone via Twilio's REST API.
 *
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER
 *      SMS_TO_NUMBER (optional — defaults to the number in site.ts)
 */
export async function sendBookingSms(lead: Lead): Promise<ChannelResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const to = process.env.SMS_TO_NUMBER ?? site.phoneE164;

  if (!sid || !token || !from) {
    return skipped("Twilio is not configured");
  }

  // Keep it inside a single segment where possible — this is a phone alert,
  // not the full brief. The email carries the detail.
  const body = [
    `NEW BOOKING — 508 Filmzz`,
    `${lead.name}${lead.businessName ? ` (${lead.businessName})` : ""}`,
    `${lead.projectType} · ${lead.budget}`,
    `Date: ${formatShootDate(lead.shootDate)}`,
    lead.location ? `Where: ${lead.location}` : null,
    `Call: ${lead.phone}`,
    lead.email,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }),
        signal: AbortSignal.timeout(10_000),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Twilio ${res.status}: ${detail.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return failed(err);
  }
}
