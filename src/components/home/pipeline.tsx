import { Reveal } from "@/components/motion/reveal";
import { contentPipeline } from "@/data/site";

/**
 * The chain between hiring me and having something to post.
 *
 * ── Why it reads down on a phone and across on a desktop ───────────────────
 * Five stages side by side at 375px gives each one about sixty pixels, which
 * turns single words into two stacked lines and the arrows into noise. Stacked,
 * each stage gets a full row and the arrow between them does the work an arrow
 * is supposed to do — say "and then". The markup is one list either way; only
 * the direction of the flex and the rotation of the marker change.
 *
 * The final stage is the accent colour because it is the only one the customer
 * actually receives. The four before it are what they are paying for without
 * ever seeing, which is the entire point of showing the chain at all.
 */
export function Pipeline() {
  return (
    <ol className="flex flex-col items-stretch gap-0 sm:flex-row sm:items-center">
      {contentPipeline.map((stage, i) => {
        const last = i === contentPipeline.length - 1;
        return (
          <Reveal
            key={stage}
            delay={i * 0.07}
            className="flex flex-col items-center sm:flex-1 sm:flex-row"
          >
            <li
              className={`flex w-full items-center justify-center border px-4 py-4 text-center text-[0.68rem] font-medium tracking-[0.16em] uppercase sm:min-h-[5.5rem] ${
                last
                  ? "border-accent text-accent"
                  : "border-line text-mute"
              }`}
            >
              {stage}
            </li>

            {!last && (
              <span
                aria-hidden="true"
                className="flex h-7 w-full shrink-0 items-center justify-center text-faint sm:h-auto sm:w-9"
              >
                {/* Down between stacked rows, right between columns. */}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 10 10"
                  fill="none"
                  className="rotate-90 sm:rotate-0"
                >
                  <path
                    d="M1 5h7M5.5 1.5 9 5l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </span>
            )}
          </Reveal>
        );
      })}
    </ol>
  );
}
