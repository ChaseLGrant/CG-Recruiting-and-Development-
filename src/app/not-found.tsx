import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-black text-accent">404</h1>
      <h2 className="mb-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mb-8 max-w-md text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
        >
          Go Home
        </Link>
        <Link
          href="/players"
          className="rounded-xl border border-border bg-surface-2 px-6 py-3 font-semibold text-foreground hover:bg-surface-3"
        >
          Browse Players
        </Link>
        <Link
          href="/listings"
          className="rounded-xl border border-border bg-surface-2 px-6 py-3 font-semibold text-foreground hover:bg-surface-3"
        >
          Browse Listings
        </Link>
      </div>
    </div>
  )
}
