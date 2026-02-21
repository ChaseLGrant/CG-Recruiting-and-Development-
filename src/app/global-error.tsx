'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en" className="dark">
      <body
        style={{
          backgroundColor: '#0a0a0a',
          color: '#ededed',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1
            style={{
              fontSize: '3.75rem',
              fontWeight: 900,
              color: '#f97316',
              marginBottom: '0.5rem',
            }}
          >
            500
          </h1>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              color: '#888',
              marginBottom: '2rem',
              maxWidth: '28rem',
              marginInline: 'auto',
            }}
          >
            An unexpected error occurred. Please try again or return to the home
            page.
          </p>
          {error.digest && (
            <p
              style={{
                color: '#666',
                fontSize: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              Error ID: {error.digest}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={reset}
              style={{
                backgroundColor: '#f97316',
                color: '#fff',
                border: 'none',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                backgroundColor: '#1e1e1e',
                color: '#ededed',
                border: '1px solid #333',
                borderRadius: '0.75rem',
                padding: '0.75rem 1.5rem',
                fontWeight: 600,
                fontSize: '1rem',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Go Home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
