import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

// Single source of truth for GSAP — import gsap/plugins from here,
// never from "gsap" directly, so registration happens exactly once.
export { gsap, ScrollTrigger, SplitText, useGSAP };
