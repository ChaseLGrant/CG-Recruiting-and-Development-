import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import type { TournamentRegistration, Tournament } from '@/lib/types'

export default async function TeamDashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  // Fetch registrations for this user with tournament details
  const { data: registrations } = await supabase
    .from('tournament_registrations')
    .select(`
      *,
      tournaments (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const allRegs = (registrations || []) as (TournamentRegistration & {
    tournaments: Tournament | null
  })[]

  const confirmedRegs = allRegs.filter(
    r => r.payment_status === 'paid' || r.payment_status === 'free'
  )
  const pendingRegs = allRegs.filter(r => r.payment_status === 'pending')
  const totalSpent = confirmedRegs.reduce((sum, r) => sum + (r.amount_paid || 0), 0)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted">Your dashboard</p>
          <h1 className="text-3xl font-black">
            {profile.full_name || profile.email}
          </h1>
        </div>
        <Link
          href="/tournaments"
          className="shrink-0 rounded-xl bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
        >
          Browse Tournaments
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Tournaments" value={confirmedRegs.length.toString()} />
        <StatCard label="Pending" value={pendingRegs.length.toString()} />
        <StatCard label="Total Paid" value={`$${totalSpent.toFixed(2)}`} />
      </div>

      {/* Pending payments warning */}
      {pendingRegs.length > 0 && (
        <div className="mb-6 rounded-xl border border-warning/20 bg-warning/10 px-5 py-4">
          <p className="font-semibold text-warning">
            ⏳ You have {pendingRegs.length} registration{pendingRegs.length > 1 ? 's' : ''} with pending payment
          </p>
          <p className="mt-0.5 text-sm text-warning/80">
            Your spot is not confirmed until payment is complete.
          </p>
        </div>
      )}

      {/* Registrations */}
      {allRegs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface py-20 text-center">
          <div className="mb-4 text-5xl">⚾</div>
          <h3 className="mb-2 text-xl font-bold">No tournaments yet</h3>
          <p className="mb-6 text-muted">Find a tournament and get your team in the game.</p>
          <Link
            href="/tournaments"
            className="inline-block rounded-lg bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-hover"
          >
            Browse Tournaments
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-bold">Your Registrations</h2>
          {allRegs.map(reg => (
            <RegistrationRow key={reg.id} registration={reg} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs font-semibold text-muted uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  )
}

function RegistrationRow({
  registration,
}: {
  registration: TournamentRegistration & { tournaments: Tournament | null }
}) {
  const t = registration.tournaments
  if (!t) return null

  const formattedDate = new Date(t.date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const statusConfig: Record<string, { label: string; className: string }> = {
    paid: { label: 'Confirmed', className: 'bg-success/10 text-success border-success/20' },
    free: { label: 'Confirmed (Free)', className: 'bg-success/10 text-success border-success/20' },
    pending: { label: 'Payment Pending', className: 'bg-warning/10 text-warning border-warning/20' },
    failed: { label: 'Payment Failed', className: 'bg-error/10 text-error border-error/20' },
  }

  const status = statusConfig[registration.payment_status] || {
    label: registration.payment_status,
    className: 'bg-surface-3 text-muted border-border',
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <Link
            href={`/tournaments/${t.id}`}
            className="font-bold text-lg hover:text-accent transition-colors"
          >
            {t.name}
          </Link>
          <p className="mt-0.5 text-sm text-muted">
            {t.location} · {formattedDate}
          </p>
          <p className="mt-0.5 text-sm text-muted">
            Team: <span className="font-semibold text-foreground">{registration.team_name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {registration.amount_paid !== null && registration.amount_paid > 0 && (
            <div className="text-center">
              <div className="font-black">${registration.amount_paid.toFixed(2)}</div>
              <div className="text-xs text-muted">paid</div>
            </div>
          )}
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${status.className}`}>
            {status.label}
          </span>
          <Link
            href={`/tournaments/${t.id}`}
            className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm font-semibold hover:bg-surface-3"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  )
}
