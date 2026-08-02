"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";

/**
 * The personalised part of the confirmation.
 *
 * On a static export there is no server to read the query string at request
 * time, so the name and the "we emailed you" flag are read in the browser. Both
 * are cosmetic — the page reads correctly with neither present.
 */
function Personalised() {
  const params = useSearchParams();

  // Only ever a first name, and only what the browser round-tripped back.
  const firstName = (params.get("name") ?? "")
    .replace(/[^\p{L}\p{M}'-]/gu, "")
    .slice(0, 40);
  const confirmationSent = params.get("email") === "1";

  return (
    <>
      <h1 className="display text-[14vw] leading-[0.84] sm:text-[11vw] md:text-[7vw]">
        {firstName ? `Thanks, ${firstName}.` : "Thanks."}
        <br />
        Message received.
      </h1>

      <Reveal delay={0.12}>
        <p className="body-lg mt-8 max-w-2xl text-pretty">
          I&apos;ve got your project details and I&apos;ll get back to you as soon as
          possible with availability and a straight answer on what it takes.
          {confirmationSent
            ? " A confirmation is on its way to your inbox."
            : " If you need me sooner, call or text — that's the fastest way to reach me."}
        </p>
      </Reveal>
    </>
  );
}

/** Prerender-safe shell: the static HTML ships the un-personalised copy. */
export function SuccessGreeting() {
  return (
    <Suspense
      fallback={
        <>
          <h1 className="display text-[14vw] leading-[0.84] sm:text-[11vw] md:text-[7vw]">
            Thanks.
            <br />
            Message received.
          </h1>
          <p className="body-lg mt-8 max-w-2xl text-pretty">
            I&apos;ve got your project details and I&apos;ll get back to you as soon as
            possible with availability and a straight answer on what it takes.
          </p>
        </>
      }
    >
      <Personalised />
    </Suspense>
  );
}
