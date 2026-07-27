import Link from "next/link";
import projects from "@/data/projects.json";
import ProjectMedia from "@/components/sections/ProjectMedia";
import ProjectsMotion from "@/components/sections/ProjectsMotion";

const isFilled = (v?: string) => Boolean(v && !v.startsWith("[FYLL"));

/**
 * Work = the client case study as a full-bleed cinematic stage that pins and
 * emerges from black.
 */
export default function WorkSection() {
  const [flagship] = projects.projects;
  const year = flagship.caseStudy?.year;

  return (
    <div className="w-full">
      {/* Flagship — a cinematic stage that pins and emerges from black */}
      <ProjectsMotion>
        <article
          data-project-flagship
          className="relative flex min-h-[68vh] w-full items-center py-16 lg:min-h-screen lg:py-0"
        >
          {/* Index — far-left gutter, on the video mid-line */}
          <span
            data-project-flank
            className="absolute left-5 top-1/2 hidden -translate-y-1/2 font-mono text-meta text-brand-accent lg:block lg:left-12"
          >
            01
          </span>
          {/* Year — far-right gutter (only when a real year is filled in) */}
          {isFilled(year) && (
            <span
              data-project-flank
              className="absolute right-5 top-1/2 hidden -translate-y-1/2 font-mono text-meta text-brand-gray lg:block lg:right-12"
            >
              {year}
            </span>
          )}

          {/* Centered footage + metadata */}
          <div className="mx-auto w-[88vw] max-w-[1080px] lg:w-[66vw]">
            <div data-project-media>
              <ProjectMedia
                src="/footage/camping_video.mp4"
                poster="/footage/camping_poster.webp"
              />
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2
                  data-project-detail
                  className="font-display text-title text-brand-ink"
                >
                  {flagship.title}
                </h2>
                <p
                  data-project-detail
                  className="mt-3 font-mono text-meta text-brand-gray"
                >
                  {flagship.technologies.join(" · ")}
                </p>
              </div>
              <Link
                data-project-detail
                href={`/projects/${flagship.name}`}
                className="link-underline shrink-0 font-mono text-meta uppercase text-brand-ink transition-colors hover:text-brand-accent"
              >
                View case study &rarr;
              </Link>
            </div>
          </div>
        </article>
      </ProjectsMotion>
    </div>
  );
}
