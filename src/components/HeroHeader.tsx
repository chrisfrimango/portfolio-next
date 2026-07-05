"use client";

import Image from "next/image";
import AnimationBox from "./ui/AnimationBox";
import surfart from "../../public/images/surfart.webp";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { STAGGER, prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/components/intro/IntroContext";

const HEADLINE_WORDS = [
  "HEY!",
  "I'M",
  "FRIMAN,",
  "DEVELOPER",
  "&",
  "DIGITAL",
  "CONSULTANT",
  "WITH",
  "BUSINESS",
  "ACUMEN",
];

/**
 * Headline rendered as per-word masked spans: SSR-safe (full text in HTML),
 * revealed word by word after the preloader hands off. The first word is the
 * landing target for the preloader's flying "HEY!".
 */
function HeroHeadline({ className }: { className?: string }) {
  return (
    <h1 className={cn("font-display font-normal", className)}>
      {HEADLINE_WORDS.map((word, index) => (
        <span
          key={index}
          data-hero-word-mask={index}
          className="inline-block overflow-hidden align-bottom mr-[0.22em] pb-[0.06em]"
        >
          <span
            data-hero-word={index}
            className={cn(
              "hero-word inline-block",
              word === "FRIMAN," && "italic"
            )}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
}

export default function HeroHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { introDone } = useIntro();

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(
        ".hero-word",
        containerRef.current
      );
      if (words.length === 0) return;

      // Reduced motion: leave the SSR state (fully visible) untouched
      if (prefersReducedMotion()) {
        return;
      }

      if (!introDone) {
        // Hide behind the word masks until the preloader hands off
        gsap.set(words, { yPercent: 110 });
        return;
      }

      // Reveal. Word 0 is already placed by the preloader's landing word
      // (a no-op tween for it); the rest rise out of their masks.
      gsap.to(words, {
        yPercent: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: STAGGER.word,
      });

      // Subtle parallax: the image drifts as the hero scrolls away
      gsap.to(".hero-image", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef, dependencies: [introDone] }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden"
    >
      {/* Mobile view - full screen image and text below */}
      <div className="lg:hidden w-full h-full flex flex-col overflow-hidden">
        <div className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src={surfart}
            alt="Developer"
            fill
            className="hero-image object-cover object-top scale-110"
            priority
          />
        </div>
        {/* Mobile text below image */}
        <div className="min-h-[30vh] flex flex-col justify-between px-4 py-3">
          <HeroHeadline className="leading-[1.05] text-left text-3xl sm:text-5xl md:text-6xl mb-6 text-brand-ink" />

          {/* Animation box for mobile view - positioned to be partially visible outside viewport */}
          <div className="flex justify-center relative mb-2">
            <AnimationBox
              position="hero"
              className="cursor-pointer opacity-90 w-[10px] h-[50px] sm:w-[12px] sm:h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Desktop view - image positioned to the right */}
      <div className="hidden lg:block relative h-full">
        <div className="absolute top-0 right-0 w-[55vw] max-w-[800px] h-[80vh] overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src={surfart}
              alt="Developer"
              fill
              className="hero-image object-contain object-right"
              priority
            />
          </div>
        </div>

        {/* Desktop text at the bottom */}
        <div className="absolute bottom-10 left-0 right-0 px-4 z-10">
          <HeroHeadline className="leading-[1.02] text-left text-5xl xl:text-7xl 2xl:text-8xl max-w-full text-brand-ink" />

          {/* Animation box to entice scrolling - positioned partially outside viewport */}
          <div className="flex justify-center mt-8 sm:mt-0 absolute bottom-[-40px] left-0 right-0">
            <AnimationBox position="hero" className="cursor-pointer h-[80px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
