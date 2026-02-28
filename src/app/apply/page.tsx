import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ApplyForm } from "@/components/marketing/apply-form";

export const metadata: Metadata = {
  title: "Apply for Founder Launch",
  description:
    "Apply to work with Founder Launch and go from idea to fully launched online business in 30 days. Limited spots available each month.",
  openGraph: {
    title: "Apply for Founder Launch — Launch Your Business in 30 Days",
    description:
      "Tell us about your idea. We'll build your brand, website, and launch plan in 30 days for $3,000.",
  },
};

const benefits = [
  { icon: "⚡", text: "30-day delivery guarantee" },
  { icon: "🎯", text: "Done-for-you build" },
  { icon: "💬", text: "48-hour response time" },
  { icon: "🔒", text: "Secure & confidential" },
];

export default function ApplyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        {/* Background */}
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" aria-hidden="true" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left column — info */}
            <div className="lg:sticky lg:top-32">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
                  Limited spots available
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                Apply for
                <br />
                <span className="gradient-text">Founder Launch</span>
              </h1>
              <p className="text-lg text-[var(--color-muted)] mb-10 leading-relaxed">
                Fill out the short form. We review every application personally and respond within 48 hours. If it&apos;s a fit, we&apos;ll schedule a quick strategy call and lock in your start date.
              </p>

              {/* What happens next */}
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-5">
                  What happens after you apply
                </p>
                <div className="space-y-5">
                  {[
                    {
                      step: "01",
                      title: "We review your application",
                      desc: "Within 48 hours. We look at every submission personally.",
                    },
                    {
                      step: "02",
                      title: "20-minute strategy call",
                      desc: "If it&apos;s a fit, we schedule a quick call to align on your idea and goals.",
                    },
                    {
                      step: "03",
                      title: "Lock in your start date",
                      desc: "We confirm scope, timeline, and kick things off. 30 days to launch.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent)]/10 text-xs font-black text-[var(--color-accent)]">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white mb-0.5">{item.title}</p>
                        <p className="text-xs text-[var(--color-muted)]" dangerouslySetInnerHTML={{ __html: item.desc }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap gap-3">
                {benefits.map(({ icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2"
                  >
                    <span className="text-sm" aria-hidden="true">{icon}</span>
                    <span className="text-xs font-medium text-[var(--color-muted)]">{text}</span>
                  </div>
                ))}
              </div>

              {/* Price reminder */}
              <div className="mt-10 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-surface-2)] p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">Founder Launch Package</span>
                  <span className="text-2xl font-black text-white">$3,000</span>
                </div>
                <p className="text-xs text-[var(--color-muted)]">
                  One-time investment · or 2 payments of $1,600 · Everything included
                </p>
                <Link
                  href="/#pricing"
                  className="mt-3 inline-flex text-xs text-[var(--color-accent)] hover:text-white transition-colors"
                >
                  See what&apos;s included →
                </Link>
              </div>
            </div>

            {/* Right column — form */}
            <div>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-8 sm:p-10">
                <h2 className="text-xl font-bold text-white mb-1">
                  Tell us about your launch
                </h2>
                <p className="text-sm text-[var(--color-muted)] mb-8">
                  Takes about 3 minutes. All fields are required.
                </p>
                <ApplyForm />
              </div>

              {/* Bottom reassurance */}
              <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
                Questions?{" "}
                <a
                  href="mailto:hello@founderlaunchweb.com"
                  className="text-[var(--color-accent)] hover:text-white transition-colors"
                >
                  Email us directly
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
