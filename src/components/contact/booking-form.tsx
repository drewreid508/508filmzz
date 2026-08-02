"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2 } from "lucide-react";

import { PROJECT_TYPES, BUDGETS, MAX_FILES, MAX_FILE_BYTES } from "@/lib/inquiry";
import { submitLead } from "@/lib/submit-lead";
import { site } from "@/data/site";
import { cn, pad } from "@/lib/utils";

type Status = "idle" | "sending" | "error";

const fieldBase =
  "w-full border-b border-line bg-transparent py-4 text-[0.95rem] text-bone placeholder:text-faint transition-colors duration-400 focus:border-accent focus:outline-none";

function Label({
  index,
  htmlFor,
  children,
}: {
  index: number;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="eyebrow mb-1 flex items-center gap-2.5">
      <span className="text-accent">{pad(index)}</span>
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-2 text-[0.72rem] tracking-wide text-accent">
      {message}
    </p>
  );
}

export function BookingForm() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().slice(0, 10);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const oversized = incoming.find((f) => f.size > MAX_FILE_BYTES);
    if (oversized) {
      setFormError(`"${oversized.name}" is larger than 8 MB.`);
      return;
    }
    setFormError(null);
    setFiles((prev) => [...prev, ...incoming].slice(0, MAX_FILES));
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});
    setFormError(null);

    const data = new FormData(event.currentTarget);

    try {
      const result = await submitLead(data, files);

      if (!result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        if (result.error) setFormError(result.error);
        setStatus("error");
        // Move focus to the first problem so keyboard users aren't stranded.
        const firstKey = result.fieldErrors && Object.keys(result.fieldErrors)[0];
        if (firstKey) document.getElementById(firstKey)?.focus();
        return;
      }

      const name = String(data.get("name") ?? "").trim();
      const params = new URLSearchParams();
      if (name) params.set("name", name.split(" ")[0]);
      if (result.confirmationEmailed) params.set("email", "1");
      router.push(`/contact/success?${params.toString()}`);
    } catch {
      setFormError(
        `Couldn't reach the server. Please call ${site.phone} or email ${site.email} directly.`
      );
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-12">
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="grid gap-8 md:grid-cols-2">
        <legend className="sr-only">Your details</legend>

        <div className="flex flex-col">
          <Label index={1} htmlFor="name">
            Name *
          </Label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your full name"
            className={fieldBase}
            aria-invalid={Boolean(errors.name)}
          />
          <FieldError message={errors.name} />
        </div>

        <div className="flex flex-col">
          <Label index={2} htmlFor="businessName">
            Business Name
          </Label>
          <input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            placeholder="Optional"
            className={fieldBase}
          />
        </div>

        <div className="flex flex-col">
          <Label index={3} htmlFor="email">
            Email Address *
          </Label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@business.com"
            className={fieldBase}
            aria-invalid={Boolean(errors.email)}
          />
          <FieldError message={errors.email} />
        </div>

        <div className="flex flex-col">
          <Label index={4} htmlFor="phone">
            Phone Number *
          </Label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="(000) 000-0000"
            className={fieldBase}
            aria-invalid={Boolean(errors.phone)}
          />
          <FieldError message={errors.phone} />
        </div>
      </fieldset>

      <fieldset className="grid gap-8 md:grid-cols-2">
        <legend className="sr-only">Project details</legend>

        <div className="flex flex-col">
          <Label index={5} htmlFor="projectType">
            Project Type *
          </Label>
          <select
            id="projectType"
            name="projectType"
            required
            defaultValue=""
            className={cn(fieldBase, "cursor-pointer")}
            aria-invalid={Boolean(errors.projectType)}
          >
            <option value="" disabled>
              Select a project type
            </option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t} className="bg-ink-2">
                {t}
              </option>
            ))}
          </select>
          <FieldError message={errors.projectType} />
        </div>

        <div className="flex flex-col">
          <Label index={6} htmlFor="shootDate">
            Preferred Shoot Date
          </Label>
          <input
            id="shootDate"
            name="shootDate"
            type="date"
            min={today}
            className={cn(fieldBase, "cursor-pointer [color-scheme:dark]")}
            aria-invalid={Boolean(errors.shootDate)}
          />
          <FieldError message={errors.shootDate} />
        </div>

        <div className="flex flex-col">
          <Label index={7} htmlFor="location">
            Location
          </Label>
          <input
            id="location"
            name="location"
            autoComplete="address-level2"
            placeholder="City, or the shop / property address"
            className={fieldBase}
          />
        </div>

        <div className="flex flex-col">
          <Label index={8} htmlFor="budget">
            Estimated Budget *
          </Label>
          <select
            id="budget"
            name="budget"
            required
            defaultValue=""
            className={cn(fieldBase, "cursor-pointer")}
            aria-invalid={Boolean(errors.budget)}
          >
            <option value="" disabled>
              Select a range
            </option>
            {BUDGETS.map((b) => (
              <option key={b} value={b} className="bg-ink-2">
                {b}
              </option>
            ))}
          </select>
          <FieldError message={errors.budget} />
        </div>
      </fieldset>

      <div className="flex flex-col">
        <Label index={9} htmlFor="message">
          Message *
        </Label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="The vehicle, the business, or the season — and what you want the finished piece to do."
          className={cn(fieldBase, "resize-none")}
          aria-invalid={Boolean(errors.message)}
        />
        <FieldError message={errors.message} />
      </div>

      {/* Uploads */}
      <div className="flex flex-col">
        <Label index={10} htmlFor="files">
          Reference Files
        </Label>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
          className="group mt-2 border border-dashed border-line p-8 text-center transition-colors duration-500 hover:border-accent"
        >
          <input
            ref={fileInput}
            type="file"
            multiple
            className="sr-only"
            id="files"
            onChange={(e) => addFiles(e.target.files)}
            accept="image/*,video/*,.pdf"
          />
          <label htmlFor="files" className="flex cursor-pointer flex-col items-center gap-3">
            <Upload
              size={20}
              strokeWidth={1.4}
              aria-hidden="true"
              className="text-faint transition-colors duration-500 group-hover:text-accent"
            />
            <span className="text-sm text-mute">
              Drop reference images or video here, or{" "}
              <span className="text-accent underline underline-offset-4">browse</span>
            </span>
            <span className="text-[0.66rem] tracking-[0.16em] text-faint uppercase">
              Up to {MAX_FILES} files — 5 MB each
            </span>
          </label>
        </div>

        <AnimatePresence>
          {files.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-col gap-2 overflow-hidden"
            >
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between border border-line px-4 py-3"
                >
                  <span className="truncate text-[0.8rem] text-mute">{file.name}</span>
                  <span className="ml-4 flex shrink-0 items-center gap-4">
                    <span className="text-[0.66rem] tracking-wide text-faint">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label={`Remove ${file.name}`}
                      className="text-faint transition-colors hover:text-accent"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {formError && (
        <p
          role="alert"
          className="border border-accent/40 bg-accent/8 px-5 py-4 text-sm text-accent"
        >
          {formError}
        </p>
      )}

      <div className="flex flex-col items-start gap-5 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-sm text-[0.72rem] leading-relaxed text-faint">
          Your details go straight to me — never shared, never added to a list.
        </p>

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex w-full items-center justify-center gap-3 bg-bone px-10 py-4 text-[0.72rem] font-medium tracking-[0.22em] text-ink uppercase transition-colors duration-500 hover:bg-accent hover:text-white disabled:pointer-events-none disabled:opacity-50 md:w-auto"
        >
          {status === "sending" ? (
            <>
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            "Book My Shoot"
          )}
        </button>
      </div>
    </form>
  );
}
