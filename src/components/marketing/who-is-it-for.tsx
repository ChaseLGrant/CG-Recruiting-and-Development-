import Link from "next/link";

const fits = [
  {
    icon: "💡",
    title: "The Idea-Stage Founder",
    description:
      "You have a concept, a skill, or a passion — but you've been stuck in planning mode for months. You're ready to stop thinking and start building.",
  },
  {
    icon: "🎯",
    title: "The Coach or Consultant",
    description:
      "You have expertise to sell but no professional online presence. You know you could charge premium rates — you just need the infrastructure to match.",
  },
  {
    icon: "🎨",
    title: "The Creator or Freelancer",
    description:
      "You're doing the work but leaving money on the table. You need a real brand and offer that attracts higher-quality clients at higher prices.",
  },
  {
    icon: "🏆",
    title: "The Athlete or Personal Brand",
    description:
      "You have a name, a story, and an audience. Now it's time to turn that into a business — merchandise, coaching, or digital products.",
  },
  {
    icon: "🚀",
    title: "The Side-Hustle Launcher",
    description:
      "You have a 9-5 but you're building something on the side. You want to do it right the first time — professional, scalable, and ready to grow.",
  },
  {
    icon: "⚡",
    title: "The Service Provider",
    description:
      "You do the work but your digital presence doesn't reflect your skill level. Time to build a business that attracts clients instead of chasing them.",
  },
];

const notFor = [
  "People who aren't serious about investing in their growth",
  "Those looking for a get-rich-quick shortcut",
  "People unwilling to show up and do the strategy work",
  "Businesses already generating $50K+/month (you need scaling, not launching)",
];

export function WhoIsItFor() {
  return (
    <section id="who-is-it-for" className="section-padding relative bg-[var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-light)] px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Ideal Fit
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Who This Is For
          </h2>
          <p className="text-lg text-[var(--color-muted)]">
            We work with a small group of founders each month. Here&apos;s who gets the most out of Founder Launch.
          </p>
        </div>

        {/* Ideal customers grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {fits.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface-3)] transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Not for section */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8">
          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-error)]/10 text-[var(--color-error)]">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </span>
            This is NOT for you if...
          </h3>
          <ul className="space-y-3">
            {notFor.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-error)]/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <span className="text-sm text-[var(--color-muted)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA nudge */}
        <div className="mt-12 text-center">
          <p className="text-[var(--color-muted)] mb-4">
            Sound like you?{" "}
            <span className="text-white">Let&apos;s talk about your launch.</span>
          </p>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-6 py-3 text-sm font-semibold text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-all duration-200"
          >
            Apply for Founder Launch →
          </Link>
        </div>
      </div>
    </section>
  );
}
