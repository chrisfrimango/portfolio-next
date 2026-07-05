"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { EASE, DUR, prefersReducedMotion } from "@/lib/motion";

interface AnimationBoxProps {
  position?: "hero" | "about";
  className?: string;
  hoverText?: string;
}

export default function AnimationBox({
  position = "hero",
  className = "",
  hoverText = "Add, Commit, Push REPEAT",
}: AnimationBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      if (position === "hero") {
        // Entrance, then the bar reacts to scroll instead of idling:
        // it stretches and drifts as the hero scrolls away.
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
      } else {
        // Slide in animation for about section
        ScrollTrigger.create({
          trigger: boxRef.current,
          start: "top bottom-=100",
          onEnter: () => {
            gsap.fromTo(
              boxRef.current,
              { x: -100, opacity: 0, rotation: -5 },
              {
                x: 0,
                opacity: 1,
                rotation: 0,
                duration: DUR.section,
                ease: EASE.out,
              }
            );
          },
          once: true,
        });
      }
    },
    { scope: containerRef, dependencies: [position], revertOnUpdate: true }
  );

  return (
    <div
      ref={containerRef}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${
          position === "hero" ? "w-[10px] h-[100px]" : "w-[200px] h-[20px]"
        } bg-brand-accent shadow-lg ${className}`}
        ref={boxRef}
        aria-hidden="true"
      />
      {position === "hero" && (
        <div
          className={`absolute whitespace-nowrap text-brand-accent italic font-light text-sm transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          } left-6 top-1/2 -translate-y-1/2`}
        >
          {hoverText}
        </div>
      )}
    </div>
  );
}
