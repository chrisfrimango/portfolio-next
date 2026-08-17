"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useIntro } from "@/components/intro/IntroContext";

/**
 * A photographic mountain fixed behind the page. The hero (cloud curtain) hides
 * it until scrolled away; it stands behind About and fades before Projects.
 * Mounted only after the intro hands off (LCP-safe). Motion is added in a later
 * step; this version renders it statically at full opacity.
 */
export default function MountainBackdrop() {
  const { introDone } = useIntro();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  // The backdrop lives behind the opaque hero until you scroll, so it is not
  // mounted at load — that keeps its video/poster out of LCP entirely.
  const [armed, setArmed] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    const rm = prefersReducedMotion();
    setReduced(rm);
    if (rm) {
      setArmed(true); // reduced motion: show the static mountain right away
      return;
    }
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.3) {
        setArmed(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Guarantee muted + start playback once the video mounts (React can drop the
  // muted attribute, and autoplay needs it).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [mounted, armed, reduced, introDone]);

  useGSAP(
    () => {
      if (!mounted) return;
      const root = rootRef.current,
        img = imgRef.current,
        scrim = scrimRef.current;
      if (!root || !img || !scrim) return;

      // Opacity is split across two elements so each has a single writer and
      // the layer starts invisible — a painted full-viewport image would
      // otherwise steal LCP from the headline. The ROOT reveals (0->1) as the
      // opaque hero scrolls off; the IMG WRAPPER fades (1->0) before Projects.
      // At load the root is opacity 0, so the image is not an LCP candidate.
      gsap.set(root, { opacity: reduced ? 1 : 0 });

      // Fade out before the first Projects stage (writer of imgRef opacity).
      gsap.fromTo(
        img,
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: "#projects",
            start: "top 90%",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      if (reduced) {
        gsap.set(img, { yPercent: 0, scale: 1 });
        return;
      }

      // Reveal: root fades up as the hero scrolls away (writer of root opacity).
      // Chrome can pause the occluded backdrop video; nudge it back to playing
      // once the layer is actually being revealed.
      gsap.fromTo(
        root,
        { opacity: 0 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              const v = videoRef.current;
              if (v && self.progress > 0.25 && v.paused) v.play().catch(() => {});
            },
          },
        }
      );

      // Descent drift — slow parallax over the mountain's visible life (About).
      gsap.fromTo(
        img,
        { yPercent: 6, scale: 1.06 },
        {
          yPercent: -4,
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: "#about",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    },
    { dependencies: [mounted, armed, reduced, introDone] }
  );

  if (!mounted || !armed || (!reduced && !introDone)) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      // Invisible at first paint so the backdrop video/poster can never be the
      // LCP element; the reveal (or reduced-motion) sets opacity from the effect.
      style={{ opacity: 0 }}
    >
      <div ref={imgRef} className="absolute inset-0 will-change-transform">
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/video/mountain_backdrop_poster.webp"
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 28%" }}
          />
        ) : (
          <video
            ref={videoRef}
            muted
            playsInline
            loop
            autoPlay
            preload="none"
            poster="/video/mountain_backdrop_poster.webp"
            className="h-full w-full object-cover"
            style={{ objectPosition: "center 28%" }}
          >
            <source src="/video/mountain_backdrop.webm" type="video/webm" />
            <source src="/video/mountain_backdrop.mp4" type="video/mp4" />
          </video>
        )}
      </div>
      {/* Cloud line — a mist band that submerges the mountain base so only the
          peak reads above the clouds, matching the hint of peaks in the hero. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background:
            "linear-gradient(to top, rgb(var(--brand-paper)) 0%, rgb(var(--brand-paper) / 0.7) 30%, rgb(var(--brand-paper) / 0.15) 62%, transparent 100%)",
        }}
      />
      {/* Contrast scrim over About — --brand-paper so it tracks the day cycle.
          A vertical veil secures the body copy (measured >=4.5:1 for --brand-ink),
          plus a soft left column that lifts the faint --brand-gray section
          labels; the mountain stays clearest through the centre where the peak
          sits. */}
      <div
        ref={scrimRef}
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to right, rgb(var(--brand-paper) / 0.9) 0%, transparent 20%)",
            "linear-gradient(to bottom, rgb(var(--brand-paper) / 0.58) 0%, rgb(var(--brand-paper) / 0.53) 50%, rgb(var(--brand-paper) / 0.63) 100%)",
          ].join(","),
        }}
      />
    </div>
  );
}
