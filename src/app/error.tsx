"use client";

import { useEffect } from "react";

import { Magnetic } from "@/components/ui/magnetic";
import { site } from "@/data/site";

/**
 * Route-level error boundary. Catches render/data errors inside <main> while
 * keeping the header, footer, and navigation intact — a broken project page
 * should never strand someone on a dead screen with no way out.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side details are redacted in production; `digest` is the only
    // handle that ties this render back to the server log.
    console.error("Route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center py-40">
      <p className="eyebrow mb-6 flex items-center gap-3">
        <span className="text-accent">Error</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        Something broke
      </p>

      <h1 className="display text-[16vw] leading-[0.82] md:text-[9vw]">
        Bad take<span className="text-accent">.</span>
      </h1>

      <p className="body-lg mt-8 max-w-md">
        Something went wrong loading this page. Try again — and if it keeps
        happening, call or text and I&apos;ll sort it out directly.
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        {/* Magnetic renders a <button> when it has no href — do not wrap it. */}
        <Magnetic onClick={reset} variant="solid">
          Try again
        </Magnetic>
        <Magnetic href="/" variant="outline">
          Home
        </Magnetic>
        <Magnetic href={`tel:${site.phoneE164}`} variant="outline">
          {site.phone}
        </Magnetic>
      </div>

      {error.digest && (
        <p className="mt-10 text-[0.7rem] tracking-[0.16em] text-faint uppercase">
          Reference {error.digest}
        </p>
      )}
    </section>
  );
}
