"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

/**
 * The restraint beat after two pins: Lab rows rise once as a list —
 * index leads its title by a breath. One trigger for the whole section.
 */
export default function LabMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      const intro = ref.current.querySelector("[data-lab-intro]");
      const rows = ref.current.querySelectorAll("[data-lab-row]");
      const outro = ref.current.querySelector("[data-lab-outro]");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top 80%",
            once: true,
          },
        })
        .fromTo(
          intro,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.element, ease: EASE.out }
        )
        .fromTo(
          rows,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DUR.element,
            ease: EASE.out,
            stagger: 0.09,
          },
          "-=0.3"
        )
        .fromTo(
          outro,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.element, ease: EASE.out },
          "-=0.3"
        );
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
