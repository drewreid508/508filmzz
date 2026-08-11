import { cn } from "@/lib/utils";
import { Reveal, TextReveal } from "@/components/motion/reveal";

export function SectionHeader({
  id,
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  /**
   * Put the section's `aria-labelledby` target on this heading rather than
   * adding a second sr-only one — two headings per section makes a screen
   * reader announce the name twice, with different wording each time.
   */
  id?: string;
  index?: string;
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          {index && <span className="text-accent">{index}</span>}
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {eyebrow}
        </p>
      </Reveal>

      <h2
        id={id}
        className="display text-[13vw] leading-[0.86] sm:text-[9vw] md:text-[5.4vw]"
      >
        <TextReveal text={title} />
      </h2>

      {lead && (
        <Reveal delay={0.1}>
          <p className={cn("body-lg max-w-2xl", align === "center" && "mx-auto")}>
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
