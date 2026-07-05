"use client";

import React, { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AnimatedTitleProps {
  className?: string;
}

// Using just the peace sign emoji
const PEACE_SIGN_EMOJI = "✌️";

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ className }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const letterORef = useRef<HTMLSpanElement>(null);
  const letterERef = useRef<HTMLSpanElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [emoji, setEmoji] = useState("e");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Entrance animation
  useGSAP(
    () => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }
      );
    },
    { scope: titleRef }
  );

  // Hover: the "o" jumps around and the "e" becomes a peace sign (desktop only)
  useGSAP(
    () => {
      if (!letterORef.current || !letterERef.current) return;

      if (isDesktop && isHovering) {
        setEmoji(PEACE_SIGN_EMOJI);

        gsap.to(letterERef.current, {
          opacity: 1,
          duration: 0.2,
          ease: "power1.out",
        });
        gsap.to(letterORef.current, {
          color: "#ff3b00",
          fontWeight: 700,
          duration: 0.2,
          ease: "power1.out",
        });

        // Energetic random jumps in different directions
        gsap
          .timeline({ repeat: -1 })
          .to(letterORef.current, {
            y: "-=20",
            x: "+=5",
            rotation: 5,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(letterORef.current, {
            y: "+=20",
            x: "-=3",
            rotation: -3,
            duration: 0.4,
            ease: "bounce.out",
          })
          .to(letterORef.current, {
            y: "-=4",
            x: "-=2",
            rotation: 0,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
      } else {
        setEmoji("e");
        gsap.killTweensOf([letterORef.current, letterERef.current]);
        gsap.to(letterORef.current, {
          y: 0,
          x: 0,
          rotation: 0,
          color: "inherit",
          fontWeight: "inherit",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    { scope: titleRef, dependencies: [isHovering, isDesktop] }
  );

  return (
    <h1
      ref={titleRef}
      className={className}
      onMouseEnter={() => isDesktop && setIsHovering(true)}
      onMouseLeave={() => isDesktop && setIsHovering(false)}
    >
      S
      <span
        ref={letterERef}
        className="inline-block"
        style={{ position: "relative" }}
      >
        {emoji}
      </span>
      lected{" "}
      <span className="italic font-light">
        w
        <span
          ref={letterORef}
          className="inline-block"
          style={{ position: "relative" }}
        >
          o
        </span>
        rks
      </span>
    </h1>
  );
};

export default AnimatedTitle;
