import { Magnetic } from "@/components/ui/magnetic";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[80svh] flex-col justify-center py-40">
      <p className="eyebrow mb-6 flex items-center gap-3">
        <span className="text-accent">404</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        Off frame
      </p>
      <h1 className="display text-[18vw] leading-[0.82] md:text-[10vw]">
        Nothing here<span className="text-accent">.</span>
      </h1>
      <p className="body-lg mt-8 max-w-md">
        That page doesn&apos;t exist — or it never made the final cut. Head back to the
        work.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Magnetic href="/" variant="solid">
          Home
        </Magnetic>
        <Magnetic href="/portfolio" variant="outline">
          View Portfolio
        </Magnetic>
      </div>
    </section>
  );
}
