import {
  inquirySchema,
  MAX_FILES,
  MAX_FILE_BYTES,
  MAX_TOTAL_BYTES,
  type Inquiry,
} from "@/lib/inquiry";

/**
 * Where the booking form posts.
 *
 * GitHub Pages serves static files only, so there is no API route. A Google
 * Apps Script web app receives the lead instead and fans it out to the Sheet,
 * both emails, and Twilio. Set NEXT_PUBLIC_FORM_ENDPOINT to the script's
 * deployment URL — see docs/GITHUB-PAGES.md.
 *
 * The endpoint is public by necessity: any browser-submitted form exposes its
 * destination. All credentials live inside the script, never here.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export type SubmitResult =
  | { ok: true; confirmationEmailed: boolean }
  | { ok: false; fieldErrors?: Record<string, string>; error?: string };

export type LeadFile = { name: string; type: string; size: number; data: string };

/** Reads a File into the base64 payload the script expects. */
function readFile(file: File): Promise<LeadFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`));
    reader.onload = () => {
      const result = String(reader.result);
      // Strip the "data:<mime>;base64," prefix — the script wants raw base64.
      resolve({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        data: result.slice(result.indexOf(",") + 1),
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validates and submits a booking.
 *
 * Validation runs here because a static site has no server to do it. The script
 * validates again — never trust the client — but doing it first means the user
 * sees field errors instantly instead of after a round trip.
 */
export async function submitLead(
  form: FormData,
  files: File[]
): Promise<SubmitResult> {
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

  // Re-check attachments here too; the picker enforces these, but a paste or a
  // drop can slip past it.
  if (files.length > MAX_FILES) {
    return { ok: false, error: `Please attach no more than ${MAX_FILES} files.` };
  }
  const oversized = files.find((f) => f.size > MAX_FILE_BYTES);
  if (oversized) {
    return { ok: false, error: `"${oversized.name}" is larger than 5 MB.` };
  }
  if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) {
    return { ok: false, error: "Attachments total more than 10 MB." };
  }

  const payload: Inquiry & { files: LeadFile[] } = {
    ...parsed.data,
    files: await Promise.all(files.map(readFile)),
  };

  /*
   * `text/plain` keeps this a CORS "simple request", so the browser skips the
   * preflight OPTIONS call. Apps Script cannot answer a preflight, so a JSON
   * content-type here would fail before the request ever left the browser.
   * The script reads the raw body and parses it as JSON.
   */
  const res = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!res.ok) {
    return { ok: false, error: `The server responded with ${res.status}.` };
  }

  const json = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string; confirmationEmailed?: boolean }
    | null;

  if (!json?.ok) {
    return { ok: false, error: json?.error ?? "Something went wrong on my end." };
  }

  return { ok: true, confirmationEmailed: Boolean(json.confirmationEmailed) };
}
