"use client";

import React from "react";
import { TextSectionProps } from "@/types/aboutTypes";

const TextSection: React.FC<TextSectionProps> = ({
  children,
  title,
  italicText,
  descriptionSection1,
  descriptionSection2,
  descriptionSection3,
}) => {
  return (
    <>
      <section className="mb-10 px-5 sm:max-w-[400px] mx-auto">
        <h1 className="text-[#131313] font-bold uppercase">
          {title}{" "}
          {italicText && (
            <span className="text-[#131313] font-light italic uppercase">
              {italicText}
            </span>
          )}
        </h1>
        <p className="text-sm font-light text-[#131313] mt-5 tracking-wide">
          {descriptionSection1}
        </p>
      </section>
      {children}
      <section className="mb-10 px-5 sm:max-w-[400px] mx-auto">
        <p className="text-sm font-light text-[#131313] sm:mt-10 tracking-wide">
          {descriptionSection2}
          <div className="mt-4">{descriptionSection3}</div>
        </p>
      </section>
    </>
  );
};

export default TextSection;
