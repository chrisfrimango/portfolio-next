import SayHiContent from "@/app/sayhi/say-hi-content";

const CONTACTS = [
  { label: "Mail", href: "mailto:christoffer.k.friman@gmail.com", external: false },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/christoffer-friman/",
    external: true,
  },
];

/**
 * The dusk act: a typographic invitation on the left, a large interactive
 * contact index on the right. The email address is never printed — it lives
 * behind the "Mail" link. The coordinate ties the close back to MERIDIAN.
 */
export default function SayHiSection() {
  return (
    <div className="mx-auto w-full max-w-content px-5 sm:px-8 lg:px-12 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-6 lg:items-end">
        {/* Invitation */}
        <div className="lg:col-span-6">
          <SayHiContent />
          <p className="mt-8 max-w-[24ch] font-display text-statement text-brand-ink">
            Thinking about your next step in digital transformation?
            Let&rsquo;s talk about where it could go.
          </p>
        </div>

        {/* Contact index */}
        <div className="mt-14 lg:mt-0 lg:col-start-8 lg:col-span-5">
          <ul className="border-t border-brand-ink/15">
            {CONTACTS.map((c) => (
              <li key={c.label} className="border-b border-brand-ink/15">
                <a
                  href={c.href}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  className="group flex items-center justify-between py-4 font-display text-title text-brand-ink transition-colors hover:text-brand-accent"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    {c.label}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-meta text-brand-gray transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-accent"
                  >
                    &#8599;
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-mono text-meta uppercase text-brand-gray">
            Trollhättan &middot; 58.28&deg;N
          </p>
        </div>
      </div>
    </div>
  );
}
