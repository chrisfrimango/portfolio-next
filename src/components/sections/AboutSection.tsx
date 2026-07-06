import React, { type ReactNode } from "react";
import Image from "next/image";
import aboutData from "@/data/about.json";
import surfart from "../../../public/images/surfart.webp";
import AboutMotion from "@/components/sections/AboutMotion";

const EMPHASIS = "where technology and business meet";

/** Wraps the positioning phrase in true italics. */
function Statement({ text }: { text: string }) {
  const index = text.indexOf(EMPHASIS);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <em className="italic">{EMPHASIS}</em>
      {text.slice(index + EMPHASIS.length)}
    </>
  );
}

function LedgerRow({
  label,
  children,
  wide = false,
}: {
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="border-t border-brand-ink/10 py-10 lg:py-14 lg:grid lg:grid-cols-12 lg:gap-x-6">
      <p className="text-meta font-medium uppercase text-brand-gray mb-4 lg:mb-0 lg:col-span-3">
        {label}
      </p>
      <div className={wide ? "lg:col-start-4 lg:col-span-9" : "lg:col-start-4 lg:col-span-8"}>
        {children}
      </div>
    </div>
  );
}

/**
 * About as an editorial ledger: four hairline rows on the content spine —
 * labels in the left column, serif statements to the right.
 */
export default function AboutSection() {
  const [who, journey, stack, soft] = aboutData.content;

  return (
    <div className="mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12">
      {/* Art-directed portrait figure — offset to the right */}
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-6 mb-16 lg:mb-24">
        <figure className="lg:col-start-7 lg:col-span-6 relative aspect-[4/3] overflow-hidden rounded-sm border border-brand-ink/10">
          <Image
            src={surfart}
            alt="Christoffer Friman"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={70}
            className="object-cover grayscale contrast-[1.05]"
          />
          {/* Grain + warm wash tie the photo to the day cycle */}
          <div className="pointer-events-none absolute inset-0 bg-brand-accent/5 mix-blend-multiply" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
          <figcaption className="absolute bottom-3 left-3 text-meta font-medium uppercase text-brand-paper/90 mix-blend-difference">
            Off duty &mdash; Stockholm
          </figcaption>
        </figure>
      </div>

      <AboutMotion>
        <LedgerRow label="Who am I">
          <p
            data-about-statement
            className="font-display text-statement text-brand-ink"
          >
            <Statement text={who.description} />
          </p>
        </LedgerRow>

        <LedgerRow label="How I work">
          <p
            data-about-statement
            className="font-display text-statement text-brand-ink"
          >
            {journey.description}
          </p>
        </LedgerRow>
      </AboutMotion>

      <LedgerRow label="Stack" wide>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {stack.description
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => (
              <li key={item} className="text-body text-brand-ink">
                {item}
              </li>
            ))}
        </ul>
      </LedgerRow>

      <LedgerRow label="Soft values">
        <p className="font-display italic text-statement text-brand-ink">
          {soft.description.split("^").map((value, index, all) => (
            <span key={value}>
              {value.trim()}
              {index < all.length - 1 && (
                <span className="text-brand-accent not-italic"> · </span>
              )}
            </span>
          ))}
        </p>
      </LedgerRow>
    </div>
  );
}
