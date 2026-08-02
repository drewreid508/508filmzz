import { site } from "@/data/site";
import { formatShootDate, type Lead } from "@/lib/inquiry";
import { failed, skipped, type ChannelResult } from "./types";

const ACCENT = "#1e90ff";
const INK = "#0a0a0a";

function esc(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #eaeaea;color:#767676;font-size:12px;letter-spacing:.12em;text-transform:uppercase;width:170px;vertical-align:top">${esc(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eaeaea;color:${INK};font-size:15px;vertical-align:top">${esc(value)}</td>
  </tr>`;
}

async function send(payload: Record<string, unknown>): Promise<ChannelResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return skipped("RESEND_API_KEY is not set");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });

    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${detail.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    return failed(err);
  }
}

const FROM = () =>
  process.env.CONTACT_FROM ?? `508 Filmzz <onboarding@resend.dev>`;

/** Full brief, delivered to the studio inbox. Replies go to the client. */
export async function sendStudioEmail(
  lead: Lead,
  attachments: { filename: string; content: string }[]
): Promise<ChannelResult> {
  const to = process.env.CONTACT_TO ?? site.email;

  const html = `<div style="background:#f6f6f6;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
    <div style="max-width:620px;margin:0 auto;background:#fff">
      <div style="background:${INK};padding:28px 32px">
        <p style="margin:0;color:#fff;font-size:20px;font-weight:700;letter-spacing:.06em">508 FILMZZ</p>
        <p style="margin:6px 0 0;color:${ACCENT};font-size:12px;letter-spacing:.22em;text-transform:uppercase">New booking request</p>
      </div>
      <div style="padding:28px 32px">
        <table style="width:100%;border-collapse:collapse">
          ${row("Name", lead.name)}
          ${lead.businessName ? row("Business", lead.businessName) : ""}
          ${row("Email", lead.email)}
          ${row("Phone", lead.phone)}
          ${row("Project type", lead.projectType)}
          ${row("Preferred date", formatShootDate(lead.shootDate))}
          ${lead.location ? row("Location", lead.location) : ""}
          ${row("Budget", lead.budget)}
          ${lead.files.length ? row("Attachments", lead.files.map((f) => f.name).join(", ")) : ""}
        </table>
        <p style="margin:26px 0 8px;color:#767676;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Message</p>
        <p style="margin:0;color:${INK};font-size:15px;line-height:1.65;white-space:pre-wrap">${esc(lead.message)}</p>
        <a href="tel:${site.phoneE164}" style="display:inline-block;margin-top:28px;background:${INK};color:#fff;padding:14px 26px;text-decoration:none;font-size:12px;letter-spacing:.2em;text-transform:uppercase">Call ${esc(lead.name)}</a>
      </div>
    </div>
  </div>`;

  return send({
    from: FROM(),
    to,
    reply_to: lead.email,
    subject: `New booking — ${lead.name} · ${lead.projectType}`,
    html,
    text: [
      `NEW BOOKING — 508 Filmzz`,
      ``,
      `Name:          ${lead.name}`,
      `Business:      ${lead.businessName || "—"}`,
      `Email:         ${lead.email}`,
      `Phone:         ${lead.phone}`,
      `Project type:  ${lead.projectType}`,
      `Preferred:     ${formatShootDate(lead.shootDate)}`,
      `Location:      ${lead.location || "—"}`,
      `Budget:        ${lead.budget}`,
      ``,
      lead.message,
      ``,
      lead.files.length ? `Attachments: ${lead.files.map((f) => f.name).join(", ")}` : "",
    ].join("\n"),
    attachments,
  });
}

/** Confirmation to the client so they know it landed. */
export async function sendClientConfirmation(lead: Lead): Promise<ChannelResult> {
  const html = `<div style="background:#f6f6f6;padding:32px 16px;font-family:Helvetica,Arial,sans-serif">
    <div style="max-width:620px;margin:0 auto;background:#fff">
      <div style="background:${INK};padding:36px 32px">
        <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:.06em">508 FILMZZ</p>
        <p style="margin:8px 0 0;color:${ACCENT};font-size:12px;letter-spacing:.22em;text-transform:uppercase">Request received</p>
      </div>
      <div style="padding:32px">
        <p style="margin:0 0 18px;color:${INK};font-size:19px;line-height:1.45">Thanks, ${esc(lead.name.split(" ")[0])} — I've got your request.</p>
        <p style="margin:0 0 18px;color:#444;font-size:15px;line-height:1.7">
          I read every enquiry personally and I'll get back to you as soon as possible with availability
          and a straight answer on what your project takes.
        </p>
        <p style="margin:0 0 8px;color:#767676;font-size:12px;letter-spacing:.12em;text-transform:uppercase">What you sent</p>
        <table style="width:100%;border-collapse:collapse">
          ${row("Project type", lead.projectType)}
          ${row("Preferred date", formatShootDate(lead.shootDate))}
          ${lead.location ? row("Location", lead.location) : ""}
          ${row("Budget", lead.budget)}
        </table>
        <p style="margin:26px 0 0;color:#444;font-size:15px;line-height:1.7">
          Need me sooner? Call or text <a href="tel:${site.phoneE164}" style="color:${ACCENT};text-decoration:none">${esc(site.phone)}</a>.
        </p>
        <p style="margin:30px 0 0;padding-top:22px;border-top:1px solid #eaeaea;color:#999;font-size:12px;line-height:1.7">
          508 Filmzz — ${esc(site.positioning)}<br>
          ${esc(site.location)} · ${esc(site.phone)} · ${esc(site.email)}
        </p>
      </div>
    </div>
  </div>`;

  return send({
    from: FROM(),
    to: lead.email,
    reply_to: process.env.CONTACT_TO ?? site.email,
    subject: "Your 508 Filmzz booking request",
    html,
    text: [
      `Thanks, ${lead.name.split(" ")[0]} — I've got your request.`,
      ``,
      `I read every enquiry personally and I'll get back to you as soon as possible`,
      `with availability and a straight answer on what your project takes.`,
      ``,
      `Project type:  ${lead.projectType}`,
      `Preferred:     ${formatShootDate(lead.shootDate)}`,
      lead.location ? `Location:      ${lead.location}` : "",
      `Budget:        ${lead.budget}`,
      ``,
      `Need me sooner? Call or text ${site.phone}.`,
      ``,
      `508 Filmzz — ${site.positioning}`,
      `${site.location} · ${site.phone} · ${site.email}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
