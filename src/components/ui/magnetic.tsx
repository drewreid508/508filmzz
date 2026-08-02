"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

const base =
  "relative inline-flex items-center justify-center gap-3 px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] transition-colors duration-500 select-none";

const variants: Record<Variant, string> = {
  solid: "bg-bone text-ink hover:bg-accent hover:text-white",
  outline:
    "border border-line-strong text-bone hover:border-accent hover:text-accent backdrop-blur-sm",
  ghost: "text-mute hover:text-bone",
};

/**
 * Magnetic button — the element leans toward the cursor and the label trails
 * it slightly, which gives the press a sense of weight.
 */
export function Magnetic({
  children,
  href,
  onClick,
  variant = "solid",
  className,
  wrapperClassName,
  strength = 0.32,
  type = "button",
  disabled,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  /** Applied to the magnetic wrapper — use for width/layout control. */
  wrapperClassName?: string;
  strength?: number;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setOffset({ x: x * strength, y: y * strength });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const inner = (
    <>
      <motion.span
        className="relative z-10 flex items-center gap-3"
        animate={{ x: offset.x * 0.28, y: offset.y * 0.28 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, mass: 0.5 }}
      >
        {children}
      </motion.span>
    </>
  );

  const classes = cn(base, variants[variant], disabled && "pointer-events-none opacity-40", className);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 160, damping: 15, mass: 0.6 }}
      className={cn("inline-block", wrapperClassName)}
      data-cursor="hover"
    >
      {href ? (
        <Link href={href} className={classes} aria-label={ariaLabel}>
          {inner}
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          className={classes}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}
