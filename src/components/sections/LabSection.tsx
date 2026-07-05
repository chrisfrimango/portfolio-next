import Link from "next/link";
import labData from "@/data/lab.json";

/**
 * Homepage teaser for the Lab: the experiments powering this very site.
 */
export default function LabSection() {
  return (
    <div className="w-full mx-auto max-w-7xl xl:max-w-8xl 2xl:max-w-screen-2xl px-4 sm:px-8 py-12">
      <p className="text-lg sm:text-xl text-brand-ink/80 max-w-2xl mb-10">
        {labData.intro}
      </p>
      <ul className="divide-y divide-brand-ink/10 border-y border-brand-ink/10">
        {labData.entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href="/lab"
              className="group flex items-baseline gap-4 py-5 hover:bg-brand-ink/[0.03] transition-colors"
            >
              <span className="font-display italic text-brand-accent text-lg shrink-0">
                {entry.id}
              </span>
              <span className="font-display text-2xl sm:text-3xl text-brand-ink group-hover:text-brand-accent transition-colors">
                {entry.title}
              </span>
              <span className="ml-auto text-brand-gray text-sm hidden sm:inline">
                &rarr;
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/lab"
        className="inline-block mt-8 text-sm text-brand-gray hover:text-brand-ink transition-colors"
      >
        All experiments &rarr;
      </Link>
    </div>
  );
}
