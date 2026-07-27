"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface FlipHoverProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

/**
 * 3D flip-swap on hover: the front content rotates out downward while the
 * back copy drops in from above. Shared by nav links and the availability badge.
 */
export default function FlipHover({ front, back, className }: FlipHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLSpanElement>(null);
  const backRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const container = containerRef.current;
      const frontEl = frontRef.current;
      const backEl = backRef.current;
      if (!container || !frontEl || !backEl || !contextSafe) return;

      gsap.set(backEl, { y: -50, opacity: 0, rotationX: -90 });

      const onEnter = contextSafe(() => {
        gsap
          .timeline()
          .to(frontEl, {
            y: 50,
            opacity: 0,
            rotationX: 90,
            duration: 0.35,
            ease: "power2.in",
          })
          .to(
            backEl,
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 0.35,
              ease: "back.out(1.7)",
            },
            "-=0.15"
          );
      });

      const onLeave = contextSafe(() => {
        gsap
          .timeline()
          .to(backEl, {
            y: -50,
            opacity: 0,
            rotationX: -90,
            duration: 0.35,
            ease: "power2.in",
          })
          .to(
            frontEl,
            {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 0.35,
              ease: "back.out(1.7)",
            },
            "-=0.15"
          );
      });

      container.addEventListener("mouseenter", onEnter);
      container.addEventListener("mouseleave", onLeave);
      return () => {
        container.removeEventListener("mouseenter", onEnter);
        container.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden perspective-1000", className)}
    >
      <span ref={frontRef} className="relative inline-block backface-hidden">
        {front}
      </span>
      <span
        ref={backRef}
        className="absolute top-0 left-0 inline-block backface-hidden"
      >
        {back}
      </span>
    </div>
  );
}
