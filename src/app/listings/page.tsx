'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import type { Listing } from '@/lib/types'
import { POSITIONS, US_STATES } from '@/lib/types'

export default function BrowseListingsPage() {
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [leagueSearch, setLeagueSearch] = useState('')
  const [state, setState] = useState('')
  const [position, setPosition] = useState('')
  const [seasonStart, setSeasonStart] = useState('')
  const [seasonEnd, setSeasonEnd] = useState('')

  async function searchListings() {
    setLoading(true)

    try {
      let query = supabase
        .from('listings')
        .select('*, teams(team_name, league_name, location_city, location_state)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(100)

      if (seasonStart) {
        query = query.gte('season_end', seasonStart)
      }
      if (seasonEnd) {
        query = query.lte('season_start', seasonEnd)
      }
      if (position) {
        query = query.contains('positions_needed', [position])
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching listings:', error.message)
      }

      let results = data || []

      // Client-side filter
      if (leagueSearch.trim()) {
        const search = leagueSearch.toLowerCase()
        results = results.filter(l => {
          const team = l.teams as { team_name: string; league_name: string } | null
          return (
            team?.league_name?.toLowerCase().includes(search) ||
            team?.team_name?.toLowerCase().includes(search) ||
            l.listing_title.toLowerCase().includes(search)
          )
        })
      }

      if (state) {
        results = results.filter(l => {
          const team = l.teams as { location_state: string } | null
          return team?.location_state === state
        })
      }

      setListings(results)
    } catch (err) {
      console.error('Error searching listings:', err)
      setListings([])
    }
    setLoading(false)
  }

  useEffect(() => {
    searchListings()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    searchListings()
  }

  function clearFilters() {
    setLeagueSearch('')
    setState('')
    setPosition('')
    setSeasonStart('')
    setSeasonEnd('')
    setTimeout(searchListings, 0)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Browse Team Listings</h1>
      <p className="mb-8 text-muted">Find summer teams and leagues with open roster spots.</p>

      {/* Filters */}
      <form onSubmit={handleSearch} className="mb-8 rounded-xl border border-border bg-surface p-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Team / League</label>
            <input
              value={leagueSearch}
              onChange={e => setLeagueSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
              placeholder="Search..."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">State</label>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              <option value="">All</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Position Needed</label>
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
            <label className="mb-1 block text-xs font-medium text-muted">Season From</label>
            <input
              type="date"
              value={seasonStart}
              onChange={e => setSeasonStart(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Season Until</label>
            <input
              type="date"
              value={seasonEnd}
              onChange={e => setSeasonEnd(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <button type="submit" className="flex-1 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover">
              Search
            </button>
            <button type="button" onClick={clearFilters} className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-foreground">
              Clear
            </button>
          </div>
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="text-center text-muted">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-12 text-center">
          <p className="text-muted">No listings found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const team = listing.teams as { team_name: string; league_name: string; location_city: string; location_state: string } | null

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block rounded-xl border border-border bg-surface p-5 transition hover:border-accent/30 hover:bg-surface-2"
    >
      <h3 className="mb-1 font-bold">{listing.listing_title}</h3>
      {team && (
        <p className="text-xs text-muted">
          {team.team_name}
          {team.league_name && ` — ${team.league_name}`}
          {team.location_city && team.location_state && ` | ${team.location_city}, ${team.location_state}`}
        </p>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {listing.season_start && listing.season_end && (
          <span>Season: {listing.season_start} — {listing.season_end}</span>
        )}
        {listing.roster_spots_open && (
          <span className="font-medium text-accent">{listing.roster_spots_open} spots open</span>
        )}
      </div>

      {listing.positions_needed?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {listing.positions_needed.map(pos => (
            <span key={pos} className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {pos}
            </span>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-3 text-xs text-muted">
        {listing.housing_provided !== 'unknown' && (
          <span>Housing: {listing.housing_provided === 'yes' ? 'Yes' : 'No'}</span>
        )}
        {listing.stipend_text && <span>Pay: {listing.stipend_text}</span>}
      </div>
    </Link>
  )
}
