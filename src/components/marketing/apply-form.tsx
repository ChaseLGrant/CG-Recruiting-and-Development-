"use client";

import { useState, FormEvent } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  whatBuilding: string;
  monthlyRevenue: string;
  timeline: string;
}

const revenueOptions = [
  { value: "", label: "Select current monthly revenue" },
  { value: "pre-revenue", label: "$0 — Pre-revenue / just starting" },
  { value: "1-1k", label: "Under $1,000/month" },
  { value: "1k-5k", label: "$1,000 – $5,000/month" },
  { value: "5k-10k", label: "$5,000 – $10,000/month" },
  { value: "10k-plus", label: "$10,000+/month" },
];

const timelineOptions = [
  { value: "", label: "Select your ideal timeline" },
  { value: "asap", label: "ASAP — I&apos;m ready now" },
  { value: "2-weeks", label: "Within 2 weeks" },
  { value: "1-month", label: "Within a month" },
  { value: "flexible", label: "Flexible — just planning ahead" },
];

export function ApplyForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatBuilding: "",
    monthlyRevenue: "",
    timeline: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.whatBuilding.trim() || formData.whatBuilding.trim().length < 20) {
      newErrors.whatBuilding = "Please describe what you're building (at least 20 characters)";
    }
    if (!formData.monthlyRevenue) newErrors.monthlyRevenue = "Please select your current revenue";
    if (!formData.timeline) newErrors.timeline = "Please select your timeline";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setFormState("submitting");

    try {
      // ─── Option A: Formspree ──────────────────────────────────────────
      // Replace FORMSPREE_ID with your actual Formspree endpoint ID
      // const FORMSPREE_ENDPOINT = "https://formspree.io/f/FORMSPREE_ID";
      // const response = await fetch(FORMSPREE_ENDPOINT, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json", Accept: "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // if (!response.ok) throw new Error("Submission failed");

      // ─── Option B: Supabase ───────────────────────────────────────────
      // import { createClient } from "@supabase/supabase-js";
      // const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      // const { error } = await supabase.from("applications").insert([formData]);
      // if (error) throw error;

      // ─── Default: API route (recommended for production) ─────────────
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Submission failed");

      setFormState("success");
    } catch {
      setFormState("error");
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (formState === "success") {
    return (
      <div className="rounded-2xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/5 p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-success)]/20">
          <svg
            className="h-8 w-8 text-[var(--color-success)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-white mb-3">Application Received!</h3>
        <p className="text-[var(--color-muted)] mb-6 max-w-sm mx-auto">
          We&apos;ll review your application and reach out within{" "}
          <span className="text-white font-medium">48 hours</span> to schedule your strategy call.
        </p>
        <p className="text-sm text-[var(--color-muted)]">
          In the meantime, keep that founder energy going. 🚀
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
          Full Name <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={`w-full rounded-xl border bg-[var(--color-surface-2)] px-4 py-3.5 text-sm text-white placeholder-[var(--color-muted)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
            errors.name ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
          }`}
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p id="name-error" className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
          Email Address <span className="text-[var(--color-accent)]">*</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@yourcompany.com"
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={`w-full rounded-xl border bg-[var(--color-surface-2)] px-4 py-3.5 text-sm text-white placeholder-[var(--color-muted)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
            errors.email ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
          }`}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* What are you building */}
      <div>
        <label htmlFor="whatBuilding" className="block text-sm font-semibold text-white mb-2">
          What are you trying to build? <span className="text-[var(--color-accent)]">*</span>
        </label>
        <textarea
          id="whatBuilding"
          rows={4}
          placeholder="Tell us about your idea, what problem you're solving, who your ideal customer is, and what you've done so far..."
          value={formData.whatBuilding}
          onChange={(e) => updateField("whatBuilding", e.target.value)}
          className={`w-full rounded-xl border bg-[var(--color-surface-2)] px-4 py-3.5 text-sm text-white placeholder-[var(--color-muted)] outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 resize-none ${
            errors.whatBuilding ? "border-[var(--color-error)]" : "border-[var(--color-border)]"
          }`}
          aria-describedby={errors.whatBuilding ? "building-error" : undefined}
          aria-invalid={!!errors.whatBuilding}
        />
        <div className="flex justify-between mt-1.5">
          {errors.whatBuilding ? (
            <p id="building-error" className="text-xs text-[var(--color-error)]" role="alert">
              {errors.whatBuilding}
            </p>
          ) : (
            <span />
          )}
          <span className={`text-xs ${formData.whatBuilding.length < 20 ? "text-[var(--color-muted)]" : "text-[var(--color-success)]"}`}>
            {formData.whatBuilding.length} chars
          </span>
        </div>
      </div>

      {/* Revenue & Timeline row */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Revenue */}
        <div>
          <label htmlFor="monthlyRevenue" className="block text-sm font-semibold text-white mb-2">
            Current Monthly Revenue <span className="text-[var(--color-accent)]">*</span>
          </label>
          <div className="relative">
            <select
              id="monthlyRevenue"
              value={formData.monthlyRevenue}
              onChange={(e) => updateField("monthlyRevenue", e.target.value)}
              className={`w-full appearance-none rounded-xl border bg-[var(--color-surface-2)] px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 pr-10 ${
                formData.monthlyRevenue ? "text-white" : "text-[var(--color-muted)]"
              } ${errors.monthlyRevenue ? "border-[var(--color-error)]" : "border-[var(--color-border)]"}`}
              aria-describedby={errors.monthlyRevenue ? "revenue-error" : undefined}
              aria-invalid={!!errors.monthlyRevenue}
            >
              {revenueOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#18181b] text-white">
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="h-4 w-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.monthlyRevenue && (
            <p id="revenue-error" className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
              {errors.monthlyRevenue}
            </p>
          )}
        </div>

        {/* Timeline */}
        <div>
          <label htmlFor="timeline" className="block text-sm font-semibold text-white mb-2">
            Ideal Launch Timeline <span className="text-[var(--color-accent)]">*</span>
          </label>
          <div className="relative">
            <select
              id="timeline"
              value={formData.timeline}
              onChange={(e) => updateField("timeline", e.target.value)}
              className={`w-full appearance-none rounded-xl border bg-[var(--color-surface-2)] px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20 pr-10 ${
                formData.timeline ? "text-white" : "text-[var(--color-muted)]"
              } ${errors.timeline ? "border-[var(--color-error)]" : "border-[var(--color-border)]"}`}
              aria-describedby={errors.timeline ? "timeline-error" : undefined}
              aria-invalid={!!errors.timeline}
            >
              {timelineOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#18181b] text-white">
                  {opt.label.replace(/&apos;/g, "'")}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="h-4 w-4 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.timeline && (
            <p id="timeline-error" className="mt-1.5 text-xs text-[var(--color-error)]" role="alert">
              {errors.timeline}
            </p>
          )}
        </div>
      </div>

      {/* Error state */}
      {formState === "error" && (
        <div className="rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/5 p-4" role="alert">
          <p className="text-sm text-[var(--color-error)] font-medium">
            Something went wrong. Please try again or email us at{" "}
            <a href="mailto:hello@founderlaunchweb.com" className="underline hover:no-underline">
              hello@founderlaunchweb.com
            </a>
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={formState === "submitting"}
        className="group w-full flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-8 py-4 text-base font-bold text-white hover:bg-[var(--color-accent-hover)] btn-glow transition-all duration-200 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {formState === "submitting" ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            Submit My Application
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
          </>
        )}
      </button>

      <p className="text-center text-xs text-[var(--color-muted)]">
        We review every application personally. You&apos;ll hear back within 48 hours.
      </p>
    </form>
  );
}
