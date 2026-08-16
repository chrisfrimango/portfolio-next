"use client";

import AnimationBox from "./ui/AnimationBox";
import HeroMountains from "@/components/hero/HeroMountains";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/components/intro/IntroContext";

const HEADLINE_WORDS = [
  "Hey!",
  "I'm",
  "Friman.",
  "I",
  "help",
  "companies",
  "navigate",
  "digital",
  "transformation",
  "—",
  "the",
  "technology,",
  "and",
  "the",
  "change",
  "that",
  "comes",
  "with",
  "it.",
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
              word === "Friman." && "italic text-brand-accent"
            )}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  );
}

/**
 * Atmospheric hero backdrop. LCP-safe by construction: nothing renders until
 * after mount, and the video only mounts once the preloader has handed off
 * (introDone) — so the DOM headline stays the LCP element, never the film.
 * Under reduced motion the <video> is never mounted; the poster still frame is
 * shown instead. The warm scrim is a --brand-paper gradient, so it tracks the
 * day-cycle and always sits as "background" behind the --brand-ink headline —
 * dark scrim / light text at the night hero, self-correcting toward day.
 */
function HeroAmbient({ introDone }: { introDone: boolean }) {
  const [reduced, setReduced] = useState(false);
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    setReduced(prefersReducedMotion());
  }, []);

  // Guarantee muted (React can drop the attribute, and autoplay needs it) and
  // kick playback once the element mounts after the intro hands off.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [mounted, introDone, reduced]);

  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      {mounted && reduced ? (
        // Reduced motion: poster still only — the video element is never mounted.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/video/hero_ambient_poster.webp"
          alt=""
          className="h-full w-full object-cover"
        />
      ) : mounted && introDone ? (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          autoPlay
          preload="auto"
          poster="/video/hero_ambient_poster.webp"
          className="h-full w-full object-cover"
          style={{ objectPosition: "80% 45%" }}
        >
          <source src="/video/hero_ambient.webm" type="video/webm" />
          <source src="/video/hero_ambient.mp4" type="video/mp4" />
        </video>
      ) : null}

      {/* Mountain silhouettes — same mount gate as the footage */}
      {mounted && (reduced || introDone) ? <HeroMountains /> : null}

      {/* Warm scrim — two stacked --brand-paper gradients (one rising from the
          low edge, one from the left) that veil the bottom-left column where the
          headline sits, while the sun and haze stay clear on the right. Tuned to
          a measured worst-case contrast of 4.79:1 for the --brand-ink headline;
          tracks the day-cycle since it's all --brand-paper. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "linear-gradient(to top, rgb(var(--brand-paper)) 0%, rgb(var(--brand-paper) / 0.66) 34%, rgb(var(--brand-paper) / 0.22) 60%, transparent 82%)",
            "linear-gradient(to right, rgb(var(--brand-paper)) 0%, rgb(var(--brand-paper) / 0.66) 40%, rgb(var(--brand-paper) / 0.08) 72%, transparent 85%)",
          ].join(","),
        }}
      />
    </div>
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
      <HeroAmbient introDone={introDone} />

      {/* The headline is the whole stage — anchored low like a printed cover.
          No eyebrow labels: the giant type carries the frame on its own. */}
      <div className="relative z-10 flex-1 flex items-end">
        <HeroHeadline className="text-[clamp(2rem,0.9rem+3.2vw,4.5rem)] leading-[1.02] tracking-[-0.02em] text-left text-brand-ink max-w-[19ch]" />
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
