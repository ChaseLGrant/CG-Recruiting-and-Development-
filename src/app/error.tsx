'use client'

import Link from 'next/link'

export default function Error({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-black text-accent">500</h1>
      <h2 className="mb-4 text-2xl font-bold">Something went wrong</h2>
      <p className="mb-8 max-w-md text-muted">
        An unexpected error occurred. Please try again or return to the home page.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={reset}
          className="rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-border bg-surface-2 px-6 py-3 font-semibold text-foreground hover:bg-surface-3"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
