import React from "react";
import { notFound } from "next/navigation";
import projects from "@/data/projects.json";
import Link from "next/link";
import CaseMotion from "./case-motion";

export function generateStaticParams() {
  return projects.projects
    .filter((project) => !project.hidden)
    .map((project) => ({
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
      <h2 className="text-meta font-medium uppercase text-brand-gray">
        {title}
      </h2>
    </div>
  );
}

const COLUMN = "mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectName: string }>;
}) {
  const { projectName } = await params;
  const project = projects.projects.find(
    (project) => project.name === projectName
  );

  if (!project || project.hidden) {
    return notFound();
  }

  const caseStudy = project.caseStudy;

  return (
    <CaseMotion>
      <article className="w-full pt-28 pb-24">
        {/* Header */}
        <div data-case-header className={COLUMN}>
          <p className="text-meta font-medium uppercase text-brand-gray">
            Case study
          </p>
          <h1 className="font-display font-semibold text-display text-brand-ink mt-4 mb-6">
            {project.title}
          </h1>
          <p className="text-statement font-display text-brand-ink/85 max-w-3xl">
            {project.shortDescription}
          </p>
        </div>

        {/* Meta row */}
        <div className={`${COLUMN} mt-10`}>
          <div className="flex flex-wrap gap-x-12 gap-y-4 border-t border-brand-ink/15 pt-4">
            {caseStudy && (
              <>
                <div>
                  <p className="text-meta font-medium uppercase text-brand-gray mb-1">
                    Role
                  </p>
                  <p className="text-body text-brand-ink">{caseStudy.role}</p>
                </div>
                {!isDraft(caseStudy.year) && (
                  <div>
                    <p className="text-meta font-medium uppercase text-brand-gray mb-1">
                      Year
                    </p>
                    <p className="text-body text-brand-ink">{caseStudy.year}</p>
                  </div>
                )}
              </>
            )}
            <div>
              <p className="text-meta font-medium uppercase text-brand-gray mb-1">
                Stack
              </p>
              <p className="text-body text-brand-ink">
                {project.technologies.join(" · ")}
              </p>
            </div>
          </div>
        </div>

        {/* Full-bleed media — looping film when available, else the poster */}
        <div
          data-case-video
          className="relative left-1/2 -translate-x-1/2 w-screen my-16 overflow-hidden"
        >
          {project.media?.video ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={project.media.poster}
              className="w-full h-[50vh] lg:h-[75vh] object-cover"
            >
              <source src={project.media.video} type="video/mp4" />
            </video>
          ) : (
            project.media?.poster && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.media.poster}
                alt={`${project.title} — ${project.shortDescription}`}
                className="w-full h-[50vh] lg:h-[75vh] object-cover"
              />
            )
          )}
        </div>

        {caseStudy ? (
          <div className={`${COLUMN} space-y-20`}>
            <section data-case-section className="max-w-4xl">
              <CaseHeading number="01" title="Problem" />
              <p className="text-statement font-display text-brand-ink">
                {caseStudy.problem}
              </p>
            </section>

            <section data-case-section className="max-w-4xl">
              <CaseHeading number="02" title="Approach" />
              <p className="text-statement font-display text-brand-ink">
                {caseStudy.approach}
              </p>
            </section>

            <section data-case-section>
              <CaseHeading number="03" title="Craft details" />
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                {caseStudy.craft.map((item) => (
                  <div key={item.title}>
                    <h3 className="font-display text-title text-brand-ink mb-3">
                      {item.title}
                    </h3>
                    <p className="text-body text-brand-gray">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section data-case-section className="max-w-4xl">
              <CaseHeading number="04" title="Outcome" />
              <p className="text-statement font-display text-brand-ink mb-6">
                {isDraft(caseStudy.outcome)
                  ? caseStudy.outcome.split("[FYLL")[0].trim()
                  : caseStudy.outcome}
              </p>
              {!isDraft(caseStudy.reflection) && (
                <p className="text-body text-brand-gray italic">
                  {caseStudy.reflection}
                </p>
              )}
            </section>
          </div>
        ) : (
          <div className={COLUMN}>
            <p className="text-body text-brand-ink/80">{project.description}</p>
          </div>
        )}

        {/* CTA */}
        <div className={`${COLUMN} mt-20`}>
          <div className="flex items-center gap-6 border-t border-brand-ink/15 pt-8">
            <Link
              href={project.liveUrl}
              target="_blank"
              className="rounded-full bg-brand-ink text-brand-paper px-6 py-3 text-meta font-medium uppercase hover:bg-brand-accent transition-colors"
            >
              Visit live site &rarr;
            </Link>
            <Link
              href="/#projects"
              className="link-underline text-body text-brand-gray hover:text-brand-ink transition-colors"
            >
              &larr; Back to work
            </Link>
          </div>
        </div>
      </article>
    </CaseMotion>
  );
}
