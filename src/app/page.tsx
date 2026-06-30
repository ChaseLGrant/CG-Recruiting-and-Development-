import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Summer Ball Portal for College Baseball Players',
  description:
    'Browse hundreds of college baseball players available for summer ball. Coaches post players, summer teams find talent, and players connect with opportunities across the country.',
  alternates: {
    canonical: 'https://www.cgrecruitingbaseball.com',
  },
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'CG Recruiting Baseball',
            url: 'https://www.cgrecruitingbaseball.com',
            description:
              'The marketplace connecting college baseball players, coaches, and summer teams.',
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://www.cgrecruitingbaseball.com/players?q={search_term_string}',
              },
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
      {/* Hero */}
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Summer 2026 Season
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Connect Players with
            <span className="block text-accent">Summer Ball Opportunities</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted sm:text-xl">
            The marketplace for college programs, summer teams, and players.
            Post available players, find roster spots, and build your summer roster.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup"
              className="w-full rounded-xl bg-accent px-8 py-3.5 text-center font-bold text-white hover:bg-accent-hover sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link
              href="/players"
              className="w-full rounded-xl border border-border bg-surface-2 px-8 py-3.5 text-center font-semibold text-foreground hover:bg-surface-3 sm:w-auto"
            >
              Browse Players
            </Link>
          </div>
        </div>
      </section>

      {/* Role Cards */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-4 text-center text-3xl font-bold">Built for Every Role</h2>
        <p className="mb-12 text-center text-muted">
          Whether you&apos;re a coach, a summer team, or a player — we&apos;ve got you covered.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          <RoleCard
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
            title="College Coaches"
            description="Bulk-add your available players in seconds. Spreadsheet-style tools make it fast to post your entire roster."
            cta="Coach Sign Up"
            href="/auth/signup?role=coach"
            accent
          />
          <RoleCard
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            }
            title="Summer Teams & Leagues"
            description="Post open roster spots and find the talent you need. Browse profiles from top college programs."
            cta="Team Sign Up"
            href="/auth/signup?role=team"
          />
          <RoleCard
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            }
            title="Players"
            description="Create your profile, set your availability, and browse summer opportunities across the country."
            cta="Player Sign Up"
            href="/auth/signup?role=player"
          />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <Step number="1" title="Sign Up" description="Create your account as a Coach, Team, or Player in under a minute." />
            <Step number="2" title="Build Your Profile" description="Add your program, team listings, or player profile with all the details." />
            <Step number="3" title="Connect" description="Search, filter, and reach out. Express interest or contact players directly." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Find Your Match?</h2>
          <p className="mb-8 text-muted">
            Join coaches, teams, and players connecting for the summer season.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/players"
              className="w-full rounded-xl border border-border bg-surface-2 px-8 py-3.5 text-center font-semibold hover:bg-surface-3 sm:w-auto"
            >
              Browse Players
            </Link>
            <Link
              href="/listings"
              className="w-full rounded-xl border border-border bg-surface-2 px-8 py-3.5 text-center font-semibold hover:bg-surface-3 sm:w-auto"
            >
              Browse Team Listings
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function RoleCard({ icon, title, description, cta, href, accent }: {
  icon: React.ReactNode; title: string; description: string; cta: string; href: string; accent?: boolean
}) {
  return (
    <div className={`rounded-2xl border p-8 ${accent ? 'border-accent/30 bg-accent/5' : 'border-border bg-surface'}`}>
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent ? 'bg-accent/20 text-accent' : 'bg-surface-3 text-muted'}`}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="mb-6 text-sm text-muted">{description}</p>
      <Link
        href={href}
        className={`inline-block rounded-lg px-6 py-2.5 text-sm font-semibold ${
          accent
            ? 'bg-accent text-white hover:bg-accent-hover'
            : 'bg-surface-3 text-foreground hover:bg-border'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </div>
  )
}
