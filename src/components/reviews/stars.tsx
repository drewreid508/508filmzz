import { Star } from "lucide-react";

export function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          aria-hidden="true"
          strokeWidth={0}
          className={i < rating ? "fill-accent" : "fill-white/14"}
        />
      ))}
    </span>
  );
}
