"use client";

import { capabilities } from "@/data/site";

/**
 * Infinite capability ticker. Duplicated track + CSS translate keeps it on the
 * compositor — no JS runs per frame.
 */
export function Marquee() {
  const items = [...capabilities, ...capabilities];

  return (
    <div
      className="relative overflow-hidden border-y border-line py-5"
      aria-label="Services offered"
    >
      <div className="flex w-max animate-[marquee_46s_linear_infinite] items-center gap-10 motion-reduce:animate-none">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10 whitespace-nowrap">
            <span className="text-[0.72rem] font-medium tracking-[0.24em] text-mute uppercase">
              {item}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          </span>
        ))}
      </div>

      {/* Edge fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent"
      />

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}
