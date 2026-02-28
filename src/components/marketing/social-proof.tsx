export function SocialProof() {
  const brandLogos = [
    "FOUNDER CO.",
    "ATLAS BRAND",
    "PEAK CREATOR",
    "VELOCITY INC",
    "RISE STUDIO",
    "APEX MEDIA",
    "LAUNCH PAD",
    "BUILD LABS",
  ];

  return (
    <section className="relative border-y border-[var(--color-border)] bg-[var(--color-surface)] py-10 overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-24 z-10 bg-gradient-to-r from-[var(--color-surface)] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-24 z-10 bg-gradient-to-l from-[var(--color-surface)] to-transparent" aria-hidden="true" />

      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Trusted by founders, creators, and athletes
        </p>
      </div>

      {/* Marquee */}
      <div className="flex overflow-hidden" aria-label="Client logos">
        <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
          {[...brandLogos, ...brandLogos].map((logo, i) => (
            <div
              key={`logo-${i}`}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <div className="h-6 w-6 rounded bg-[var(--color-surface-3)] flex items-center justify-center">
                <div className="h-3 w-3 rounded-sm bg-[var(--color-muted-2)]" />
              </div>
              <span className="text-sm font-bold text-[var(--color-muted-2)] tracking-wider">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
