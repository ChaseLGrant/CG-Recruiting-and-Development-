import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Stripe webhooks must use the raw body — disable body parsing
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const body = await request.text()
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Invalid signature' },
      { status: 400 }
    )
  }

  // Use service role key to bypass RLS for webhook updates
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const registrationId = session.metadata?.registration_id
    if (!registrationId) {
      console.warn('No registration_id in session metadata')
      return NextResponse.json({ received: true })
    }

    const amountPaid = session.amount_total ? session.amount_total / 100 : null

    const { error } = await supabase
      .from('tournament_registrations')
      .update({
        payment_status: 'paid',
        amount_paid: amountPaid,
        stripe_session_id: session.id,
      })
      .eq('id', registrationId)

    if (error) {
      console.error('Failed to update registration:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`Registration ${registrationId} marked as paid`)
  }

  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session
    const registrationId = session.metadata?.registration_id

    if (registrationId) {
      await supabase
        .from('tournament_registrations')
        .update({ payment_status: 'failed' })
        .eq('id', registrationId)
        .eq('payment_status', 'pending')
    }
  }

  return NextResponse.json({ received: true })
}
