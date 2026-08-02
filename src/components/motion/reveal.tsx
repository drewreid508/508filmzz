"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Blur-and-lift reveal. The blur is what makes it read as expensive — a plain
 * fade+translate looks like a template.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  blur = 12,
  once = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span" | "article";
}) {
  const reduced = useReducedMotion();
  const M = motion[Tag] as typeof motion.div;

  if (reduced) return <Tag className={className}>{children}</Tag>;

  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

/** Staggers direct children through the same reveal. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const parent: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };

  return (
    <motion.div
      className={className}
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export const revealChild: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
};

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div variants={revealChild} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Word-by-word display type reveal. Splits on spaces and masks each word so the
 * line "wipes" up rather than fading in as a block.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.055,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <span className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "108%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
