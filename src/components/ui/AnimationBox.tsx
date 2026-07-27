"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

interface AnimationBoxProps {
  className?: string;
  hoverText?: string;
}

/**
 * The accent bar in the hero: enters once, then reacts to scroll —
 * it stretches and drifts as the hero scrolls away. No idle motion.
 */
export default function AnimationBox({
  className = "",
  hoverText = "Add, Commit, Push REPEAT",
}: AnimationBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        boxRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: DUR.element, ease: EASE.out }
      );

      gsap.to(boxRef.current, {
        y: 80,
        scaleY: 2.2,
        rotation: 8,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          end: "top -20%",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`w-[10px] h-[100px] bg-brand-accent shadow-lg ${className}`}
        ref={boxRef}
        aria-hidden="true"
      />
      <div
        className={`absolute whitespace-nowrap text-brand-accent italic font-light text-sm transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        } left-6 top-1/2 -translate-y-1/2`}
      >
        {hoverText}
      </div>
    </div>
  );
}
