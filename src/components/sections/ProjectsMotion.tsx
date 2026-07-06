"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

/**
 * PIN #2 — the flagship reveal. The single case study grows from 0.78 to
 * full presence under the scroll, then its details resolve. One project
 * must read as chosen, not lonely. Mobile: a single masked rise, no pin.
 */
export default function ProjectsMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      const flagship = ref.current.querySelector("[data-project-flagship]");
      const media = ref.current.querySelector("[data-project-media]");
      const details = ref.current.querySelectorAll("[data-project-detail]");
      const secondEntry = ref.current.querySelector("[data-project-second]");

      const mm = gsap.matchMedia(ref);

      if (flagship && media) {
        // Desktop: pinned scale-reveal
        mm.add("(min-width: 769px)", () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: flagship,
                start: "top top+=96",
                end: "+=120%",
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
              },
            })
            .fromTo(
              media,
              { scale: 0.78, yPercent: 6 },
              { scale: 1, yPercent: 0, ease: "none" }
            )
            .fromTo(
              details,
              { y: 24, opacity: 0 },
              { y: 0, opacity: 1, ease: "none", stagger: 0.08 },
              0.55
            );
        });

        // Mobile: one masked rise, video keeps playing via its observer
        mm.add("(max-width: 768px)", () => {
          gsap.fromTo(
            flagship,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: DUR.section,
              ease: EASE.out,
              scrollTrigger: { trigger: flagship, start: "top 80%", once: true },
            }
          );
        });
      }

      if (secondEntry) {
        gsap.fromTo(
          secondEntry,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: DUR.section,
            ease: EASE.out,
            scrollTrigger: { trigger: secondEntry, start: "top 85%", once: true },
          }
        );
      }
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
