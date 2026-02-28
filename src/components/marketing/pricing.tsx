import Link from "next/link";

const included = [
  "Custom premium website (5+ pages)",
  "Complete brand identity & positioning",
  "Irresistible offer design",
  "Stripe payment integration",
  "30-day launch roadmap",
  "AI automation setup & guidance",
  "30-day async support",
  "Onboarding strategy call",
  "2 revision rounds included",
  "Launch-day checklist",
];

export function Pricing() {
  return (
    <section id="pricing" className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-light)] px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            One Investment.
            <br />
            <span className="gradient-text">Everything Included.</span>
          </h2>
          <p className="text-lg text-[var(--color-muted)]">
            No hidden fees. No add-ons. No surprises. Just results.
          </p>
        </div>

        {/* Pricing card */}
        <div className="mx-auto max-w-2xl">
          <div className="relative rounded-3xl border border-[var(--color-accent)]/40 bg-[var(--color-surface-2)] p-8 sm:p-10 animate-pulse-glow">
            {/* Top badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-accent)] px-6 py-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-white">
                Most Popular
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-black text-white mb-1">
                  Founder Launch Package
                </h3>
                <p className="text-[var(--color-muted)] text-sm">
                  Complete done-for-you business launch
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="flex items-end gap-2 justify-end">
                  <span className="text-5xl sm:text-6xl font-black text-white leading-none">
                    $3,000
                  </span>
                </div>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  One-time · or 2 payments of $1,600
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--color-border)] mb-8" />

            {/* What's included */}
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-5">
                Everything Included
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-[var(--color-foreground)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <Link
              href="/apply"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-bold text-white hover:bg-[var(--color-accent-hover)] btn-glow transition-all duration-200 hover:scale-[1.02] hover:-translate-y-0.5"
            >
              Apply for Founder Launch
              <svg
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            {/* Trust note */}
            <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
              Limited spots available each month · Application required
            </p>
          </div>

          {/* Guarantee */}
          <div className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <svg
              className="h-5 w-5 shrink-0 text-[var(--color-success)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
            <p className="text-xs text-[var(--color-muted)]">
              <span className="text-white font-medium">Work guarantee:</span> We don&apos;t stop until your business is fully launched and ready to accept clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
