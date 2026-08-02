import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

import {
  inquirySchema,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  type Lead,
} from "@/lib/inquiry";
import { sendBookingSms } from "@/lib/notify/sms";
import { sendStudioEmail, sendClientConfirmation } from "@/lib/notify/email";
import { appendLeadToSheet } from "@/lib/notify/sheets";
import type { ChannelResult } from "@/lib/notify/types";
import { site } from "@/data/site";

export const runtime = "nodejs";

/** Small in-memory rate limit — enough to stop a naive flood. */
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > LIMIT;
}

/** Last-resort local copy so a lead is never lost while channels are down. */
async function persistLocally(lead: Lead, channels: Record<string, ChannelResult>) {
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "inquiries.jsonl"),
      JSON.stringify({ ...lead, channels }) + "\n",
      "utf8"
    );
    return true;
  } catch (err) {
    console.error("[booking] local persistence failed:", err);
    return false;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Try again in a few minutes." },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not read the submission." },
      { status: 400 }
    );
  }

  const parsed = inquirySchema.safeParse({
    name: form.get("name") ?? "",
    businessName: form.get("businessName") ?? "",
    email: form.get("email") ?? "",
    phone: form.get("phone") ?? "",
    projectType: form.get("projectType") ?? "",
    shootDate: form.get("shootDate") ?? "",
    location: form.get("location") ?? "",
    budget: form.get("budget") ?? "",
    message: form.get("message") ?? "",
    website: form.get("website") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  // Honeypot tripped — accept silently so the bot learns nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, saved: true });
  }

  // Validate attachments before doing any work.
  const files = form
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { ok: false, error: `Please attach no more than ${MAX_FILES} files.` },
      { status: 413 }
    );
  }
  let total = 0;
  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { ok: false, error: `"${file.name}" is larger than 8 MB.` },
        { status: 413 }
      );
    }
    total += file.size;
  }
  if (total > MAX_TOTAL_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Attachments total more than 20 MB." },
      { status: 413 }
    );
  }

  const { website, ...fields } = parsed.data;
  void website; // consumed by the honeypot check above
  const lead: Lead = {
    ...fields,
    files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    receivedAt: new Date().toISOString(),
  };

  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name,
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
    }))
  );

  /**
   * Every channel runs independently and none of them can throw, so a failed
   * SMS still sends both emails and still writes the row to the sheet.
   */
  const [sms, studioEmail, clientEmail, sheet] = await Promise.all([
    sendBookingSms(lead),
    sendStudioEmail(lead, attachments),
    sendClientConfirmation(lead),
    appendLeadToSheet(lead),
  ]);

  const channels = { sms, studioEmail, clientEmail, sheet };

  for (const [name, result] of Object.entries(channels)) {
    if (!result.ok && !result.skipped) {
      console.error(`[booking] ${name} failed:`, result.error);
    }
  }

  const savedLocally = await persistLocally(lead, channels);

  // The lead counts as captured if it reached the sheet, the studio inbox,
  // Drew's phone, or — failing all of those — the local log.
  const captured = sheet.ok || studioEmail.ok || sms.ok || savedLocally;

  if (!captured) {
    return NextResponse.json(
      {
        ok: false,
        error: `Something went wrong on my end. Please call ${site.phone} or email ${site.email} directly.`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    saved: true,
    // Surfaced so the confirmation page can tell the client whether to expect
    // an email — never used to hide a failure from the studio logs.
    confirmationEmailed: clientEmail.ok,
  });
}
