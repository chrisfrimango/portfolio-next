import Link from "next/link";
import SayHiContent from "@/app/sayhi/say-hi-content";

/**
 * The dusk act: typography-led contact — the email address is the CTA,
 * set on the content spine like everything else.
 */
export default function SayHiSection() {
  return (
    <div className="w-full mx-auto max-w-content px-5 sm:px-8 lg:px-12 py-12 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:items-end">
      <div className="lg:col-span-6">
        <SayHiContent />
      </div>
      <div className="mt-12 lg:mt-0 lg:col-start-8 lg:col-span-5 flex flex-col gap-6">
        <Link
          href="mailto:christoffer.k.friman@gmail.com"
          className="link-underline font-display text-statement text-brand-ink hover:text-brand-accent transition-colors break-all"
        >
          christoffer.k.friman@gmail.com
        </Link>
        <div className="flex gap-8">
          <Link
            href="https://www.linkedin.com/in/christoffer-friman/"
            target="_blank"
            className="text-meta font-medium uppercase text-brand-gray hover:text-brand-accent transition-colors"
          >
            LinkedIn &nearr;
          </Link>
          <Link
            href="https://github.com/chrisfrimango"
            target="_blank"
            className="text-meta font-medium uppercase text-brand-gray hover:text-brand-accent transition-colors"
          >
            GitHub &nearr;
          </Link>
        </div>
      </div>
    </div>
  );
}
