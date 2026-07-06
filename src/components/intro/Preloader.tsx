"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro } from "./IntroContext";

const GREETINGS = ["Hej", "Ciao", "안녕하세요"];
const FINAL_WORD = "Hey!";
const SESSION_KEY = "friman-intro-seen";

/** Pick the hero word target that is actually visible (mobile vs desktop block). */
function findVisibleHeroTarget(): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>(
    '[data-hero-word-mask="0"]'
  );
  for (const el of candidates) {
    if (el.offsetParent !== null && el.offsetWidth > 0) return el;
  }
  return null;
}

/**
 * Act one of the site: a multi-language greeting cycle whose final word
 * doesn't fade out — it travels into position as the first word of the hero
 * headline, so loading and arrival read as one continuous sentence.
 *
 * Skipped entirely on repeat visits (sessionStorage) and under
 * prefers-reduced-motion.
 */
export default function Preloader() {
  const { finishIntro } = useIntro();
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    (_, contextSafe) => {
      const overlay = overlayRef.current;
      const bg = bgRef.current;
      const word = wordRef.current;
      if (!overlay || !bg || !word || !contextSafe) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const seen = sessionStorage.getItem(SESSION_KEY) === "true";

      const finish = () => {
        document.documentElement.style.overflow = "";
        setDone(true);
        finishIntro();
      };

      if (reduceMotion || seen) {
        finish();
        return;
      }
      sessionStorage.setItem(SESSION_KEY, "true");

      // Keep the page pinned to the top while the intro plays, so the
      // measured handoff target can't move.
      document.documentElement.style.overflow = "hidden";

      // Wait for fonts so both measurements use final glyph metrics.
      document.fonts.ready.then(
        contextSafe(() => {
          // Measure the flight path with the final word in place
          word.textContent = FINAL_WORD;
          const from = word.getBoundingClientRect();
          const target = findVisibleHeroTarget();
          const to = target?.getBoundingClientRect() ?? null;

          const tl = gsap.timeline({ onComplete: finish });

          // Act 1 — greetings cycle
          GREETINGS.forEach((greeting) => {
            tl.call(() => {
              word.textContent = greeting;
            });
            tl.fromTo(
              word,
              { opacity: 0, yPercent: 30 },
              { opacity: 1, yPercent: 0, duration: 0.12, ease: "power2.out" }
            );
            tl.to(word, { opacity: 1, duration: 0.05 });
          });

          // Final word lands…
          tl.call(() => {
            word.textContent = FINAL_WORD;
          });
          tl.fromTo(
            word,
            { opacity: 0, yPercent: 30 },
            { opacity: 1, yPercent: 0, duration: 0.25, ease: "power3.out" }
          );

          if (to) {
            // …and flies into the headline instead of fading out
            const scale = to.height / from.height;
            tl.set(word, { transformOrigin: "top left" });
            tl.to(
              word,
              {
                x: to.left - from.left,
                y: to.top - from.top,
                scale,
                duration: 0.6,
                ease: "power3.inOut",
              },
              "+=0.15"
            );
            tl.to(bg, { opacity: 0, duration: 0.5 }, "<0.15");
            // The moment it lands: swap in the real headline word
            tl.call(() => {
              document
                .querySelectorAll<HTMLElement>('[data-hero-word="0"]')
                .forEach((el) => gsap.set(el, { yPercent: 0 }));
              gsap.set(word, { opacity: 0 });
            });
          } else {
            // No target found (shouldn't happen) — plain fade out
            tl.to(overlay, { opacity: 0, duration: 0.5 }, "+=0.3");
          }
        })
      );

      // Safety: never leave the page scroll-locked
      return () => {
        document.documentElement.style.overflow = "";
      };
    },
    { scope: overlayRef }
  );

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[1100] flex items-center justify-center"
    >
      {/* 0.99 opacity keeps the browser painting the hero underneath,
          so the preloader doesn't delay LCP (occluded content is skipped) */}
      <div ref={bgRef} className="absolute inset-0 bg-brand-paper opacity-[0.99]" />
      <span
        ref={wordRef}
        className="relative font-display text-6xl md:text-8xl text-brand-ink opacity-0 whitespace-nowrap"
      />
    </div>
  );
}
