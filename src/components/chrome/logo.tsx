import { cn } from "@/lib/utils";

/**
 * Wordmark: "508" set solid, "FILMZZ" outlined, wrapped in the viewfinder
 * bracket motif that repeats across the site.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("group/logo inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="relative block h-[1.15em] w-[1.15em] shrink-0"
      >
        <span className="absolute top-0 left-0 h-[38%] w-[38%] border-t border-l border-accent" />
        <span className="absolute right-0 bottom-0 h-[38%] w-[38%] border-r border-b border-accent" />
        <span className="absolute top-1/2 left-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </span>
      {/*
        The space between "508" and "Filmzz" is a real space character, not a
        margin. Wrapping links carry aria-label="508 Filmzz — home", and WCAG
        2.5.3 requires the accessible name to contain the visible text — with a
        margin instead of a space the DOM read "508Filmzz" and failed the check.
      */}
      <span className="display leading-none tracking-[0.01em]">
        <span className="text-bone">508</span>{" "}
        <span
          className="text-transparent"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.65)" }}
        >
          Filmzz
        </span>
      </span>
    </span>
  );
}
