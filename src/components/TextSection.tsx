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
      <section className="mb-10 px-5 sm:max-w-[450px] mx-auto z-10">
        <h1 className="text-[#131313] font-bold uppercase">
          {title}{" "}
          {italicText && (
            <span className="text-[#131313] font-light italic uppercase">
              {italicText}
            </span>
          )}
        </h1>
        <div className="text-sm font-light text-[#131313] mt-5 tracking-wide">
          {descriptionSection1?.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
      {children}
      <section className="mb-10 px-5 sm:max-w-[450px] mx-auto">
        <div className="text-sm font-light text-[#131313] sm:mt-10 tracking-wide">
          {descriptionSection2?.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
        {descriptionSection3 && (
          <div className="text-sm font-light text-[#131313] mt-4 tracking-wide">
            {descriptionSection3?.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default TextSection;
