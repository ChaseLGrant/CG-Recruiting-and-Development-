'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { DashboardShell } from '@/components/dashboard-shell'
import type { Listing, Team } from '@/lib/types'

const navItems = [
  { label: 'Team Profile', href: '/dashboard/team' },
  { label: 'Manage Listings', href: '/dashboard/team/listings' },
  { label: 'Create Listing', href: '/dashboard/team/listings/new' },
]

export default function ManageListingsPage() {
  const supabase = createClient()
  const [listings, setListings] = useState<Listing[]>([])
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: teamData } = await supabase
        .from('teams')
        .select('*')
        .eq('created_by', user.id)
        .single()

      if (teamData) {
        setTeam(teamData)
        const { data: listingsData } = await supabase
          .from('listings')
          .select('*')
          .eq('team_id', teamData.id)
          .order('created_at', { ascending: false })

        if (listingsData) setListings(listingsData)
      }
      setLoading(false)
    }
    load()
  }, [supabase])

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase
      .from('listings')
      .update({ is_active: !current })
      .eq('id', id)
    if (!error) {
      setListings(prev => prev.map(l => l.id === id ? { ...l, is_active: !current } : l))
    }
  }

  async function deleteListing(id: string) {
    if (!confirm('Delete this listing?')) return
    await supabase.from('listings').delete().eq('id', id)
    setListings(prev => prev.filter(l => l.id !== id))
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
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Your Listings ({listings.length})</h2>
          <Link
            href="/dashboard/team/listings/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            + New Listing
          </Link>
        </div>

        {!team && (
          <div className="mb-4 rounded-lg bg-warning/10 px-4 py-2 text-sm text-warning">
            Create a team profile first before adding listings.
          </div>
        )}

        {listings.length === 0 ? (
          <p className="text-sm text-muted">No listings yet.</p>
        ) : (
          <div className="space-y-3">
            {listings.map(listing => (
              <div key={listing.id} className="rounded-lg border border-border bg-surface-2 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{listing.listing_title}</span>
                      <span className={`rounded px-2 py-0.5 text-xs font-medium ${listing.is_active ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted'}`}>
                        {listing.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted">
                      {listing.season_start && listing.season_end && (
                        <span>Season: {listing.season_start} — {listing.season_end}</span>
                      )}
                      {listing.roster_spots_open && (
                        <span>{listing.roster_spots_open} spots open</span>
                      )}
                      {listing.positions_needed?.length > 0 && (
                        <span>Needs: {listing.positions_needed.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => toggleActive(listing.id, listing.is_active)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground"
                    >
                      {listing.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteListing(listing.id)}
                      className="rounded-lg border border-error/30 px-3 py-1.5 text-xs text-error hover:bg-error/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
