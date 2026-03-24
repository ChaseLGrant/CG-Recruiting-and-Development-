import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/8 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Baseball &amp; Softball Tournaments
          </div>
          <h1 className="mb-6 text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
            Run your own
            <span className="block text-accent">games.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted sm:text-xl">
            Create a tournament in minutes. Share a link. Get teams signed up and paid — all in one place.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auth/signup?role=host"
              className="w-full rounded-xl bg-accent px-8 py-4 text-center text-base font-bold text-white hover:bg-accent-hover sm:w-auto"
            >
              Create a Tournament
            </Link>
            <Link
              href="/tournaments"
              className="w-full rounded-xl border border-border bg-surface-2 px-8 py-4 text-center text-base font-semibold text-foreground hover:bg-surface-3 sm:w-auto"
            >
              Browse Tournaments
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">From idea to tournament in 5 minutes</h2>
          <p className="mb-16 text-center text-muted">No paperwork. No spreadsheets. No chasing payments.</p>
          <div className="grid gap-8 md:grid-cols-3">
            <Step
              number="01"
              title="Create your tournament"
              description="Set your date, location, entry fee, format, and number of teams. One form, done."
            />
            <Step
              number="02"
              title="Share your link"
              description="Every tournament gets a shareable page. Post it to your group chat or social. Teams find it instantly."
            />
            <Step
              number="03"
              title="Teams pay to join"
              description="Secure Stripe checkout. Entry fees collected automatically. You see who's in and how much you've made."
            />
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-4 text-center text-3xl font-bold">Everything you need to run it</h2>
          <p className="mb-16 text-center text-muted">Built for coaches, parents, and league organizers.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon="🏟️"
              title="Tournament Builder"
              description="Round robin or single elimination bracket. Set max teams, entry fee, and sport."
            />
            <FeatureCard
              icon="💳"
              title="Stripe Payments"
              description="Teams pay securely at sign-up. No cash, no Venmo. All tracked automatically."
            />
            <FeatureCard
              icon="🔗"
              title="Shareable Links"
              description="Every tournament gets a unique URL. Share once, teams join from anywhere."
            />
            <FeatureCard
              icon="📊"
              title="Host Dashboard"
              description="See who's registered, payment status, and total revenue in one clean view."
            />
            <FeatureCard
              icon="📅"
              title="Auto Scheduling"
              description="Matchups generated automatically once teams are set. No manual bracket work."
            />
            <FeatureCard
              icon="📱"
              title="Mobile First"
              description="Works perfectly on phones. Teams can join and pay from the sideline."
            />
          </div>
        </div>
      </section>

      {/* Role split */}
      <section className="border-t border-border bg-surface py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-2xl">
                🏆
              </div>
              <h3 className="mb-2 text-2xl font-bold">Hosting a tournament?</h3>
              <p className="mb-6 text-muted">
                Create your event, set the entry fee, and watch teams sign up and pay. Track everything from your dashboard.
              </p>
              <ul className="mb-8 space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Unlimited tournaments</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Automated payments</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Revenue dashboard</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Schedule generation</li>
              </ul>
              <Link
                href="/auth/signup?role=host"
                className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
              >
                Host a Tournament
              </Link>
            </div>

            <div className="rounded-2xl border border-border bg-surface-2 p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-surface-3 text-2xl">
                ⚾
              </div>
              <h3 className="mb-2 text-2xl font-bold">Looking to compete?</h3>
              <p className="mb-6 text-muted">
                Browse open tournaments near you, register your team, and pay the entry fee — all before the first pitch.
              </p>
              <ul className="mb-8 space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Browse all tournaments</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Filter by date & location</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Secure checkout</li>
                <li className="flex items-center gap-2"><span className="text-accent">✓</span> Registration history</li>
              </ul>
              <Link
                href="/tournaments"
                className="inline-block rounded-lg border border-border bg-surface-3 px-6 py-3 font-semibold text-foreground hover:bg-border"
              >
                Find a Tournament
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="mb-4 text-4xl font-black">Ready to run it?</h2>
          <p className="mb-8 text-lg text-muted">Free to get started. 5% platform fee on paid entries only.</p>
          <Link
            href="/auth/signup"
            className="inline-block rounded-xl bg-accent px-10 py-4 text-lg font-bold text-white hover:bg-accent-hover"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-xl font-black text-accent">
        {number}
      </div>
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-3 text-2xl">{icon}</div>
      <h3 className="mb-1.5 font-bold">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  )
}
