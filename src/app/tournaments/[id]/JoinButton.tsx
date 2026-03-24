'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface JoinButtonProps {
  tournamentId: string
  entryFee: number
  isFull: boolean
  userId: string | undefined
}

export function JoinButton({ tournamentId, entryFee, isFull, userId }: JoinButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  if (!userId) {
    return (
      <Link
        href={`/auth/login?next=/tournaments/${tournamentId}`}
        className="block w-full rounded-xl bg-accent py-3.5 text-center font-bold text-white hover:bg-accent-hover"
      >
        Log In to Join
      </Link>
    )
  }

  if (isFull) {
    return (
      <div className="w-full rounded-xl bg-surface-3 py-3.5 text-center font-semibold text-muted cursor-not-allowed">
        Tournament Full
      </div>
    )
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, teamName: teamName.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      // Free tournament: registered directly
      if (data.registered) {
        router.refresh()
        return
      }

      // Paid: redirect to Stripe
      if (data.url) {
        window.location.href = data.url
        return
      }

      setError('Unexpected response from server')
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect')
      setLoading(false)
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full rounded-xl bg-accent py-3.5 font-bold text-white hover:bg-accent-hover"
      >
        {entryFee > 0 ? `Join — $${entryFee}` : 'Join Free'}
      </button>
    )
  }

  return (
    <form onSubmit={handleJoin} className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-semibold">Your Team Name</label>
        <input
          type="text"
          required
          value={teamName}
          onChange={e => setTeamName(e.target.value)}
          placeholder="e.g. Fire Ballers"
          autoFocus
          className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      {error && (
        <p className="text-xs text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !teamName.trim()}
        className="w-full rounded-xl bg-accent py-3.5 font-bold text-white hover:bg-accent-hover disabled:opacity-50"
      >
        {loading
          ? 'Processing...'
          : entryFee > 0
          ? `Pay $${entryFee} & Register`
          : 'Register Free'}
      </button>

      <button
        type="button"
        onClick={() => { setShowForm(false); setError('') }}
        className="w-full text-center text-xs text-muted hover:text-foreground"
      >
        Cancel
      </button>
    </form>
  )
}
