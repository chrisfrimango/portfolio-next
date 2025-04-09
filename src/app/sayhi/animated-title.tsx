"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

interface AnimatedSayHiProps {
  className?: string;
}

const AnimatedSayHi: React.FC<AnimatedSayHiProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sayRef = useRef<HTMLSpanElement>(null);
  const hiRef = useRef<HTMLSpanElement>(null);
  const coffeeRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop on mount and window resize
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // Consider 768px and above as desktop
    };

    // Initial check
    checkIfDesktop();

    // Add resize listener
    window.addEventListener("resize", checkIfDesktop);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfDesktop);
  }, []);

  // Initialize GSAP animations
  useEffect(() => {
    // Set initial state
    if (sayRef.current && hiRef.current && coffeeRef.current) {
      gsap.set(coffeeRef.current, {
        opacity: 0,
        scale: 0.5,
        width: "0.1em", // Very narrow when not hovered
      });
    }
  }, []);

  // Handle hover animations - only on desktop
  useEffect(() => {
    if (!sayRef.current || !hiRef.current || !coffeeRef.current) return;

    // Only run animations on desktop
    if (isDesktop) {
      // Create separate animations for hover enter/leave to ensure complete state changes
      if (isHovered) {
        // When hovering, ensure animation plays to completion
        gsap.to(sayRef.current, { x: -40, duration: 0.4, ease: "power2.out" });
        gsap.to(hiRef.current, { x: 40, duration: 0.4, ease: "power2.out" });
        gsap.to(coffeeRef.current, {
          opacity: 1,
          scale: 1,
          width: "auto",
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        });
      } else {
        // When not hovering, ensure animation fully reverses
        gsap.to(sayRef.current, { x: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(hiRef.current, { x: 0, duration: 0.4, ease: "power2.out" });
        gsap.to(coffeeRef.current, {
          opacity: 0,
          scale: 0.5,
          width: "0.1em",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    } else {
      // On mobile, reset all elements to their default state
      gsap.set(sayRef.current, { x: 0 });
      gsap.set(hiRef.current, { x: 0 });
      gsap.set(coffeeRef.current, { opacity: 0, scale: 0.5 });
    }

    return () => {
      // Cleanup all animations
      gsap.killTweensOf([sayRef.current, hiRef.current, coffeeRef.current]);
    };
  }, [isHovered, isDesktop]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => isDesktop && setIsHovered(false)}
    >
      <div className="flex items-center justify-center relative">
        <span
          ref={sayRef}
          className="text-[#ff3b00] font-bold uppercase inline-block"
        >
          say
        </span>
        <div
          ref={coffeeRef}
          className="mx-1 text-[#ff3b00] opacity-0"
          aria-hidden="true"
          style={{
            width: isHovered && isDesktop ? "auto" : "0.1em",
            overflow: "hidden",
          }}
        >
          {/* Coffee cup emoji */}
          <span className="text-2xl sm:text-4xl">☕</span>
        </div>
        <span
          ref={hiRef}
          className="text-[#ff3b00] font-bold uppercase inline-block"
        >
          hi!
        </span>
      </div>
    </div>
  );
};

export default AnimatedSayHi;
