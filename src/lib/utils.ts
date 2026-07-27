import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge that our Ledger scale (text-display/title/statement/
// body/meta) are font-sizes, not colors. Without this it groups e.g.
// `text-display` with `text-brand-ink` and silently drops one — which is why
// the hero headline was collapsing to the 16px default.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display", "title", "statement", "body", "meta"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${path}`;
}
