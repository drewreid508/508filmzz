import { createSign } from "node:crypto";
import { formatShootDate, type Lead } from "@/lib/inquiry";
import { failed, skipped, type ChannelResult } from "./types";

/**
 * Appends each lead to a Google Sheet.
 *
 * Uses a service-account JWT signed with node:crypto and the Sheets REST API,
 * so there's no `googleapis` dependency to drag into the bundle.
 *
 * Env: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID
 *      GOOGLE_SHEET_TAB (optional, defaults to "Leads")
 *
 * Remember to share the sheet with the service-account email as an Editor.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const b64url = (input: Buffer | string) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/** Cached across invocations on a warm lambda; tokens last an hour. */
let cached: { token: string; expiresAt: number } | null = null;

async function getAccessToken(email: string, privateKey: string) {
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: email,
      scope: SCOPE,
      aud: TOKEN_URL,
      exp: now + 3600,
      iat: now,
    })
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = b64url(signer.sign(privateKey));
  const assertion = `${header}.${claim}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    throw new Error(`Google token ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = {
    token: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return cached.token;
}

/** Column order — keep in sync with the sheet's header row. */
export const SHEET_HEADERS = [
  "Received",
  "Name",
  "Phone",
  "Email",
  "Service",
  "Budget",
  "Preferred Shoot Date",
  "Message",
  "Business Name",
  "Location",
  "Attachments",
];

export async function appendLeadToSheet(lead: Lead): Promise<ChannelResult> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const tab = process.env.GOOGLE_SHEET_TAB ?? "Leads";

  if (!email || !rawKey || !sheetId) {
    return skipped("Google Sheets is not configured");
  }

  // Env vars usually carry the key with literal \n sequences.
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const row = [
    lead.receivedAt,
    lead.name,
    lead.phone,
    lead.email,
    lead.projectType,
    lead.budget,
    formatShootDate(lead.shootDate),
    lead.message,
    lead.businessName || "",
    lead.location || "",
    lead.files.map((f) => f.name).join(", "),
  ];

  try {
    const token = await getAccessToken(email, privateKey);
    const range = encodeURIComponent(`${tab}!A:K`);

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append` +
        `?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [row] }),
        signal: AbortSignal.timeout(12_000),
      }
    );

    if (!res.ok) {
      // A stale cached token is the most likely 401 — drop it so the next
      // submission mints a fresh one.
      if (res.status === 401) cached = null;
      const detail = await res.text();
      return { ok: false, error: `Sheets ${res.status}: ${detail.slice(0, 300)}` };
    }
    return { ok: true };
  } catch (err) {
    cached = null;
    return failed(err);
  }
}
