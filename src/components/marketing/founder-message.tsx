export function FounderMessage() {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--color-border-light)] bg-[var(--color-surface-2)] p-8 sm:p-12 lg:p-16">
          {/* Quote mark */}
          <div className="mb-8 text-7xl font-black text-[var(--color-accent)] leading-none select-none" aria-hidden="true">
            "
          </div>

          {/* Message */}
          <blockquote className="space-y-5 mb-10">
            <p className="text-xl sm:text-2xl font-medium text-white leading-relaxed">
              I built Founder Launch because I watched too many talented people — coaches, athletes, creators, service providers — stay stuck for years because they couldn't figure out the technical side of launching a business.
            </p>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              They had the skills. They had the drive. But they were drowning in decisions: What platform? What offer? How do I build a website? How do I get paid? The overwhelm killed the momentum before they even started.
            </p>
            <p className="text-lg text-white font-medium leading-relaxed">
              So we built a system. 30 days. Done for you. You show up, we build it together, and at the end — you have a real business you can sell from. Not a dream. Not a plan. A business.
            </p>
            <p className="text-xl sm:text-2xl font-bold text-[var(--color-accent)] leading-relaxed">
              The only thing between you and revenue is execution. Let&apos;s execute.
            </p>
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-border)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#6366f1] text-white font-black text-lg">
              FL
            </div>
            <div>
              <p className="font-bold text-white">The Founder Launch Team</p>
              <p className="text-sm text-[var(--color-muted)]">
                Builders, strategists, and launchers — for founders
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
