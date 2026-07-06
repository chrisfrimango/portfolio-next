"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

interface SectionHeadingProps {
  number: string;
  label: string;
}

/**
 * Editorial section marker: the hairline rule draws itself from the left
 * while the index and label rise out of a mask. Revealed once per visit.
 */
export default function SectionHeading({ number, label }: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !rootRef.current) return;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        })
        .fromTo(
          ".heading-rule",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: DUR.section,
            ease: EASE.inOut,
            transformOrigin: "left center",
          }
        )
        .fromTo(
          ".heading-content",
          { yPercent: 110 },
          { yPercent: 0, duration: DUR.element, ease: EASE.out },
          "-=0.5"
        );
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="w-full mx-auto max-w-content px-5 sm:px-8 lg:px-12"
    >
      <div className="heading-rule h-px bg-brand-ink/15" />
      <div className="overflow-hidden pt-3">
        <div className="heading-content flex items-baseline gap-3">
          <span className="font-display italic text-brand-accent text-2xl leading-none">
            {number}
          </span>
          <span className="text-meta font-medium uppercase text-brand-gray">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
