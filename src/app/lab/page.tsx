import { Metadata } from "next";
import labData from "@/data/lab.json";

export const metadata: Metadata = {
  title: "Lab | Christoffer Friman",
  description:
    "Motion and interaction experiments built for this site — GSAP, Lenis, and a restrained motion grammar.",
};

export default function LabPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-28 pb-24">
      <p className="text-xs tracking-[0.25em] uppercase text-brand-gray">Lab</p>
      <h1 className="font-display text-5xl sm:text-7xl text-brand-ink mt-3 mb-6">
        Experiments
      </h1>
      <p className="text-lg sm:text-xl text-brand-ink/80 max-w-2xl mb-16">
        {labData.intro}
      </p>

      <div className="space-y-16">
        {labData.entries.map((entry) => (
          <article key={entry.id}>
            <div className="flex items-baseline gap-3 border-t border-brand-ink/15 pt-3 mb-4">
              <span className="font-display italic text-brand-accent text-lg leading-none">
                {entry.id}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-brand-ink">
                {entry.title}
              </h2>
            </div>
            <p className="text-xl leading-relaxed text-brand-ink mb-4">
              {entry.summary}
            </p>
            <p className="text-brand-ink/80 leading-relaxed mb-4">
              {entry.detail}
            </p>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-brand-accent/5 text-brand-ink rounded-full text-xs border border-brand-ink/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
