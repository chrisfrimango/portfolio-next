"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AnimatedTitleProps {
  className?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ className }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const letterORef = useRef<HTMLSpanElement>(null);
  const letterERef = useRef<HTMLSpanElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [emoji, setEmoji] = useState("e");
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Check if desktop on mount and window resize
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // Consider 768px and above as desktop
    };
    
    // Initial check
    checkIfDesktop();
    
    // Add resize listener
    window.addEventListener('resize', checkIfDesktop);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  // Using just the peace sign emoji
  const peaceSignEmoji = "✌️"; // Peace sign emoji ✌️

  useEffect(() => {
    // Register the ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    if (!titleRef.current) return;

    // Immediate animation on page load instead of scroll trigger
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.5, 
        ease: "power1.out",
        delay: 0 // No delay for title to appear immediately
      }
    );
  }, []);

  useEffect(() => {
    if (!letterORef.current || !letterERef.current) return;

    // Only activate animations on desktop
    if (isDesktop) {
      if (isHovering) {
        // Set the peace sign emoji
        setEmoji(peaceSignEmoji);

        // Simple fade effect for the emoji - no rotation or scaling
        gsap.to(letterERef.current, {
          opacity: 1,
          duration: 0.2,
          ease: "power1.out",
        });
        // Change color to red and make bolder
        gsap.to(letterORef.current, {
          color: "#ff3b00",
          fontWeight: 700,
          duration: 0.2,
          ease: "power1.out",
        });

        // Create more energetic random movement
        // Using a timeline for more complex animation
        const tl = gsap.timeline({ repeat: -1 });

        // Random jumps in different directions
        tl.to(letterORef.current, {
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
        // Stop all animations and reset position and style
        gsap.killTweensOf(letterORef.current);
        gsap.killTweensOf(letterERef.current);

        gsap.to(letterORef.current, {
          y: 0,
          x: 0,
          rotation: 0,
          color: "inherit",
          fontWeight: "inherit",
          duration: 0.3,
          ease: "power2.out",
        });

        // Reset emoji back to 'e'
        setEmoji("e");
      }
    } else {
      // On mobile, always show the regular 'e' and reset any animations
      setEmoji("e");
      gsap.set(letterORef.current, {
        y: 0,
        x: 0,
        rotation: 0,
        color: "inherit",
        fontWeight: "inherit"
      });
    }
  }, [isHovering, peaceSignEmoji, isDesktop]);

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
