"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

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
      if (position === "hero") {
        // Initial fade in, then continuous bounce
        gsap
          .timeline()
          .fromTo(
            boxRef.current,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
          )
          .fromTo(
            boxRef.current,
            { y: -15 },
            {
              y: 15,
              duration: 1.2,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            },
            ">"
          );

        gsap.to(boxRef.current, {
          rotation: 12,
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4,
        });

        gsap.to(boxRef.current, {
          x: 8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.2,
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
                duration: 0.8,
                ease: "power2.out",
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
