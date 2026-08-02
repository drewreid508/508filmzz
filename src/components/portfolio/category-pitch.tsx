import { Reveal } from "@/components/motion/reveal";
import { pad } from "@/lib/utils";

/** Three-up capability strip beneath each category masthead. */
export function CategoryPitch({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <section className="shell pb-20 md:pb-28" aria-label="Capabilities">
      <div className="grid gap-px border-t border-l border-line bg-line md:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08} className="bg-ink p-8 md:p-10">
            <p className="eyebrow mb-6">{pad(i + 1)}</p>
            <h2 className="display text-2xl md:text-3xl">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{item.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
