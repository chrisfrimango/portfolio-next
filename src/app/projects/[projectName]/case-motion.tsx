"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

/**
 * Case study choreography: header cascade on arrival, one scrubbed video
 * parallax, masked editorial reveals per section. No pins on this route.
 */
export default function CaseMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return;

      // Header cascade on arrival
      const headerItems = ref.current.querySelectorAll("[data-case-header] > *");
      gsap.fromTo(
        headerItems,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: DUR.section,
          ease: EASE.out,
          stagger: 0.08,
        }
      );

      // The one scrub: video parallax inside its masked frame
      const videoFrame = ref.current.querySelector("[data-case-video]");
      const video = videoFrame?.querySelector("video");
      if (videoFrame && video) {
        gsap.fromTo(
          video,
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: "none",
            scrollTrigger: {
              trigger: videoFrame,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Editorial section reveals
      ref.current
        .querySelectorAll<HTMLElement>("[data-case-section]")
        .forEach((section) => {
          gsap.fromTo(
            section,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: DUR.section,
              ease: EASE.out,
              scrollTrigger: { trigger: section, start: "top 85%", once: true },
            }
          );
        });
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
