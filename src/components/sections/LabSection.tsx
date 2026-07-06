import Link from "next/link";
import labData from "@/data/lab.json";

/**
 * Homepage teaser for the Lab: the experiments powering this very site.
 */
export default function LabSection() {
  return (
    <div className="w-full mx-auto max-w-content px-5 sm:px-8 lg:px-12 py-12">
      <p className="font-display text-statement text-brand-ink max-w-2xl mb-12">
        {labData.intro}
      </p>
      <ul className="divide-y divide-brand-ink/10 border-y border-brand-ink/10">
        {labData.entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href="/lab"
              className="group flex items-baseline gap-5 py-6 hover:bg-brand-ink/[0.03] transition-colors"
            >
              <span className="font-display italic text-brand-accent text-statement w-12 shrink-0">
                {entry.id}
              </span>
              <span className="font-display text-statement text-brand-ink group-hover:text-brand-accent transition-colors">
                {entry.title}
              </span>
              <span className="hidden lg:block ml-auto max-w-[38ch] text-right text-body text-brand-gray">
                {entry.summary}
              </span>
              <span className="text-brand-gray text-sm hidden sm:inline shrink-0">
                &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/lab"
        className="inline-block mt-8 text-meta font-medium uppercase text-brand-gray hover:text-brand-ink transition-colors"
      >
        All experiments &rarr;
      </Link>
    </div>
  );
}
