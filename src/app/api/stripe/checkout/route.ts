import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { tournamentId, teamName } = await request.json()
    if (!tournamentId || !teamName?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Fetch tournament
    const { data: tournament, error: tError } = await supabase
      .from('tournaments')
      .select('*, tournament_registrations(id, payment_status)')
      .eq('id', tournamentId)
      .single()

    if (tError || !tournament) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 })
    }

    // Check if already registered
    const existingReg = await supabase
      .from('tournament_registrations')
      .select('id')
      .eq('tournament_id', tournamentId)
      .eq('user_id', user.id)
      .single()

    if (existingReg.data) {
      return NextResponse.json({ error: 'Already registered for this tournament' }, { status: 409 })
    }

    // Check spots
    const confirmedCount = tournament.tournament_registrations.filter(
      (r: { payment_status: string }) =>
        r.payment_status === 'paid' || r.payment_status === 'free'
    ).length

    if (confirmedCount >= tournament.max_teams) {
      return NextResponse.json({ error: 'Tournament is full' }, { status: 409 })
    }

    const entryFee = parseFloat(tournament.entry_fee) || 0
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Free tournament — register directly
    if (entryFee === 0) {
      const { error: regError } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          team_name: teamName.trim(),
          payment_status: 'free',
          amount_paid: 0,
        })

      if (regError) {
        return NextResponse.json({ error: regError.message }, { status: 500 })
      }

      return NextResponse.json({ registered: true })
    }

    // Paid tournament — create a pending registration + Stripe session
    const { data: reg, error: regError } = await supabase
      .from('tournament_registrations')
      .insert({
        tournament_id: tournamentId,
        user_id: user.id,
        team_name: teamName.trim(),
        payment_status: 'pending',
        amount_paid: null,
      })
      .select()
      .single()

    if (regError) {
      return NextResponse.json({ error: regError.message }, { status: 500 })
    }

    const amountCents = Math.round(entryFee * 100)
    const platformFeeCents = Math.round(amountCents * 0.05)

    let session
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${tournament.name} — Entry Fee`,
                description: `${teamName} registration · ${tournament.location}`,
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${siteUrl}/tournaments/${tournamentId}?success=true`,
        cancel_url: `${siteUrl}/tournaments/${tournamentId}?canceled=true`,
        metadata: {
          registration_id: reg.id,
          tournament_id: tournamentId,
          user_id: user.id,
          platform_fee_cents: platformFeeCents.toString(),
        },
        customer_email: user.email,
      })
    } catch (stripeError) {
      // Clean up the pending registration if Stripe fails
      await supabase.from('tournament_registrations').delete().eq('id', reg.id)
      const msg = stripeError instanceof Error ? stripeError.message : 'Stripe error'
      return NextResponse.json({ error: msg }, { status: 502 })
    }

    // Save session id
    await supabase
      .from('tournament_registrations')
      .update({ stripe_session_id: session.id })
      .eq('id', reg.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
