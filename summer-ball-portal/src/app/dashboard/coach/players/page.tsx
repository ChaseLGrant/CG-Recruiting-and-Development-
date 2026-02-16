'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { DashboardShell } from '@/components/dashboard-shell'
import type { Player } from '@/lib/types'
import { POSITIONS } from '@/lib/types'

const navItems = [
  { label: 'Program Profile', href: '/dashboard/coach' },
  { label: 'Bulk Add Players', href: '/dashboard/coach/bulk-add' },
  { label: 'Manage Players', href: '/dashboard/coach/players' },
]

export default function ManagePlayersPage() {
  const supabase = createClient()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<Player>>({})

  useEffect(() => {
    loadPlayers()
  }, [])

  async function loadPlayers() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('created_by_coach_id', user.id)
      .order('created_at', { ascending: false })

    if (data) setPlayers(data)
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this player?')) return
    await supabase.from('players').delete().eq('id', id)
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  function startEdit(player: Player) {
    setEditingId(player.id)
    setEditForm({
      name: player.name,
      position_primary: player.position_primary,
      grad_year: player.grad_year,
      availability_start: player.availability_start,
      availability_end: player.availability_end,
      contact_email: player.contact_email,
      contact_phone: player.contact_phone,
      bats: player.bats,
      throws: player.throws,
      height: player.height,
      weight: player.weight,
      video_url: player.video_url,
    })
  }

  async function handleSave() {
    if (!editingId) return
    const { error } = await supabase
      .from('players')
      .update(editForm)
      .eq('id', editingId)

    if (!error) {
      setPlayers(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } : p))
      setEditingId(null)
    }
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
          Manage Players ({players.length})
        </h2>

        {players.length === 0 ? (
          <p className="text-sm text-muted">
            No players yet. Use the Bulk Add tool to add players.
          </p>
        ) : (
          <div className="space-y-3">
            {players.map(player => (
              <div
                key={player.id}
                className="rounded-lg border border-border bg-surface-2 p-4"
              >
                {editingId === player.id ? (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <input
                        value={editForm.name || ''}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        placeholder="Name"
                      />
                      <select
                        value={editForm.position_primary || ''}
                        onChange={e => setEditForm({ ...editForm, position_primary: e.target.value })}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                      >
                        <option value="">Position</option>
                        {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <input
                        type="number"
                        value={editForm.grad_year || ''}
                        onChange={e => setEditForm({ ...editForm, grad_year: parseInt(e.target.value) || undefined })}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        placeholder="Grad Year"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        type="date"
                        value={editForm.availability_start || ''}
                        onChange={e => setEditForm({ ...editForm, availability_start: e.target.value })}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                      />
                      <input
                        type="date"
                        value={editForm.availability_end || ''}
                        onChange={e => setEditForm({ ...editForm, availability_end: e.target.value })}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        value={editForm.contact_email || ''}
                        onChange={e => setEditForm({ ...editForm, contact_email: e.target.value })}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        placeholder="Email"
                      />
                      <input
                        value={editForm.contact_phone || ''}
                        onChange={e => setEditForm({ ...editForm, contact_phone: e.target.value })}
                        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-border px-4 py-2 text-sm text-muted hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{player.name}</span>
                        {player.position_primary && (
                          <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                            {player.position_primary}
                          </span>
                        )}
                        {player.grad_year && (
                          <span className="text-xs text-muted">&apos;{String(player.grad_year).slice(-2)}</span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                        {player.contact_email && <span>{player.contact_email}</span>}
                        {player.availability_start && player.availability_end && (
                          <span>Avail: {player.availability_start} — {player.availability_end}</span>
                        )}
                        {player.bats && <span>B: {player.bats}</span>}
                        {player.throws && <span>T: {player.throws}</span>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => startEdit(player)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(player.id)}
                        className="rounded-lg border border-error/30 px-3 py-1.5 text-xs text-error hover:bg-error/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
