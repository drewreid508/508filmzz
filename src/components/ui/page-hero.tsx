import { Reveal, TextReveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/** Standard interior-page masthead. Keeps every non-home page in one rhythm. */
export function PageHero({
  eyebrow,
  title,
  lead,
  index,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  index?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className={cn("shell pt-36 pb-12 md:pt-52 md:pb-16", className)}>
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          {index && <span className="text-accent">{index}</span>}
          <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
          {eyebrow}
        </p>
      </Reveal>

      <h1 className="display mt-7 text-[16vw] leading-[0.84] sm:text-[12vw] md:text-[8vw]">
        <TextReveal text={title} />
      </h1>

      {lead && (
        <Reveal delay={0.12}>
          <p className="body-lg mt-8 max-w-2xl text-pretty">{lead}</p>
        </Reveal>
      )}

      {children}
    </header>
  );
}
