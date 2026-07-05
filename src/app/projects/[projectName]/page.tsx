import React from "react";
import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import Link from "next/link";

export function generateStaticParams() {
  return projects.projects.map((project) => ({
    projectName: project.name,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const { projectName } = await params;
  const project = projects.projects.find(
    (project) => project.name === projectName
  );

  if (!project) {
    return notFound();
  }

  return {
    title: `${project.title} — Case study | Christoffer Friman`,
    description: project.shortDescription,
  };
}

/** Draft fields awaiting real facts are hidden from the rendered page. */
function isDraft(text: string) {
  return text.includes("[FYLL I");
}

function CaseHeading({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3 border-t border-brand-ink/15 pt-3 mb-6">
      <span className="font-display italic text-brand-accent text-2xl leading-none">
        {number}
      </span>
      <h2 className="text-xs tracking-[0.25em] uppercase text-brand-gray">
        {title}
      </h2>
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const { projectName } = await params;
  const project = projects.projects.find(
    (project) => project.name === projectName
  );

  if (!project) {
    return notFound();
  }

  const caseStudy = project.caseStudy;

  return (
    <article className="w-full max-w-4xl mx-auto px-4 sm:px-8 pt-28 pb-24">
      {/* Header */}
      <p className="text-xs tracking-[0.25em] uppercase text-brand-gray">
        Case study
      </p>
      <h1 className="font-display text-5xl sm:text-7xl text-brand-ink mt-3 mb-6">
        {project.title}
      </h1>
      <p className="text-lg sm:text-xl text-brand-ink/80 max-w-2xl mb-8">
        {project.shortDescription}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-brand-ink/15 pt-4 mb-12 text-sm">
        {caseStudy && (
          <>
            <div>
              <p className="text-brand-gray uppercase text-[11px] tracking-[0.2em] mb-1">
                Role
              </p>
              <p className="text-brand-ink">{caseStudy.role}</p>
            </div>
            {!isDraft(caseStudy.year) && (
              <div>
                <p className="text-brand-gray uppercase text-[11px] tracking-[0.2em] mb-1">
                  Year
                </p>
                <p className="text-brand-ink">{caseStudy.year}</p>
              </div>
            )}
          </>
        )}
        <div>
          <p className="text-brand-gray uppercase text-[11px] tracking-[0.2em] mb-1">
            Stack
          </p>
          <p className="text-brand-ink">{project.technologies.join(" · ")}</p>
        </div>
      </div>

      {/* Video */}
      <div className="relative w-full overflow-hidden rounded-lg mb-16 border border-brand-ink/10">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/footage/camping_poster.webp"
          className="w-full h-auto"
        >
          <source src="/footage/camping_video.mp4" type="video/mp4" />
        </video>
      </div>

      {caseStudy ? (
        <div className="space-y-16">
          <section>
            <CaseHeading number="01" title="Problem" />
            <p className="text-xl sm:text-2xl leading-relaxed text-brand-ink">
              {caseStudy.problem}
            </p>
          </section>

          <section>
            <CaseHeading number="02" title="Approach" />
            <p className="text-xl sm:text-2xl leading-relaxed text-brand-ink">
              {caseStudy.approach}
            </p>
          </section>

          <section>
            <CaseHeading number="03" title="Craft details" />
            <div className="grid sm:grid-cols-2 gap-8">
              {caseStudy.craft.map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-2xl text-brand-ink mb-2">
                    {item.title}
                  </h3>
                  <p className="text-brand-ink/80 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <CaseHeading number="04" title="Outcome" />
            <p className="text-xl sm:text-2xl leading-relaxed text-brand-ink mb-6">
              {isDraft(caseStudy.outcome)
                ? "The platform is live at allacampingplatser.se and in active use."
                : caseStudy.outcome}
            </p>
            {!isDraft(caseStudy.reflection) && (
              <p className="text-brand-ink/70 leading-relaxed italic">
                {caseStudy.reflection}
              </p>
            )}
          </section>
        </div>
      ) : (
        <p className="text-lg text-brand-ink/80">{project.description}</p>
      )}

      {/* CTA */}
      <div className="flex items-center gap-6 mt-16 border-t border-brand-ink/15 pt-8">
        <Link
          href={project.liveUrl}
          target="_blank"
          className="rounded-full bg-brand-ink text-brand-paper px-6 py-3 text-sm uppercase tracking-[0.15em] hover:bg-black transition-colors"
        >
          Visit live site &rarr;
        </Link>
        <Link
          href="/#projects"
          className="text-sm text-brand-gray hover:text-brand-ink transition-colors"
        >
          &larr; Back to selected works
        </Link>
      </div>
    </article>
  );
}
