import { cn } from "@/lib/utils";
import { getMedia, largest, srcSet } from "@/lib/media";

type FrameProps = {
  /** Media id from the generated manifest. */
  id: string;
  alt: string;
  /** Responsive `sizes` attribute. Defaults to full viewport width. */
  sizes?: string;
  className?: string;
  imgClassName?: string;
  /** Skip lazy-loading for above-the-fold art. */
  priority?: boolean;
  /** Lock the box to a ratio (e.g. 4/5) and cover-crop into it. */
  ratio?: number;
};

/**
 * The single image primitive for the whole site.
 *
 * Every source is pre-encoded at build time into an AVIF + WebP ladder, so this
 * ships a plain <picture> — no runtime optimisation, no layout shift, and an
 * inlined LQIP behind the image so the box is never empty.
 */
export function Frame({
  id,
  alt,
  sizes = "100vw",
  className,
  imgClassName,
  priority = false,
  ratio,
}: FrameProps) {
  const asset = getMedia(id);
  const fallback = largest(asset);

  return (
    <div
      className={cn("relative overflow-hidden bg-ink-2", className)}
      style={{
        aspectRatio: ratio ?? asset.aspect,
        backgroundImage: `url(${asset.lqip})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet(asset, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(asset, "webp")} sizes={sizes} />
        <img
          src={fallback.webp}
          alt={alt}
          width={asset.width}
          height={asset.height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
      </picture>
    </div>
  );
}
