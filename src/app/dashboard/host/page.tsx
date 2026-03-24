import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Tournament, TournamentRegistration } from '@/lib/types'

export default async function HostDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  // Allow both 'host' and 'coach' roles to use this dashboard
  if (profile.role !== 'host' && profile.role !== 'coach') {
    redirect(`/dashboard/${profile.role}`)
  }

  // Fetch host's tournaments with registrations
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select(`
      *,
      tournament_registrations (*)
    `)
    .eq('host_id', user.id)
    .order('date', { ascending: true })

  const allTournaments = (tournaments || []) as (Tournament & {
    tournament_registrations: TournamentRegistration[]
  })[]

  // Stats
  const totalRevenue = allTournaments.reduce((sum, t) => {
    const paidRegs = t.tournament_registrations.filter(r => r.payment_status === 'paid')
    return sum + paidRegs.reduce((s, r) => s + (r.amount_paid || 0), 0)
  }, 0)

  const platformFees = totalRevenue * 0.05
  const netRevenue = totalRevenue - platformFees

  const totalTeams = allTournaments.reduce(
    (sum, t) =>
      sum +
      t.tournament_registrations.filter(
        r => r.payment_status === 'paid' || r.payment_status === 'free'
      ).length,
    0
  )

  const upcomingTournaments = allTournaments.filter(
    t => new Date(t.date + 'T12:00:00') >= new Date()
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">Welcome back</p>
          <h1 className="text-3xl font-black">
            {profile.full_name || profile.email}
          </h1>
        </div>
        <Link
          href="/tournaments/create"
          className="shrink-0 rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
        >
          + New Tournament
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Tournaments" value={allTournaments.length.toString()} />
        <StatCard label="Teams Joined" value={totalTeams.toString()} />
        <StatCard
          label="Gross Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          sub="before 5% fee"
        />
        <StatCard
          label="Net Revenue"
          value={`$${netRevenue.toFixed(2)}`}
          sub="after 5% fee"
          accent
        />
      </div>

      {/* Tournaments */}
      {allTournaments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface py-20 text-center">
          <div className="mb-4 text-5xl">🏟️</div>
          <h3 className="mb-2 text-xl font-bold">No tournaments yet</h3>
          <p className="mb-6 text-muted">Create your first tournament and start collecting registrations.</p>
          <Link
            href="/tournaments/create"
            className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
          >
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Upcoming */}
          {upcomingTournaments.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold">Upcoming</h2>
              <div className="space-y-3">
                {upcomingTournaments.map(t => (
                  <TournamentRow key={t.id} tournament={t} />
                ))}
              </div>
            </section>
          )}

          {/* Past */}
          {allTournaments.filter(t => new Date(t.date + 'T12:00:00') < new Date()).length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-muted">Past</h2>
              <div className="space-y-3">
                {allTournaments
                  .filter(t => new Date(t.date + 'T12:00:00') < new Date())
                  .map(t => <TournamentRow key={t.id} tournament={t} past />)
                }
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub?: string
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? 'border-accent/20 bg-accent/5' : 'border-border bg-surface'
      }`}
    >
      <p className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</p>
      <p className={`mt-1 text-2xl font-black ${accent ? 'text-accent' : ''}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
    </div>
  )
}

function TournamentRow({
  tournament,
  past,
}: {
  tournament: Tournament & { tournament_registrations: TournamentRegistration[] }
  past?: boolean
}) {
  const confirmedTeams = tournament.tournament_registrations.filter(
    r => r.payment_status === 'paid' || r.payment_status === 'free'
  )
  const pendingTeams = tournament.tournament_registrations.filter(
    r => r.payment_status === 'pending'
  )
  const revenue = confirmedTeams.reduce(
    (sum, r) => sum + (r.amount_paid || 0),
    0
  )
  const spotsLeft = tournament.max_teams - confirmedTeams.length
  const formattedDate = new Date(tournament.date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className={`rounded-2xl border border-border bg-surface p-5 ${past ? 'opacity-70' : ''}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/tournaments/${tournament.id}`}
              className="font-bold text-lg hover:text-accent transition-colors"
            >
              {tournament.name}
            </Link>
            <span className="rounded-full bg-surface-3 px-2.5 py-0.5 text-xs font-semibold text-muted capitalize">
              {tournament.sport}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted">
            {tournament.location} · {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-center">
            <div className="text-lg font-black">{confirmedTeams.length}/{tournament.max_teams}</div>
            <div className="text-xs text-muted">teams</div>
          </div>
          {tournament.entry_fee > 0 && (
            <div className="text-center">
              <div className="text-lg font-black text-accent">${revenue.toFixed(2)}</div>
              <div className="text-xs text-muted">collected</div>
            </div>
          )}
          {!past && spotsLeft > 0 && (
            <div className="text-center">
              <div className="text-lg font-black text-success">{spotsLeft}</div>
              <div className="text-xs text-muted">spots left</div>
            </div>
          )}
          <Link
            href={`/tournaments/${tournament.id}`}
            className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-semibold hover:bg-surface-3"
          >
            View →
          </Link>
        </div>
      </div>

      {/* Teams list */}
      {confirmedTeams.length > 0 && (
        <div className="mt-4 border-t border-border pt-4">
          <p className="mb-2 text-xs font-semibold text-muted uppercase tracking-wide">
            Registered Teams
          </p>
          <div className="flex flex-wrap gap-2">
            {confirmedTeams.map(r => (
              <span
                key={r.id}
                className="rounded-full bg-surface-2 px-3 py-1 text-xs font-medium border border-border"
              >
                {r.team_name}
                {r.payment_status === 'paid' && (
                  <span className="ml-1.5 text-success">✓</span>
                )}
              </span>
            ))}
            {pendingTeams.length > 0 && (
              <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning border border-warning/20">
                {pendingTeams.length} pending payment
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
