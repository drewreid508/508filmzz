"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { services } from "@/data/site";
import { pad } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Service grid. Hovering lifts the row and floods it with a soft blue wash —
 * the "glass hover" treatment used consistently across interactive surfaces.
 */
export function Services() {
  const [hovered, setHovered] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <div className="grid border-t border-line md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, i) => {
        const isActive = hovered === service.id;
        return (
          <motion.div
            key={service.id}
            onMouseEnter={() => setHovered(service.id)}
            onMouseLeave={() => setHovered(null)}
            initial={reduced ? false : { opacity: 0, y: 26 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
            className="group relative border-r border-b border-line p-8 md:p-10 lg:p-12"
          >
            {/* Glass wash */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 h-px w-0 bg-accent transition-all duration-700 group-hover:w-full"
            />

            <div className="relative">
              <div className="mb-8 flex items-start justify-between">
                <span className="eyebrow">{pad(i + 1)}</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                    isActive ? "scale-150 bg-accent" : "bg-line-strong"
                  }`}
                  aria-hidden="true"
                />
              </div>

              <h3 className="display text-3xl leading-none md:text-4xl">
                {service.title}
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-mute">{service.blurb}</p>

              <ul className="mt-7 flex flex-col gap-2">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-3 text-[0.7rem] tracking-[0.14em] text-faint uppercase"
                  >
                    <span
                      className="h-px w-4 bg-line-strong transition-all duration-500 group-hover:w-7 group-hover:bg-accent"
                      aria-hidden="true"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
