'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { DashboardShell } from '@/components/dashboard-shell'
import { POSITIONS } from '@/lib/types'
import type { Team } from '@/lib/types'

const navItems = [
  { label: 'Team Profile', href: '/dashboard/team' },
  { label: 'Manage Listings', href: '/dashboard/team/listings' },
  { label: 'Create Listing', href: '/dashboard/team/listings/new' },
]

export default function NewListingPage() {
  const supabase = createClient()
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    listing_title: '',
    season_start: '',
    season_end: '',
    positions_needed: [] as string[],
    roster_spots_open: '',
    housing_provided: 'unknown' as 'yes' | 'no' | 'unknown',
    stipend_text: '',
    requirements_text: '',
    notes: '',
    contact_email: '',
  })

  useEffect(() => {
    async function loadTeam() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('teams')
        .select('*')
        .eq('created_by', user.id)
        .single()
      if (data) {
        setTeam(data)
        if (data.contact_email) {
          setForm(prev => ({ ...prev, contact_email: data.contact_email || '' }))
        }
      }
    }
    loadTeam()
  }, [supabase])

  function togglePosition(pos: string) {
    setForm(prev => ({
      ...prev,
      positions_needed: prev.positions_needed.includes(pos)
        ? prev.positions_needed.filter(p => p !== pos)
        : [...prev.positions_needed, pos]
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!team) {
      setError('Please create a team profile first.')
      return
    }

    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('listings').insert({
      team_id: team.id,
      listing_title: form.listing_title,
      season_start: form.season_start || null,
      season_end: form.season_end || null,
      positions_needed: form.positions_needed,
      roster_spots_open: form.roster_spots_open ? parseInt(form.roster_spots_open) : null,
      housing_provided: form.housing_provided,
      stipend_text: form.stipend_text || null,
      requirements_text: form.requirements_text || null,
      notes: form.notes || null,
      contact_email: form.contact_email || null,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    router.push('/dashboard/team/listings')
  }

  return (
    <DashboardShell title="Team Dashboard" navItems={navItems}>
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold">Create New Listing</h2>

        {!team && (
          <div className="mb-4 rounded-lg bg-warning/10 px-4 py-2 text-sm text-warning">
            Create a team profile first.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Listing Title *</label>
            <input
              required
              value={form.listing_title}
              onChange={e => setForm({ ...form, listing_title: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              placeholder='e.g. "2026 Infielders Needed — Coastal League"'
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Season Start</label>
              <input
                type="date"
                value={form.season_start}
                onChange={e => setForm({ ...form, season_start: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Season End</label>
              <input
                type="date"
                value={form.season_end}
                onChange={e => setForm({ ...form, season_end: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Positions Needed</label>
            <div className="flex flex-wrap gap-2">
              {POSITIONS.map(pos => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => togglePosition(pos)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    form.positions_needed.includes(pos)
                      ? 'bg-accent text-white'
                      : 'bg-surface-2 text-muted hover:text-foreground'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Roster Spots Open</label>
              <input
                type="number"
                min="0"
                value={form.roster_spots_open}
                onChange={e => setForm({ ...form, roster_spots_open: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Housing Provided</label>
              <select
                value={form.housing_provided}
                onChange={e => setForm({ ...form, housing_provided: e.target.value as 'yes' | 'no' | 'unknown' })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              >
                <option value="unknown">Unknown</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Stipend / Pay</label>
              <input
                value={form.stipend_text}
                onChange={e => setForm({ ...form, stipend_text: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                placeholder="e.g. $500/month"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Contact Email</label>
            <input
              type="email"
              value={form.contact_email}
              onChange={e => setForm({ ...form, contact_email: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Eligibility / Requirements</label>
            <textarea
              value={form.requirements_text}
              onChange={e => setForm({ ...form, requirements_text: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">{error}</div>
          )}

          <button
            type="submit"
            disabled={saving || !team}
            className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </DashboardShell>
  )
}
