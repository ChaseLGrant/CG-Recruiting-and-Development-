import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(59,130,246,0.15) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Top border line with glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4 max-w-2xl"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Limited spots available
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          Your business isn&apos;t going
          <br />
          <span className="gradient-text">to build itself.</span>
        </h2>

        {/* Supporting copy */}
        <p className="mx-auto max-w-xl text-lg text-[var(--color-muted)] mb-10 leading-relaxed">
          Every day you wait is a day someone else in your market takes your spot.
          You have the idea. We have the execution.{" "}
          <span className="text-white font-medium">Let&apos;s build.</span>
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/apply"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-10 py-5 text-base font-bold text-white hover:bg-[var(--color-accent-hover)] btn-glow transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 w-full sm:w-auto justify-center"
          >
            Start My Launch
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
          <a
            href="/#how-it-works"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-white transition-colors"
          >
            See how it works ↓
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: "⚡", text: "30-day delivery" },
            { icon: "🔒", text: "Secure payment" },
            { icon: "🎯", text: "Done for you" },
            { icon: "💬", text: "30-day support" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <span aria-hidden="true">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
