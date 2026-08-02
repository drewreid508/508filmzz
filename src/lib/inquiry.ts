import { z } from "zod";

export const PROJECT_TYPES = [
  "Automotive",
  "Business Advertisement",
  "Commercial",
  "Social Media Content",
  "Drone",
  "Photography",
  "Hunting & Outdoor",
  "Product Launch",
  "Monthly Content",
  "Other",
] as const;

export const BUDGETS = [
  "Under $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet",
] as const;

/*
 * Attachment limits.
 *
 * Sized for the Google Apps Script endpoint rather than a Node server: files
 * travel base64-encoded inside the JSON body, which inflates them by about a
 * third, and Apps Script is far less forgiving about large payloads.
 */
export const MAX_FILES = 3;
export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB each
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024;

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
  files: { name: string; size: number; type: string }[];
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
