"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { STAGGER, prefersReducedMotion } from "@/lib/motion";

/**
 * PIN #1 — the statement scrub. The About statements pin and illuminate
 * word by word in reading order under the reader's scroll. Words start as
 * ghosts (opacity 0.25) so the composition is always visible — no empty
 * viewport, no CLS. Mobile gets the same illumination without the pin.
 */
export default function AboutMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      if (prefersReducedMotion() || !ref.current || !contextSafe) return;

      const statements = ref.current.querySelectorAll("[data-about-statement]");
      if (statements.length === 0) return;

      // Split after fonts settle so line metrics are final
      document.fonts.ready.then(
        contextSafe(() => {
          // aria "none": word spans read naturally; "auto" would put an
          // aria-label on the <p>, which is prohibited without a role
          const split = new SplitText(statements, {
            type: "words",
            aria: "none",
          });
          // 0.45 ghost opacity = >=3.2:1 against both the night and day
          // background (0.25 failed contrast in the resting state)
          gsap.set(split.words, { opacity: 0.45, yPercent: 6 });

          const mm = gsap.matchMedia(ref);

          // Desktop: pinned — the reader conducts the read
          mm.add("(min-width: 769px)", () => {
            gsap.to(split.words, {
              opacity: 1,
              yPercent: 0,
              ease: "none",
              stagger: STAGGER.word,
              scrollTrigger: {
                trigger: ref.current,
                start: "top top+=96",
                end: "+=150%",
                scrub: 0.5,
                pin: true,
                anticipatePin: 1,
              },
            });
          });

          // Mobile: same illumination, no pin (pinning fights momentum scroll)
          mm.add("(max-width: 768px)", () => {
            gsap.to(split.words, {
              opacity: 1,
              yPercent: 0,
              ease: "none",
              stagger: STAGGER.word,
              scrollTrigger: {
                trigger: ref.current,
                start: "top 80%",
                end: "bottom 55%",
                scrub: true,
              },
            });
          });
        })
      );
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
