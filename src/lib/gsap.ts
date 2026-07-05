import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Single source of truth for GSAP — import gsap/plugins from here,
// never from "gsap" directly, so registration happens exactly once.
export { gsap, ScrollTrigger, useGSAP };
