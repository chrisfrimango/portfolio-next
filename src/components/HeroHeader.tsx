"use client";

import AnimationBox from "./ui/AnimationBox";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/components/intro/IntroContext";

const HEADLINE_WORDS = [
  "Hey!",
  "I'm",
  "Friman,",
  "developer",
  "&",
  "digital",
  "consultant",
  "with",
  "business",
  "acumen.",
];

/**
 * Headline rendered as per-word masked spans: SSR-safe (full text in HTML),
 * revealed word by word after the preloader hands off. The first word is the
 * landing target for the preloader's flying "Hey!".
 */
function HeroHeadline({ className }: { className?: string }) {
  return (
    <h1 className={cn("font-display", className)}>
      {HEADLINE_WORDS.map((word, index) => (
        <span
          key={index}
          data-hero-word-mask={index}
          className="inline-block overflow-hidden align-bottom mr-[0.2em] pb-[0.08em]"
        >
          <span
            data-hero-word={index}
            className={cn(
              "hero-word inline-block",
              word === "Friman," && "italic text-brand-accent"
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
      // Reduced motion: leave the SSR state (fully visible) untouched, just
      // make sure the meta lines (opacity-0 in markup) are shown.
      if (prefersReducedMotion()) {
        gsap.set(".hero-meta", { opacity: 1, y: 0 });
        return;
      }

      // Until the preloader hands off, do NOTHING to the headline. It stays
      // exactly as server-rendered (fully painted) so it can be the LCP
      // element without waiting on JS — the opaque preloader curtain covers
      // it, then lifts to reveal it. No JS transform gates the paint.
      if (!introDone) return;

      const words = gsap.utils.toArray<HTMLElement>(
        ".hero-word",
        containerRef.current
      );

      // Meta lines fade up under the headline as the curtain lifts
      gsap.fromTo(
        ".hero-meta",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.2,
        }
      );

      // Exit: conducted by the scroll — words dissolve last-word-first
      // through their masks as the hero scrolls away.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(
          words,
          {
            yPercent: -70,
            opacity: 0,
            ease: "none",
            stagger: { each: 0.03, from: "end" },
          },
          0
        )
        .to(".hero-meta", { opacity: 0, y: -20, ease: "none" }, 0);
    },
    { scope: containerRef, dependencies: [introDone] }
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden flex flex-col justify-between px-6 lg:px-12 pt-28 pb-10"
    >
      {/* The headline is the whole stage — anchored low like a printed cover.
          No eyebrow labels: the giant type carries the frame on its own. */}
      <div className="relative z-10 flex-1 flex items-end">
        <HeroHeadline className="text-[clamp(2.5rem,0.5rem+6.6vw,7rem)] leading-[0.98] tracking-[-0.02em] text-left text-brand-ink max-w-[16ch]" />
      </div>

      {/* Minimal scroll cue — just the accent bar, no label */}
      <div className="relative z-10">
        <div className="hero-meta opacity-0">
          <AnimationBox className="cursor-pointer h-[52px]" />
        </div>
      </div>
    </div>
  );
}
