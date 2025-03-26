import React from "react";
import { TypewriterEffect } from "@/components/ui/aceternity/typewriter-effect";
// import { TextGenerateEffect } from "@/components/ui/aceternity/text-generate-effect";
import Image from "next/image";
import meSurfing from "../../public/images/surf5.jpg";

export default function Home() {
  const words = ["WEB", "FRONT END", "[SOME STACK]"];

  return (
    <div className="flex flex-col sm:max-w-[800px] relative px-4 sm:px-0">
      <div className="flex justify-center w-full">
        <h3 className="text-[#ff3b00] italic font-light text-4xl sm:text-5xl mb-5 sm:mb-10 z-10">
          Hey!
        </h3>
      </div>
      <div className="absolute aspect-square shadow-xl right-0 sm:right-2 top-20 sm:top-10 z-0 w-[250px] h-[350px] sm:w-[350px] sm:h-[450px]">
        <Image
          src={meSurfing}
          alt="Developer"
          fill
          quality={100}
          className="object-cover"
          priority
        />
      </div>

      <h1 className="text-4xl sm:text-7xl font-bold leading-tight z-10">
        <TypewriterEffect words={words} />
        DEVELOPER WITH A GROWTH MINDSET
        <br />
        AND BUSINESS SAVVY.
      </h1>
    </div>
  );
}
