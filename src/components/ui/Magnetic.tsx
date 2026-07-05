"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, prefersReducedMotion } from "@/lib/motion";

interface MagneticProps {
  children: ReactNode;
  /** How strongly the element follows the cursor (0–1). */
  strength?: number;
  className?: string;
}

/**
 * Magnetic hover: the child is gently pulled toward the cursor and springs
 * back on leave. Only active on hover-capable devices with motion enabled.
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const element = ref.current;
      if (!element || !contextSafe) return;
      if (prefersReducedMotion()) return;
      if (!window.matchMedia("(hover: hover)").matches) return;

      const xTo = gsap.quickTo(element, "x", { duration: 0.4, ease: EASE.out });
      const yTo = gsap.quickTo(element, "y", { duration: 0.4, ease: EASE.out });

      const onMove = contextSafe((e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
      });

      const onLeave = contextSafe(() => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      });

      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);
      return () => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className ?? "inline-block"}>
      {children}
    </div>
  );
}
