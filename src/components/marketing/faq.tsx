"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How long does it actually take to launch?",
    a: "30 days from kick-off to live business. Week 1 is strategy and positioning. Week 2–3 is building your website and brand. Week 4 is final polish, payment setup, and your launch sequence. We run a tight ship — no scope creep, no endless revisions. 30 days, then you're live.",
  },
  {
    q: "Who is Founder Launch for?",
    a: "Founder Launch is for aspiring entrepreneurs, coaches, consultants, creators, service providers, athletes building personal brands, and anyone sitting on an idea that hasn't launched yet. If you're ready to go from idea to revenue-generating business in 30 days, this was built for you.",
  },
  {
    q: "What if I don't have any technical experience?",
    a: "You don't need any. That's the whole point. We handle the website build, brand design, payment integration, and tech setup. You focus on your strategy, your offer, and your audience. By the end, we'll walk you through everything so you can manage it yourself.",
  },
  {
    q: "What exactly is included in the $3,000 investment?",
    a: "Everything: a custom premium website (5+ pages), complete brand identity and positioning, offer design, Stripe payment integration, a 30-day launch roadmap, AI automation guidance, an onboarding strategy call, 30 days of async support, and 2 revision rounds. No hidden fees. No add-ons.",
  },
  {
    q: "Is there a payment plan available?",
    a: "Yes. You can pay in two installments: $1,600 upfront at kick-off and $1,600 at project completion before launch. The full $3,000 payment option is also available and gets priority scheduling.",
  },
  {
    q: "What's your refund policy?",
    a: "We don't offer refunds once work has begun — and honestly, that's because we're fully committed to delivering your launch. If we're not delivering on what was agreed, we'll make it right. We work until the job is done. The guarantee is our work, not a refund.",
  },
  {
    q: "How does the application process work?",
    a: "You fill out the short application on our Apply page. We review it within 48 hours. If it's a fit, we'll schedule a quick 20-minute call to align on your idea, timeline, and goals. Then we lock in your start date and get moving.",
  },
  {
    q: "Will my website be ready to accept clients on day 30?",
    a: "That's the goal — and the standard. Your website, payment system, and launch assets are all designed to convert from day one. You'll launch with a client-ready business, not a work-in-progress.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative bg-[var(--color-surface)]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-light)] px-3 py-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Questions? Answered.
          </h2>
          <p className="text-lg text-[var(--color-muted)]">
            Everything you need to know before applying.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-xl border transition-all duration-200 ${
                  isOpen
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-surface-2)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-border-light)]"
                }`}
              >
                <button
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-white leading-snug">
                    {faq.q}
                  </span>
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-[var(--color-accent)] text-white rotate-45"
                        : "bg-[var(--color-surface-3)] text-[var(--color-muted)]"
                    }`}
                    aria-hidden="true"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-5">
                    <div className="border-t border-[var(--color-border)] pt-4">
                      <p className="text-sm text-[var(--color-muted)] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-10 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-6 text-center">
          <p className="text-[var(--color-muted)] mb-3 text-sm">
            Still have a question that&apos;s not answered here?
          </p>
          <a
            href="mailto:hello@founderlaunchweb.com"
            className="text-sm font-semibold text-[var(--color-accent)] hover:text-white transition-colors"
          >
            Email us → hello@founderlaunchweb.com
          </a>
        </div>
      </div>
    </section>
  );
}
