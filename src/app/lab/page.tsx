import { Metadata } from "next";
import labData from "@/data/lab.json";

export const metadata: Metadata = {
  title: "Lab | Christoffer Friman",
  description:
    "Motion and interaction experiments built for this site — GSAP, Lenis, and a restrained motion grammar.",
};

export default function LabPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-24">
      <p className="text-meta font-medium uppercase text-brand-gray">Lab</p>
      <h1 className="font-display font-semibold text-display text-brand-ink mt-4 mb-6">
        Experiments
      </h1>
      <p className="text-statement font-display text-brand-ink/85 max-w-2xl mb-20">
        {labData.intro}
      </p>

      <div className="space-y-20">
        {labData.entries.map((entry) => (
          <article key={entry.id}>
            <div className="flex items-baseline gap-4 border-t border-brand-ink/15 pt-4 mb-5">
              <span className="font-display italic text-brand-accent text-statement leading-none">
                {entry.id}
              </span>
              <h2 className="font-display text-title text-brand-ink">
                {entry.title}
              </h2>
            </div>
            <p className="text-statement font-display text-brand-ink mb-5">
              {entry.summary}
            </p>
            <p className="text-body text-brand-gray mb-5 max-w-2xl">
              {entry.detail}
            </p>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-brand-accent/5 text-brand-ink rounded-full text-meta font-medium border border-brand-ink/10"
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
