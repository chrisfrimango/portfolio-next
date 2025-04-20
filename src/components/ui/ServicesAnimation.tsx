"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface ServicesAnimationProps {
  isVisible: boolean;
  onClose: () => void;
}

const ServicesAnimation: React.FC<ServicesAnimationProps> = ({
  isVisible,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ paused: true });

    // Initial state - off screen to the right
    gsap.set(containerRef.current, {
      x: "100%",
      opacity: 0,
    });

    // Animation to bring it in
    tl.to(containerRef.current, {
      x: "0%",
      opacity: 1,
      duration: 0.5,
      ease: "power3.out",
    });

    if (isVisible) {
      tl.play();
    } else {
      // Animation to take it out
      gsap.to(containerRef.current, {
        x: "100%",
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }

    return () => {
      tl.kill();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed top-[80px] right-0 bg-[#ff3b00] text-white p-6 rounded-l-lg shadow-lg z-50 max-w-[300px]"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white hover:text-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18" />
          <path d="M6 6L18 18" />
        </svg>
      </button>
      <h3 className="text-xl font-bold mb-4">Open for assignments within:</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <span className="mr-2">•</span>
          <span>Web Development</span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          <span>Frontend Development</span>
        </li>
        <li className="flex items-center">
          <span className="mr-2">•</span>
          <span>
            I’m open to developer roles as well as hybrid positions that combine
            technical work with strategic, business-oriented challenges.
          </span>
        </li>
      </ul>
      <button
        onClick={() => {
          document
            .getElementById("sayhi")
            ?.scrollIntoView({ behavior: "smooth" });
          onClose();
        }}
        className="mt-6 border border-white px-4 py-2 rounded-3xl text-sm hover:bg-white hover:text-[#ff3b00] transition-colors"
      >
        GET IN TOUCH
      </button>
    </div>
  );
};

export default ServicesAnimation;
