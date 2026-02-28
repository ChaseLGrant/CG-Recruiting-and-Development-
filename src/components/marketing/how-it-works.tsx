const steps = [
  {
    number: "01",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Strategy & Positioning",
    description:
      "We deep-dive into your idea, market, and audience. You'll leave week one with a razor-sharp offer, a clear niche, and a positioning statement that makes you impossible to ignore.",
    tags: ["Offer Design", "Market Research", "Positioning"],
  },
  {
    number: "02",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
    title: "Build & Design",
    description:
      "We build your premium website, brand identity, and digital presence from scratch. Every pixel is intentional — designed to convert visitors into paying clients on day one.",
    tags: ["Website", "Brand Identity", "Payment Setup"],
  },
  {
    number: "03",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
    title: "Launch & Scale",
    description:
      "Go live with a proven launch sequence. We hand you a complete roadmap, AI automation tools, and a growth strategy — so your first client isn't your last.",
    tags: ["Launch Roadmap", "AI Automation", "Growth Strategy"],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-light)] px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              The Process
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-[var(--color-muted)]">
            Three focused phases. 30 days. One fully launched business.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-12 left-[calc(33.33%+1.5rem)] right-[calc(33.33%+1.5rem)] h-px"
            style={{
              background:
                "linear-gradient(90deg, var(--color-border) 0%, var(--color-accent) 50%, var(--color-border) 100%)",
            }}
            aria-hidden="true"
          />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Step number */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <span className="text-5xl font-black text-[var(--color-surface-3)] group-hover:text-[var(--color-border)] transition-colors duration-300">
                  {step.number}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-5">
                {step.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {step.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface-3)] px-2.5 py-1 text-xs font-medium text-[var(--color-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
