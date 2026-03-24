import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { Tournament } from '@/lib/types'

interface SearchParams {
  location?: string
  date?: string
  sport?: string
}

export default async function BrowseTournamentsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('tournaments')
    .select(`
      *,
      profiles (full_name, email),
      tournament_registrations (id, payment_status)
    `)
    .eq('is_active', true)
    .order('date', { ascending: true })

  if (params.location) {
    query = query.ilike('location', `%${params.location}%`)
  }
  if (params.date) {
    query = query.gte('date', params.date)
  }
  if (params.sport) {
    query = query.eq('sport', params.sport)
  }

  const { data: tournaments } = await query

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Browse Tournaments</h1>
          <p className="mt-1 text-muted">Find open tournaments near you and register your team</p>
        </div>
        <Link
          href="/tournaments/create"
          className="shrink-0 rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
        >
          + Create Tournament
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="location"
          defaultValue={params.location}
          placeholder="Filter by location..."
          className="rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none sm:w-48"
        />
        <input
          type="date"
          name="date"
          defaultValue={params.date}
          className="rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none sm:w-48"
        />
        <select
          name="sport"
          defaultValue={params.sport}
          className="rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none sm:w-40"
        >
          <option value="">All Sports</option>
          <option value="baseball">Baseball</option>
          <option value="softball">Softball</option>
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            Filter
          </button>
          {(params.location || params.date || params.sport) && (
            <Link
              href="/tournaments"
              className="rounded-lg border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-muted hover:text-foreground"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {/* Tournament grid */}
      {!tournaments || tournaments.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface py-20 text-center">
          <div className="mb-4 text-5xl">⚾</div>
          <h3 className="mb-2 text-xl font-bold">No tournaments found</h3>
          <p className="mb-6 text-muted">
            {params.location || params.date || params.sport
              ? 'Try adjusting your filters'
              : 'Be the first to create one!'}
          </p>
          <Link
            href="/tournaments/create"
            className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
          >
            Create a Tournament
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(tournaments as (Tournament & { profiles: { full_name: string | null; email: string } | null; tournament_registrations: { id: string; payment_status: string }[] })[]).map(t => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  )
}

function TournamentCard({
  tournament,
}: {
  tournament: Tournament & {
    profiles: { full_name: string | null; email: string } | null
    tournament_registrations: { id: string; payment_status: string }[]
  }
}) {
  const paidRegistrations = tournament.tournament_registrations?.filter(
    r => r.payment_status === 'paid' || r.payment_status === 'free'
  ).length ?? 0
  const spotsLeft = tournament.max_teams - paidRegistrations
  const isFull = spotsLeft <= 0
  const formattedDate = new Date(tournament.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/tournaments/${tournament.id}`} className="group block">
      <div className="h-full rounded-2xl border border-border bg-surface p-6 transition hover:border-accent/40 hover:bg-surface-2">
        {/* Sport badge + format */}
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-surface-3 px-3 py-1 text-xs font-semibold text-muted capitalize">
            {tournament.sport}
          </span>
          <span className="text-xs text-muted capitalize">
            {tournament.format === 'round_robin' ? 'Round Robin' : 'Bracket'}
          </span>
        </div>

        {/* Name */}
        <h3 className="mb-1 text-lg font-bold leading-tight group-hover:text-accent transition-colors">
          {tournament.name}
        </h3>

        {/* Location & date */}
        <div className="mb-4 space-y-1 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {tournament.location}
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            {formattedDate}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-black text-foreground">
              {tournament.entry_fee > 0 ? `$${tournament.entry_fee}` : 'Free'}
            </span>
            {tournament.entry_fee > 0 && (
              <span className="ml-1 text-xs text-muted">entry</span>
            )}
          </div>
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isFull
              ? 'bg-error/10 text-error'
              : spotsLeft <= 2
              ? 'bg-warning/10 text-warning'
              : 'bg-success/10 text-success'
          }`}>
            {isFull ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </div>
        </div>
      </div>
    </Link>
  )
}
