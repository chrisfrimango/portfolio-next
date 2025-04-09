"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

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
  const boxRef = useRef(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Dynamically import ScrollTrigger
    const initAnimation = async () => {
      const ScrollTriggerModule = await import("gsap/ScrollTrigger");
      const { ScrollTrigger } = ScrollTriggerModule;

      // Register the plugin
      gsap.registerPlugin(ScrollTrigger);

      // Create a new timeline
      const tl = gsap.timeline();
      timeline.current = tl;

      // Different animation based on position
      if (position === "hero") {
        // Initial fade in from zero opacity
        tl.fromTo(
          boxRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
        )

          // Then start the continuous bounce animation with more movement
          .fromTo(
            boxRef.current,
            { y: -15 }, // Start higher up for more movement
            {
              y: 15, // Move further down
              duration: 1.2,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
            },
            ">" // Start immediately after fade-in
          );

        // Add more dramatic rotation
        gsap.to(boxRef.current, {
          rotation: 12, // More rotation
          duration: 2.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.4, // Slight delay for the rotation to start
        });

        // Add subtle horizontal movement
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
    };

    // Initialize animations
    initAnimation();

    // Cleanup
    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, [position]); // Re-run if position changes

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`${
          position === "hero" ? "w-[10px] h-[100px]" : "w-[200px] h-[20px]"
        } bg-[#ff3b00] shadow-lg ${className}`}
        ref={boxRef}
        aria-hidden="true"
      />
      {position === "hero" && (
        <div
          className={`absolute whitespace-nowrap text-[#ff3b00] italic font-light text-sm transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          } ${
            position === "hero"
              ? "left-6 top-1/2 -translate-y-1/2"
              : "top-6 left-1/2 -translate-x-1/2"
          }`}
        >
          {hoverText}
        </div>
      )}
    </div>
  );
}
