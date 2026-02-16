'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { DashboardShell } from '@/components/dashboard-shell'
import type { Program } from '@/lib/types'
import { US_STATES } from '@/lib/types'

const navItems = [
  { label: 'Program Profile', href: '/dashboard/coach' },
  { label: 'Bulk Add Players', href: '/dashboard/coach/bulk-add' },
  { label: 'Manage Players', href: '/dashboard/coach/players' },
]

export default function CoachDashboard() {
  const supabase = createClient()
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    college_name: '',
    location_city: '',
    location_state: '',
    coach_name: '',
    coach_email: '',
    coach_phone: '',
  })

  useEffect(() => {
    loadProgram()
  }, [])

  async function loadProgram() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('created_by', user.id)
      .single()

    if (data) {
      setProgram(data)
      setForm({
        college_name: data.college_name || '',
        location_city: data.location_city || '',
        location_state: data.location_state || '',
        coach_name: data.coach_name || '',
        coach_email: data.coach_email || '',
        coach_phone: data.coach_phone || '',
      })
    }
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (program) {
      const { error } = await supabase
        .from('programs')
        .update(form)
        .eq('id', program.id)

      if (error) setMessage('Error saving: ' + error.message)
      else setMessage('Program updated successfully!')
    } else {
      const { error } = await supabase
        .from('programs')
        .insert({ ...form, created_by: user.id })

      if (error) setMessage('Error creating: ' + error.message)
      else {
        setMessage('Program created successfully!')
        loadProgram()
      }
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <DashboardShell title="Coach Dashboard" navItems={navItems}>
        <div className="text-muted">Loading...</div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Coach Dashboard" navItems={navItems}>
      <div className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-4 text-lg font-bold">
          {program ? 'Edit Program Profile' : 'Create Program Profile'}
        </h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">College/University Name *</label>
            <input
              required
              value={form.college_name}
              onChange={e => setForm({ ...form, college_name: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              placeholder="e.g. University of Florida"
            />
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

          <div>
            <label className="mb-1 block text-sm font-medium">Coach Name</label>
            <input
              value={form.coach_name}
              onChange={e => setForm({ ...form, coach_name: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Coach Email</label>
              <input
                type="email"
                value={form.coach_email}
                onChange={e => setForm({ ...form, coach_email: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Coach Phone</label>
              <input
                value={form.coach_phone}
                onChange={e => setForm({ ...form, coach_phone: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              />
            </div>
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
            {saving ? 'Saving...' : program ? 'Update Program' : 'Create Program'}
          </button>
        </form>
      </div>
    </DashboardShell>
  )
}
