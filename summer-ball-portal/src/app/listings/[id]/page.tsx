'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import type { Listing, Team } from '@/lib/types'

export default function ListingDetailPage() {
  const { id } = useParams()
  const supabase = createClient()
  const [listing, setListing] = useState<Listing | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [inquirySent, setInquirySent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadListing()
  }, [id])

  async function loadListing() {
    const { data } = await supabase
      .from('listings')
      .select('*, teams(*)')
      .eq('id', id)
      .single()

    if (data) {
      setListing(data)
      if (data.teams) {
        setTeam(data.teams as unknown as Team)
      }
    }
    setLoading(false)
  }

  async function sendInquiry() {
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('inquiries').insert({
      from_user_id: user?.id || null,
      from_email: user?.email || null,
      to_team_id: team?.id || null,
      to_listing_id: listing?.id,
      message: inquiryMessage,
    })

    setInquirySent(true)
    setSending(false)
  }

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-12 text-center text-muted">Loading...</div>
  }

  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-xl font-bold">Listing Not Found</h1>
        <Link href="/listings" className="mt-4 inline-block text-accent hover:underline">Back to Browse</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/listings" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Browse
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="mb-2 text-2xl font-bold">{listing.listing_title}</h1>
        {team && (
          <p className="mb-6 text-muted">
            {team.team_name}
            {team.league_name && ` — ${team.league_name}`}
            {team.location_city && team.location_state && ` | ${team.location_city}, ${team.location_state}`}
          </p>
        )}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listing.season_start && listing.season_end && (
            <DetailItem label="Season" value={`${listing.season_start} — ${listing.season_end}`} />
          )}
          {listing.roster_spots_open && (
            <DetailItem label="Roster Spots Open" value={listing.roster_spots_open.toString()} accent />
          )}
          <DetailItem label="Housing" value={listing.housing_provided === 'yes' ? 'Provided' : listing.housing_provided === 'no' ? 'Not provided' : 'Unknown'} />
          {listing.stipend_text && <DetailItem label="Stipend / Pay" value={listing.stipend_text} />}
        </div>

        {listing.positions_needed?.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-semibold">Positions Needed</h3>
            <div className="flex flex-wrap gap-2">
              {listing.positions_needed.map(pos => (
                <span key={pos} className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent">
                  {pos}
                </span>
              ))}
            </div>
          </div>
        )}

        {listing.requirements_text && (
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-semibold">Eligibility / Requirements</h3>
            <p className="text-sm text-muted whitespace-pre-wrap">{listing.requirements_text}</p>
          </div>
        )}

        {listing.notes && (
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-semibold">Notes</h3>
            <p className="text-sm text-muted whitespace-pre-wrap">{listing.notes}</p>
          </div>
        )}

        {team?.website_url && (
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-semibold">Website</h3>
            <a href={team.website_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
              {team.website_url}
            </a>
          </div>
        )}

        {/* Express Interest */}
        <div className="border-t border-border pt-6">
          <h3 className="mb-3 text-lg font-bold">Express Interest</h3>
          {!inquirySent ? (
            <div className="space-y-3">
              <textarea
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                placeholder="Introduce yourself — include your name, position, school, and availability..."
              />
              <button
                onClick={sendInquiry}
                disabled={sending || !inquiryMessage.trim()}
                className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Interest'}
              </button>
            </div>
          ) : (
            <div className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
              Your interest has been sent! The team will be in touch.
            </div>
          )}

          {(listing.contact_email || team?.contact_email) && (
            <div className="mt-4 text-sm text-muted">
              Or email directly:{' '}
              <a
                href={`mailto:${listing.contact_email || team?.contact_email}`}
                className="text-accent hover:underline"
              >
                {listing.contact_email || team?.contact_email}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailItem({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg bg-surface-2 p-3">
      <div className="text-xs text-muted">{label}</div>
      <div className={`font-semibold ${accent ? 'text-accent' : ''}`}>{value}</div>
    </div>
  )
}
