"use client";

import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 grid-pattern" aria-hidden="true" />
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />

      {/* Glow orbs */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Done-for-you business launch
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6">
          Launch Your
          <br />
          <span className="gradient-text">Business in</span>
          <br />
          30 Days.
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up delay-200 mx-auto max-w-2xl text-lg sm:text-xl text-[var(--color-muted)] leading-relaxed mb-10">
          We build your brand, website, and launch plan —{" "}
          <span className="text-white font-medium">so you can focus on winning.</span>
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/apply"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-bold text-white hover:bg-[var(--color-accent-hover)] btn-glow transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5 w-full sm:w-auto justify-center"
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
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-2)]/60 px-8 py-4 text-base font-medium text-white hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-3)] transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto justify-center"
          >
            See How It Works
          </a>
        </div>

        {/* Social proof micro-stats */}
        <div className="animate-fade-in-up delay-400 flex flex-wrap items-center justify-center gap-8">
          {[
            { value: "30", label: "Days to launch" },
            { value: "$3K", label: "All-in investment" },
            { value: "100%", label: "Done for you" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-[var(--color-muted)] uppercase tracking-wider mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-700">
        <span className="text-xs text-[var(--color-muted)] uppercase tracking-widest">Scroll</span>
        <div className="h-8 w-0.5 bg-gradient-to-b from-[var(--color-accent)] to-transparent rounded-full" />
      </div>
    </section>
  );
}
