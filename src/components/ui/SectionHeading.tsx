"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

interface SectionHeadingProps {
  number: string;
  label: string;
}

/**
 * Editorial section marker: hairline rule, index number and label.
 * Revealed once when scrolled into view.
 */
export default function SectionHeading({ number, label }: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        rootRef.current,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DUR.element,
          ease: EASE.out,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="w-full mx-auto max-w-7xl xl:max-w-8xl 2xl:max-w-screen-2xl px-4 sm:px-8"
    >
      <div className="flex items-baseline gap-3 border-t border-brand-ink/15 pt-3">
        <span className="font-display italic text-brand-accent text-2xl leading-none">
          {number}
        </span>
        <span className="text-xs tracking-[0.25em] uppercase text-brand-gray">
          {label}
        </span>
      </div>
    </div>
  );
}
