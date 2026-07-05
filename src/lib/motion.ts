/**
 * Motion grammar for the whole site — two easings, four durations.
 * Entrances use EASE.out, transitions/exits use EASE.inOut, and the bouncy
 * EASE.micro is reserved for small hover moments (nav flips, badges).
 */
export const EASE = {
  out: "power3.out",
  inOut: "power2.inOut",
  micro: "back.out(1.7)",
} as const;

export const DUR = {
  micro: 0.3,
  element: 0.6,
  section: 0.9,
  act: 1.4,
} as const;

/** Word/char stagger steps (seconds). */
export const STAGGER = {
  word: 0.06,
  char: 0.02,
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
