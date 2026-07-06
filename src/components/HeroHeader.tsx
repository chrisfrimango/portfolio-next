"use client";

import AnimationBox from "./ui/AnimationBox";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { STAGGER, prefersReducedMotion } from "@/lib/motion";
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
  "acumen",
];

/**
 * Headline rendered as per-word masked spans: SSR-safe (full text in HTML),
 * revealed word by word after the preloader hands off. The first word is the
 * landing target for the preloader's flying "Hey!".
 */
function HeroHeadline({ className }: { className?: string }) {
  return (
    <h1 className={cn("font-display font-semibold", className)}>
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
  const lightRef = useRef<HTMLDivElement>(null);
  const { introDone } = useIntro();

  // A warm light follows the cursor across the night hero — you carry a
  // little sun. Desktop + hover only, off under reduced motion.
  useGSAP(
    () => {
      const light = lightRef.current;
      const container = containerRef.current;
      if (!light || !container) return;
      if (prefersReducedMotion()) return;
      if (!window.matchMedia("(hover: hover)").matches) return;

      const xTo = gsap.quickTo(light, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(light, "y", { duration: 0.6, ease: "power3.out" });

      const move = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
      };
      const show = () => gsap.to(light, { opacity: 1, duration: 0.6 });
      const hide = () => gsap.to(light, { opacity: 0, duration: 0.6 });

      container.addEventListener("pointermove", move);
      container.addEventListener("pointerenter", show);
      container.addEventListener("pointerleave", hide);
      return () => {
        container.removeEventListener("pointermove", move);
        container.removeEventListener("pointerenter", show);
        container.removeEventListener("pointerleave", hide);
      };
    },
    { scope: containerRef }
  );

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

      // Reveal. Word 0 is already placed by the preloader's landing word;
      // the rest rise out of their masks in reading order.
      gsap.to(words, {
        yPercent: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: STAGGER.word,
      });

      // Meta lines fade up under the headline
      gsap.fromTo(
        ".hero-meta",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.5,
        }
      );

      // Exit: the entrance played in reverse, conducted by the scroll —
      // words dissolve last-word-first through their masks.
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
      {/* Cursor-following warm light */}
      <div
        ref={lightRef}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 -ml-[300px] -mt-[300px] w-[600px] h-[600px] rounded-full opacity-0 blur-3xl z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,59,0,0.18) 0%, rgba(255,59,0,0) 70%)",
        }}
      />

      {/* Eyebrow */}
      <div className="relative z-10 flex items-baseline justify-between">
        <p className="hero-meta text-meta font-medium uppercase text-brand-paper/70 opacity-0">
          Developer &amp; digital consultant
        </p>
        <p className="hero-meta text-meta font-medium uppercase text-brand-paper/70 opacity-0 hidden sm:block">
          Based in Stockholm
        </p>
      </div>

      {/* The headline is the whole stage */}
      <div className="relative z-10 flex-1 flex items-center">
        <HeroHeadline className="text-display text-left text-brand-ink" />
      </div>

      {/* Scroll cue */}
      <div className="relative z-10 flex items-end justify-between">
        <div className="hero-meta opacity-0 flex items-center gap-3">
          <AnimationBox className="cursor-pointer h-[60px]" />
          <span className="text-meta font-medium uppercase text-brand-paper/70">
            Scroll
          </span>
        </div>
      </div>
    </div>
  );
}
