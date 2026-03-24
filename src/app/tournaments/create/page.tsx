'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

export default function CreateTournamentPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    location: '',
    date: '',
    max_teams: '8',
    entry_fee: '0',
    description: '',
    format: 'bracket',
    sport: 'baseball',
  })

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error: insertError } = await supabase
        .from('tournaments')
        .insert({
          host_id: user.id,
          name: form.name.trim(),
          location: form.location.trim(),
          date: form.date,
          max_teams: parseInt(form.max_teams),
          entry_fee: parseFloat(form.entry_fee) || 0,
          description: form.description.trim() || null,
          format: form.format,
          sport: form.sport,
        })
        .select()
        .single()

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      router.push(`/tournaments/${data.id}?created=true`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link href="/tournaments" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Tournaments
        </Link>
        <h1 className="text-3xl font-black">Create Tournament</h1>
        <p className="mt-1 text-muted">Set it up once. Share the link. Let teams pay to play.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tournament Name */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Tournament Name <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Summer Classic 2026"
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Location <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            required
            value={form.location}
            onChange={set('location')}
            placeholder="e.g. Riverside Park, Austin TX"
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm focus:border-accent focus:outline-none"
          />
        </div>

        {/* Date + Sport row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Date <span className="text-accent">*</span>
            </label>
            <input
              type="date"
              required
              value={form.date}
              onChange={set('date')}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Sport</label>
            <select
              value={form.sport}
              onChange={set('sport')}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm focus:border-accent focus:outline-none"
            >
              <option value="baseball">⚾ Baseball</option>
              <option value="softball">🥎 Softball</option>
            </select>
          </div>
        </div>

        {/* Teams + Entry fee row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Max Teams <span className="text-accent">*</span>
            </label>
            <select
              value={form.max_teams}
              onChange={set('max_teams')}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm focus:border-accent focus:outline-none"
            >
              {[4, 6, 8, 10, 12, 16, 20, 24, 32].map(n => (
                <option key={n} value={n}>{n} teams</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Entry Fee ($)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={form.entry_fee}
              onChange={set('entry_fee')}
              placeholder="0"
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm focus:border-accent focus:outline-none"
            />
            {parseFloat(form.entry_fee) > 0 && (
              <p className="mt-1 text-xs text-muted">
                5% platform fee applies · Teams pay ${parseFloat(form.entry_fee).toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="mb-2 block text-sm font-semibold">Tournament Format</label>
          <div className="grid grid-cols-2 gap-3">
            {([
              { value: 'bracket', label: 'Single Elimination', desc: 'Lose once and you\'re out. Classic bracket.' },
              { value: 'round_robin', label: 'Round Robin', desc: 'Every team plays every other team.' },
            ] as const).map(f => (
              <button
                key={f.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, format: f.value }))}
                className={`rounded-xl border p-4 text-left transition ${
                  form.format === f.value
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-surface hover:border-border-light'
                }`}
              >
                <div className="font-semibold text-sm">{f.label}</div>
                <div className="text-xs text-muted mt-0.5">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold">Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={4}
            placeholder="Rules, park address, contact info, prize info..."
            className="w-full rounded-lg border border-border bg-surface-2 px-4 py-3 text-sm focus:border-accent focus:outline-none resize-none"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-error/10 px-4 py-3 text-sm text-error">
            {error}
            {error.includes('logged in') || error.includes('auth') ? (
              <Link href="/auth/login" className="mt-1 block font-semibold text-accent underline">Log in →</Link>
            ) : null}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-accent py-4 text-base font-bold text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {loading ? 'Creating tournament...' : 'Create Tournament →'}
        </button>
      </form>
    </div>
  )
}
