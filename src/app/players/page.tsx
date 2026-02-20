'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import type { Player } from '@/lib/types'
import { POSITIONS } from '@/lib/types'

export default function BrowsePlayersPage() {
  const supabase = createClient()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [programSearch, setProgramSearch] = useState('')
  const [position, setPosition] = useState('')
  const [gradYear, setGradYear] = useState('')
  const [availStart, setAvailStart] = useState('')
  const [availEnd, setAvailEnd] = useState('')

  async function searchPlayers() {
    setLoading(true)

    try {
      let query = supabase
        .from('players')
        .select('*, programs(college_name, location_city, location_state)')
        .order('created_at', { ascending: false })
        .limit(100)

      if (position) {
        query = query.or(`position_primary.eq.${position},position_secondary.eq.${position}`)
      }

      if (gradYear) {
        query = query.eq('grad_year', parseInt(gradYear))
      }

      if (availStart) {
        query = query.lte('availability_start', availStart)
      }

      if (availEnd) {
        query = query.gte('availability_end', availEnd)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching players:', error.message)
      }

      let results = data || []

      // Client-side filter by program name (join search)
      if (programSearch.trim()) {
        const search = programSearch.toLowerCase()
        results = results.filter(p => {
          const prog = p.programs as { college_name: string } | null
          return prog?.college_name?.toLowerCase().includes(search)
        })
      }

      setPlayers(results)
    } catch (err) {
      console.error('Error searching players:', err)
      setPlayers([])
    }
    setLoading(false)
  }

  useEffect(() => {
    searchPlayers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    searchPlayers()
  }

  function clearFilters() {
    setProgramSearch('')
    setPosition('')
    setGradYear('')
    setAvailStart('')
    setAvailEnd('')
    setTimeout(searchPlayers, 0)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Browse Players</h1>
      <p className="mb-8 text-muted">Search available players by program, position, and availability.</p>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-8 rounded-xl border border-border bg-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">College Program</label>
            <input
              value={programSearch}
              onChange={e => setProgramSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="Search program..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Position</label>
            <select
              value={position}
              onChange={e => setPosition(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">All</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Grad Year</label>
            <input
              type="number"
              value={gradYear}
              onChange={e => setGradYear(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="e.g. 2026"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Available From</label>
            <input
              type="date"
              value={availStart}
              onChange={e => setAvailStart(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Available Until</label>
            <input
              type="date"
              value={availEnd}
              onChange={e => setAvailEnd(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center text-muted">Loading players...</div>
      ) : players.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-muted">No players found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {players.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  )
}

function PlayerCard({ player }: { player: Player }) {
  const program = player.programs as { college_name: string; location_city: string; location_state: string } | null

  return (
    <Link
      href={`/players/${player.id}`}
      className="block rounded-xl border border-border bg-surface p-5 transition hover:border-accent/30 hover:bg-surface-2"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="font-bold">{player.name}</h3>
          {program && (
            <p className="text-xs text-muted">
              {program.college_name}
              {program.location_state && ` — ${program.location_state}`}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          {player.position_primary && (
            <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
              {player.position_primary}
            </span>
          )}
          {player.position_secondary && (
            <span className="rounded bg-surface-3 px-2 py-0.5 text-xs font-medium text-muted">
              {player.position_secondary}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {player.grad_year && <span>Class of {player.grad_year}</span>}
        {player.bats && player.throws && <span>B/T: {player.bats}/{player.throws}</span>}
        {player.height && <span>{player.height}</span>}
        {player.weight && <span>{player.weight} lbs</span>}
      </div>

      {player.availability_start && player.availability_end && (
        <div className="mt-2 text-xs text-muted">
          Available: {player.availability_start} — {player.availability_end}
        </div>
      )}
    </Link>
  )
}
