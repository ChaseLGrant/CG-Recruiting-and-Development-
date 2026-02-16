'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { DashboardShell } from '@/components/dashboard-shell'
import { POSITIONS } from '@/lib/types'
import type { Player, Inquiry } from '@/lib/types'

const navItems = [
  { label: 'My Profile', href: '/dashboard/player' },
]

export default function PlayerDashboard() {
  const supabase = createClient()
  const [player, setPlayer] = useState<Player | null>(null)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '',
    position_primary: '',
    position_secondary: '',
    grad_year: '',
    height: '',
    weight: '',
    bats: '',
    throws: '',
    stats_text: '',
    bio: '',
    video_url: '',
    availability_start: '',
    availability_end: '',
    availability_notes: '',
    contact_email: '',
    contact_phone: '',
  })

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check if player already has a profile
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setPlayer(data)
      setForm({
        name: data.name || '',
        position_primary: data.position_primary || '',
        position_secondary: data.position_secondary || '',
        grad_year: data.grad_year?.toString() || '',
        height: data.height || '',
        weight: data.weight || '',
        bats: data.bats || '',
        throws: data.throws || '',
        stats_text: data.stats_text || '',
        bio: data.bio || '',
        video_url: data.video_url || '',
        availability_start: data.availability_start || '',
        availability_end: data.availability_end || '',
        availability_notes: data.availability_notes || '',
        contact_email: data.contact_email || user.email || '',
        contact_phone: data.contact_phone || '',
      })
    } else {
      setForm(prev => ({ ...prev, contact_email: user.email || '' }))
    }

    // Load inquiries sent by this user
    const { data: inqData } = await supabase
      .from('inquiries')
      .select('*')
      .eq('from_user_id', user.id)
      .order('created_at', { ascending: false })

    if (inqData) setInquiries(inqData)
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const payload = {
      name: form.name,
      position_primary: form.position_primary || null,
      position_secondary: form.position_secondary || null,
      grad_year: form.grad_year ? parseInt(form.grad_year) : null,
      height: form.height || null,
      weight: form.weight || null,
      bats: form.bats || null,
      throws: form.throws || null,
      stats_text: form.stats_text || null,
      bio: form.bio || null,
      video_url: form.video_url || null,
      availability_start: form.availability_start || null,
      availability_end: form.availability_end || null,
      availability_notes: form.availability_notes || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
    }

    if (player) {
      const { error } = await supabase.from('players').update(payload).eq('id', player.id)
      if (error) setMessage('Error: ' + error.message)
      else setMessage('Profile updated!')
    } else {
      const { error } = await supabase.from('players').insert({ ...payload, user_id: user.id })
      if (error) setMessage('Error: ' + error.message)
      else {
        setMessage('Profile created!')
        load()
      }
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <DashboardShell title="Player Dashboard" navItems={navItems}>
        <div className="text-muted">Loading...</div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title="Player Dashboard" navItems={navItems}>
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-surface p-6">
          <h2 className="mb-4 text-lg font-bold">
            {player ? 'Edit Your Profile' : 'Create Your Profile'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Grad Year</label>
                <input
                  type="number"
                  value={form.grad_year}
                  onChange={e => setForm({ ...form, grad_year: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                  placeholder="2026"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Primary Position</label>
                <select
                  value={form.position_primary}
                  onChange={e => setForm({ ...form, position_primary: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                >
                  <option value="">Select</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Secondary Position</label>
                <select
                  value={form.position_secondary}
                  onChange={e => setForm({ ...form, position_secondary: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                >
                  <option value="">Select</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Bats</label>
                <select value={form.bats} onChange={e => setForm({ ...form, bats: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none">
                  <option value="">—</option>
                  <option value="R">R</option>
                  <option value="L">L</option>
                  <option value="S">S</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Throws</label>
                <select value={form.throws} onChange={e => setForm({ ...form, throws: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none">
                  <option value="">—</option>
                  <option value="R">R</option>
                  <option value="L">L</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Height</label>
                <input value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" placeholder="6-1" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Weight</label>
                <input value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" placeholder="185" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Availability Start</label>
                <input type="date" value={form.availability_start} onChange={e => setForm({ ...form, availability_start: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Availability End</label>
                <input type="date" value={form.availability_end} onChange={e => setForm({ ...form, availability_end: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Contact Email</label>
                <input type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <input value={form.contact_phone} onChange={e => setForm({ ...form, contact_phone: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Video URL</label>
              <input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" placeholder="https://" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Stats</label>
              <textarea value={form.stats_text} onChange={e => setForm({ ...form, stats_text: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Bio</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2} className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
            </div>

            {message && (
              <div className={`rounded-lg px-4 py-2 text-sm ${message.includes('Error') ? 'bg-error/10 text-error' : 'bg-success/10 text-success'}`}>
                {message}
              </div>
            )}

            <button type="submit" disabled={saving} className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-hover disabled:opacity-50">
              {saving ? 'Saving...' : player ? 'Update Profile' : 'Create Profile'}
            </button>
          </form>
        </div>

        {/* Browse listings CTA */}
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="mb-2 font-bold">Find Summer Opportunities</h3>
          <p className="mb-4 text-sm text-muted">Browse open listings from summer teams and leagues.</p>
          <Link href="/listings" className="inline-block rounded-lg bg-surface-2 px-4 py-2 text-sm font-medium hover:bg-surface-3">
            Browse Listings
          </Link>
        </div>

        {/* Inquiries sent */}
        {inquiries.length > 0 && (
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="mb-4 font-bold">Your Inquiries ({inquiries.length})</h3>
            <div className="space-y-2">
              {inquiries.map(inq => (
                <div key={inq.id} className="rounded-lg bg-surface-2 px-4 py-3 text-sm">
                  <div className="text-xs text-muted">{new Date(inq.created_at).toLocaleDateString()}</div>
                  {inq.message && <div className="mt-1">{inq.message}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
