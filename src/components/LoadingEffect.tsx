"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const hellos: string[] = [
  "Hey",
  "Hello",
  "Hej",
  "Ciao",
  "Hola",
  "Bonjour",
  "안녕하세요",
  "I'm Friman",
];

export default function LoadingEffect({
  setAnimationFinished,
}: {
  setAnimationFinished: (value: boolean) => void;
}) {
  // const [showPage, setShowPage] = useState(false);
  const [currentHello, setCurrentHello] = useState(hellos[0]);
  const [helloIndex, setHelloIndex] = useState(0);
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.to(textRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      delay: 0.1,
    });

    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.3,
      onComplete: () => {
        if (helloIndex >= hellos.length) {
          setAnimationFinished(true);
        }
      },
    });

    timeline.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.7,
      onComplete: () => {
        if (helloIndex < hellos.length) {
          setCurrentHello(hellos[helloIndex % hellos.length]);
          setHelloIndex((prevIndex) => prevIndex + 1);
        } else if (helloIndex === hellos.length) {
          // setShowPage(true);
        }
      },
    });
  }, [helloIndex]);

  return (
    <>
      <div className="absolute top-0 left-0 w-full h-[97vh] bg-[#fcfcfc]" />
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-[#fcfcfc] z-[1100] flex justify-center items-center
        `}
      >
        {helloIndex > 0 && (
          <h3 ref={textRef} className="text-5xl font-normal text-[#131313]">
            {currentHello}
          </h3>
        )}
      </div>
      <div
        className={`absolute top-0 left-0 w-full h-screen bg-[#ff3b00]
      `}
      />
    </>
  );
}
