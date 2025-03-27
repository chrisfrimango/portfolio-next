"use client";

import { TypewriterEffect } from "@/components/ui/aceternity/typewriter-effect";
import Image, { StaticImageData } from "next/image";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect, useCallback } from "react";

interface HeroHeaderProps {
  imageUrl: StaticImageData;
  words: string[];
}

// Component for the main heading text that can have parts colored differently
const ColoredText = ({
  text,
  imageRef,
}: {
  text: string;
  imageRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [coloredChars, setColoredChars] = useState<boolean[]>([]);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Setup refs array for each character
  useEffect(() => {
    charRefs.current = Array(text.length).fill(null);
  }, [text]);

  // Function to calculate which characters overlap with the image - wrapped in useCallback to prevent recreation on every render
  const calculateOverlaps = useCallback(() => {
    if (!imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const newColoredChars = charRefs.current.map((charRef) => {
      if (!charRef) return false;

      const charRect = charRef.getBoundingClientRect();

      // Calculate how much of the character overlaps with the image
      const overlapWidth =
        Math.min(charRect.right, imageRect.right) -
        Math.max(charRect.left, imageRect.left);
      const overlapHeight =
        Math.min(charRect.bottom, imageRect.bottom) -
        Math.max(charRect.top, imageRect.top);

      // Only consider it an overlap if a significant portion of the character overlaps
      // (at least 30% of the character's width - reduced from 40%)
      const isOverlapping =
        overlapWidth > 0 &&
        overlapHeight > 0 &&
        overlapWidth > charRect.width * 0.3;

      return isOverlapping;
    });

    setColoredChars(newColoredChars);
  }, [imageRef, charRefs]);

  // Initial calculation and setup resize listener
  useEffect(() => {
    // Small delay to ensure layout is complete
    const timer = setTimeout(() => {
      calculateOverlaps();
    }, 100);

    // Add resize listener to recalculate on window size changes
    window.addEventListener("resize", calculateOverlaps);

    // Cleanup
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateOverlaps);
    };
  }, [calculateOverlaps]);

  // Use GSAP for smoother animations when changing colors
  useGSAP(() => {
    calculateOverlaps();
  }, []);

  return (
    <>
      {text.split("").map((char, index) => (
        <span
          key={index}
          ref={(el) => {
            charRefs.current[index] = el;
          }}
          className={`text-black sm:text-inherit ${
            coloredChars[index] ? "sm:text-white" : ""
          }`}
        >
          {char}
        </span>
      ))}
    </>
  );
};

export default function HeroHeader({ imageUrl, words }: HeroHeaderProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="flex justify-center w-full mb-0 sm:mb-10 pt-10 mt-[-30px] sm:mt-0">
        <h3 className="text-[#ff3b00] italic font-light text-4xl sm:text-5xl mb-2 sm:mb-5 z-10">
          Hey!
        </h3>
      </div>

      <div className="flex flex-col justify-start sm:justify-center sm:max-w-[850px] sm:h-[600px] relative px-4 sm:px-0 pt-10">
        <div
          ref={imageRef}
          className="absolute aspect-square shadow-xl right-0 sm:right-0 top-10 sm:top-0 z-0 hidden sm:block sm:w-[450px] sm:h-[550px]"
        >
          <Image
            src={imageUrl}
            alt="Developer"
            fill
            quality={100}
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-4xl sm:text-7xl font-bold z-10 flex flex-col gap-1">
          <div className="text-black sm:text-inherit">
            <TypewriterEffect words={words} />
          </div>
          <div className="flex flex-col space-y-4">
            <div className="leading-[1.1]">
              <ColoredText
                text="DEVELOPER WITH A GROWTH MINDSET"
                imageRef={imageRef}
              />
            </div>
            <div>
              <ColoredText text="AND BUSINESS SAVVY." imageRef={imageRef} />
            </div>
          </div>
        </h1>
      </div>
    </>
  );
}
