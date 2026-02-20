'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import type { Player, Program } from '@/lib/types'

export default function PlayerDetailPage() {
  const { id } = useParams()
  const supabase = createClient()
  const [player, setPlayer] = useState<Player | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [inquirySent, setInquirySent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function loadPlayer() {
      try {
        const { data, error } = await supabase
          .from('players')
          .select('*, programs(*)')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error loading player:', error.message)
        }

        if (data) {
          setPlayer(data)
          if (data.programs) {
            setProgram(data.programs as unknown as Program)
          }
        }
      } catch (err) {
        console.error('Error loading player:', err)
      }
      setLoading(false)
    }
    loadPlayer()
  }, [id, supabase])

  async function sendInquiry() {
    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from('inquiries').insert({
      from_user_id: user?.id || null,
      from_email: user?.email || null,
      to_player_id: player?.id,
      message: inquiryMessage,
    })

    setInquirySent(true)
    setSending(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center text-muted">Loading...</div>
    )
  }

  if (!player) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="text-xl font-bold">Player Not Found</h1>
        <Link href="/players" className="mt-4 inline-block text-accent hover:underline">
          Back to Browse
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link href="/players" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Browse
      </Link>

      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{player.name}</h1>
            {program && (
              <p className="mt-1 text-muted">
                {program.college_name}
                {program.location_city && program.location_state && ` — ${program.location_city}, ${program.location_state}`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {player.position_primary && (
              <span className="rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-bold text-accent">
                {player.position_primary}
              </span>
            )}
            {player.position_secondary && (
              <span className="rounded-lg bg-surface-3 px-3 py-1.5 text-sm font-medium text-muted">
                {player.position_secondary}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Class" value={player.grad_year?.toString()} />
          <InfoItem label="B/T" value={player.bats && player.throws ? `${player.bats}/${player.throws}` : null} />
          <InfoItem label="Height" value={player.height} />
          <InfoItem label="Weight" value={player.weight ? `${player.weight} lbs` : null} />
        </div>

        {(player.availability_start || player.availability_end) && (
          <div className="mb-6 rounded-lg bg-surface-2 p-4">
            <h3 className="mb-1 text-sm font-semibold">Availability</h3>
            <p className="text-sm text-muted">
              {player.availability_start} — {player.availability_end}
            </p>
            {player.availability_notes && (
              <p className="mt-1 text-sm text-muted">{player.availability_notes}</p>
            )}
          </div>
        )}

        {player.stats_text && (
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-semibold">Stats</h3>
            <p className="text-sm text-muted whitespace-pre-wrap">{player.stats_text}</p>
          </div>
        )}

        {player.bio && (
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-semibold">Bio</h3>
            <p className="text-sm text-muted whitespace-pre-wrap">{player.bio}</p>
          </div>
        )}

        {player.video_url && (
          <div className="mb-6">
            <h3 className="mb-1 text-sm font-semibold">Video</h3>
            <a href={player.video_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
              {player.video_url}
            </a>
          </div>
        )}

        {/* Contact Section */}
        <div className="border-t border-border pt-6">
          {!showContact ? (
            <button
              onClick={() => setShowContact(true)}
              className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-hover"
            >
              Contact Player
            </button>
          ) : (
            <div className="space-y-4">
              {player.contact_email && (
                <div>
                  <span className="text-sm font-medium">Email: </span>
                  <a href={`mailto:${player.contact_email}`} className="text-sm text-accent hover:underline">
                    {player.contact_email}
                  </a>
                </div>
              )}
              {player.contact_phone && (
                <div>
                  <span className="text-sm font-medium">Phone: </span>
                  <span className="text-sm text-muted">{player.contact_phone}</span>
                </div>
              )}

              {!inquirySent ? (
                <div className="rounded-lg bg-surface-2 p-4">
                  <h4 className="mb-2 text-sm font-semibold">Send an Inquiry</h4>
                  <textarea
                    value={inquiryMessage}
                    onChange={e => setInquiryMessage(e.target.value)}
                    rows={3}
                    className="mb-3 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:border-accent focus:outline-none"
                    placeholder="Introduce yourself and your team..."
                  />
                  <button
                    onClick={sendInquiry}
                    disabled={sending || !inquiryMessage.trim()}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              ) : (
                <div className="rounded-lg bg-success/10 px-4 py-2 text-sm text-success">
                  Inquiry sent! The player/coach will be notified.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <div className="text-xs text-muted">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  )
}
