"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

import React from "react";

export default function AnimationBox() {
  const aboutRef = useRef(null);

  useGSAP(() => {
    gsap.from(aboutRef.current, {
      opacity: 0,
      x: -100,
      xPercent: 100,
      duration: 1,
    });
  }, []);

  return (
    <div
      className="w-[70%] sm:h-[250px] h-[150px] bg-[#ff3b00] mb-6"
      ref={aboutRef}
    />
  );
}
