import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { JoinButton } from './JoinButton'
import type { Tournament, TournamentRegistration } from '@/lib/types'

function generateSchedule(
  teams: string[],
  format: 'bracket' | 'round_robin'
): { round: string; games: { home: string; away: string }[] }[] {
  if (teams.length < 2) return []

  if (format === 'round_robin') {
    // Round robin: every team plays every other team
    const rounds: { round: string; games: { home: string; away: string }[] }[] = []
    const n = teams.length
    // Simple round-robin scheduling (circle method)
    const teamList = [...teams]
    if (n % 2 !== 0) teamList.push('BYE')
    const total = teamList.length
    const roundCount = total - 1

    for (let r = 0; r < roundCount; r++) {
      const games: { home: string; away: string }[] = []
      for (let i = 0; i < total / 2; i++) {
        const home = teamList[i]
        const away = teamList[total - 1 - i]
        if (home !== 'BYE' && away !== 'BYE') {
          games.push({ home, away })
        }
      }
      rounds.push({ round: `Round ${r + 1}`, games })
      // Rotate all except the first element
      teamList.splice(1, 0, teamList.pop()!)
    }
    return rounds
  }

  // Single elimination bracket
  const rounds: { round: string; games: { home: string; away: string }[] }[] = []
  let currentTeams = [...teams]
  let roundNum = 1

  while (currentTeams.length > 1) {
    const games: { home: string; away: string }[] = []
    for (let i = 0; i < currentTeams.length; i += 2) {
      if (i + 1 < currentTeams.length) {
        games.push({ home: currentTeams[i], away: currentTeams[i + 1] })
      }
    }
    const label =
      currentTeams.length === 2
        ? 'Championship'
        : currentTeams.length === 4
        ? 'Semifinals'
        : currentTeams.length === 8
        ? 'Quarterfinals'
        : `Round ${roundNum}`
    rounds.push({ round: label, games })
    // Next round: winners (use placeholders)
    currentTeams = games.map((_, idx) => `Winner Game ${roundNum}-${idx + 1}`)
    roundNum++
  }

  return rounds
}

export default async function TournamentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ created?: string; success?: string; canceled?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: tournament, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      profiles (full_name, email),
      tournament_registrations (*)
    `)
    .eq('id', id)
    .single()

  if (error || !tournament) notFound()

  const t = tournament as Tournament & {
    profiles: { full_name: string | null; email: string } | null
    tournament_registrations: TournamentRegistration[]
  }

  const { data: { user } } = await supabase.auth.getUser()

  const confirmedTeams = t.tournament_registrations.filter(
    r => r.payment_status === 'paid' || r.payment_status === 'free'
  )
  const spotsLeft = t.max_teams - confirmedTeams.length
  const isHost = user?.id === t.host_id
  const existingReg = user
    ? t.tournament_registrations.find(r => r.user_id === user.id)
    : null
  const alreadyJoined = !!existingReg
  const isFull = spotsLeft <= 0

  const formattedDate = new Date(t.date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ''}/tournaments/${t.id}`

  const schedule = confirmedTeams.length >= 2
    ? generateSchedule(confirmedTeams.map(r => r.team_name), t.format as 'bracket' | 'round_robin')
    : []

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Toast banners */}
      {sp.created && (
        <div className="mb-6 rounded-xl bg-success/10 border border-success/20 px-5 py-4">
          <p className="font-semibold text-success">🎉 Tournament created!</p>
          <p className="mt-0.5 text-sm text-success/80">
            Share this page with teams to get them registered.
          </p>
        </div>
      )}
      {sp.success && (
        <div className="mb-6 rounded-xl bg-success/10 border border-success/20 px-5 py-4">
          <p className="font-semibold text-success">✅ Payment confirmed! You&apos;re registered.</p>
        </div>
      )}
      {sp.canceled && (
        <div className="mb-6 rounded-xl bg-warning/10 border border-warning/20 px-5 py-4">
          <p className="font-semibold text-warning">Payment canceled. You can try again below.</p>
        </div>
      )}

      <Link href="/tournaments" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All Tournaments
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tournament header */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-3 px-3 py-1 text-xs font-semibold text-muted capitalize">
                {t.sport}
              </span>
              <span className="rounded-full bg-surface-3 px-3 py-1 text-xs font-semibold text-muted">
                {t.format === 'round_robin' ? 'Round Robin' : 'Single Elimination'}
              </span>
            </div>
            <h1 className="text-3xl font-black leading-tight">{t.name}</h1>
            <p className="mt-1 text-muted">
              Hosted by {t.profiles?.full_name || t.profiles?.email || 'Unknown Host'}
            </p>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-border bg-surface p-6 space-y-4">
            <h2 className="font-bold text-lg">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Detail icon="📅" label="Date" value={formattedDate} />
              <Detail icon="📍" label="Location" value={t.location} />
              <Detail icon="👥" label="Teams" value={`${confirmedTeams.length} / ${t.max_teams}`} />
              <Detail
                icon="💳"
                label="Entry Fee"
                value={t.entry_fee > 0 ? `$${t.entry_fee}` : 'Free'}
              />
            </div>
            {t.description && (
              <div className="border-t border-border pt-4">
                <p className="text-sm font-semibold text-muted mb-1">About</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{t.description}</p>
              </div>
            )}
          </div>

          {/* Teams registered */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 font-bold text-lg">
              Teams Registered ({confirmedTeams.length}/{t.max_teams})
            </h2>
            {confirmedTeams.length === 0 ? (
              <p className="text-sm text-muted">No teams registered yet. Be the first!</p>
            ) : (
              <div className="space-y-2">
                {confirmedTeams.map((reg, i) => (
                  <div
                    key={reg.id}
                    className="flex items-center gap-3 rounded-lg bg-surface-2 px-4 py-2.5"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="font-medium text-sm">{reg.team_name}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                      reg.payment_status === 'paid'
                        ? 'bg-success/10 text-success'
                        : 'bg-surface-3 text-muted'
                    }`}>
                      {reg.payment_status === 'paid' ? 'Paid' : reg.payment_status === 'free' ? 'Free' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          {schedule.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="mb-4 font-bold text-lg">Schedule</h2>
              <div className="space-y-5">
                {schedule.map((round) => (
                  <div key={round.round}>
                    <h3 className="mb-2 text-sm font-semibold text-muted uppercase tracking-wide">
                      {round.round}
                    </h3>
                    <div className="space-y-2">
                      {round.games.map((game, gi) => (
                        <div
                          key={gi}
                          className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm"
                        >
                          <span className="flex-1 text-right font-medium">{game.home}</span>
                          <span className="shrink-0 rounded bg-surface-3 px-2 py-0.5 text-xs font-bold text-muted">
                            VS
                          </span>
                          <span className="flex-1 font-medium">{game.away}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Spots indicator */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 text-center">
              <div className="text-4xl font-black">
                {isFull ? '0' : spotsLeft}
              </div>
              <div className="text-sm text-muted">
                {isFull ? 'No spots remaining' : `spot${spotsLeft !== 1 ? 's' : ''} remaining`}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4 h-2 w-full rounded-full bg-surface-3">
              <div
                className="h-2 rounded-full bg-accent transition-all"
                style={{ width: `${Math.min(100, (confirmedTeams.length / t.max_teams) * 100)}%` }}
              />
            </div>

            <div className="mb-4 text-center text-sm text-muted">
              {confirmedTeams.length} of {t.max_teams} teams joined
            </div>

            {/* Entry fee */}
            {t.entry_fee > 0 && (
              <div className="mb-4 rounded-lg bg-surface-2 px-4 py-3 text-center">
                <div className="text-2xl font-black">${t.entry_fee}</div>
                <div className="text-xs text-muted">entry fee per team</div>
              </div>
            )}

            {/* Join button */}
            {isHost ? (
              <div className="rounded-lg bg-accent/10 px-4 py-3 text-center text-sm font-semibold text-accent">
                You&apos;re hosting this tournament
              </div>
            ) : alreadyJoined ? (
              <div className={`rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                existingReg?.payment_status === 'paid' || existingReg?.payment_status === 'free'
                  ? 'bg-success/10 text-success'
                  : 'bg-warning/10 text-warning'
              }`}>
                {existingReg?.payment_status === 'paid' || existingReg?.payment_status === 'free'
                  ? '✅ You\'re registered!'
                  : '⏳ Payment pending'}
              </div>
            ) : (
              <JoinButton
                tournamentId={t.id}
                entryFee={t.entry_fee}
                isFull={isFull}
                userId={user?.id}
              />
            )}
          </div>

          {/* Share link */}
          {(isHost || sp.created) && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-2 font-semibold text-sm">Share this tournament</h3>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs text-muted"
                />
                <CopyButton text={shareUrl} />
              </div>
            </div>
          )}

          {/* Host actions */}
          {isHost && (
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="mb-3 font-semibold text-sm">Host Actions</h3>
              <Link
                href={`/dashboard/host`}
                className="block w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-center text-sm font-semibold hover:bg-surface-3"
              >
                View Dashboard
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Detail({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-muted mb-0.5">
        <span>{icon}</span>
        {label}
      </div>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => {
        if (typeof navigator !== 'undefined') navigator.clipboard.writeText(text)
      }}
      className="shrink-0 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-semibold hover:bg-surface-3"
    >
      Copy
    </button>
  )
}
