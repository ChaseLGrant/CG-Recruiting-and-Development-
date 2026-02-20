'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { DashboardShell } from '@/components/dashboard-shell'
import type { Team } from '@/lib/types'
import { US_STATES } from '@/lib/types'

const navItems = [
  { label: 'Team Profile', href: '/dashboard/team' },
  { label: 'Manage Listings', href: '/dashboard/team/listings' },
  { label: 'Create Listing', href: '/dashboard/team/listings/new' },
]

export default function TeamDashboard() {
  const supabase = createClient()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    team_name: '',
    league_name: '',
    location_city: '',
    location_state: '',
    website_url: '',
    contact_email: '',
    description: '',
  })

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
      setForm({
        team_name: data.team_name || '',
        league_name: data.league_name || '',
        location_city: data.location_city || '',
        location_state: data.location_state || '',
        website_url: data.website_url || '',
        contact_email: data.contact_email || '',
        description: data.description || '',
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    loadTeam()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (team) {
      const { error } = await supabase.from('teams').update(form).eq('id', team.id)
      if (error) setMessage('Error: ' + error.message)
      else setMessage('Team updated!')
    } else {
      const { error } = await supabase.from('teams').insert({ ...form, created_by: user.id })
      if (error) setMessage('Error: ' + error.message)
      else {
        setMessage('Team created!')
        loadTeam()
      }
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <DashboardShell title="Team Dashboard" navItems={navItems}>
        <div className="text-muted">Loading...</div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Team Dashboard" navItems={navItems}>
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold">
          {team ? 'Edit Team Profile' : 'Create Team Profile'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Team Name *</label>
              <input
                required
                value={form.team_name}
                onChange={e => setForm({ ...form, team_name: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">League Name</label>
              <input
                value={form.league_name}
                onChange={e => setForm({ ...form, league_name: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input
                value={form.location_city}
                onChange={e => setForm({ ...form, location_city: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">State</label>
              <select
                value={form.location_state}
                onChange={e => setForm({ ...form, location_state: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              >
                <option value="">Select state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="mb-1 block text-sm font-medium">Website URL</label>
              <input
                value={form.website_url}
                onChange={e => setForm({ ...form, website_url: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                placeholder="https://"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          {message && (
            <div className={`rounded-lg px-4 py-2 text-sm ${message.includes('Error') ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? 'Saving...' : team ? 'Update Team' : 'Create Team'}
          </button>
        </form>
      </div>
    </DashboardShell>
  )
}
