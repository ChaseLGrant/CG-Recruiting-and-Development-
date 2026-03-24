import Stripe from 'stripe'

export const PLATFORM_FEE_PERCENT = 5 // 5% platform fee

let _stripe: Stripe | null = null

/** Lazily initialise Stripe so the module can be imported at build time */
export function getStripe(): Stripe {
  if (_stripe) return _stripe

  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    // At build time env vars may not be present — use a placeholder that
    // will never actually make network requests during static generation.
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      // In production server runtime this is a real error
      throw new Error(
        'STRIPE_SECRET_KEY is not set. Add it to your Vercel environment variables.'
      )
    }
    _stripe = new Stripe('sk_test_placeholder', { apiVersion: '2026-02-25.clover' })
    return _stripe
  }

  _stripe = new Stripe(key, { apiVersion: '2026-02-25.clover' })
  return _stripe
}

/** Convenience re-export for code that imports `stripe` directly */
export const stripe = {
  checkout: {
    sessions: {
      create: (...args: Parameters<Stripe['checkout']['sessions']['create']>) =>
        getStripe().checkout.sessions.create(...args),
    },
  },
  webhooks: {
    constructEvent: (...args: Parameters<Stripe['webhooks']['constructEvent']>) =>
      getStripe().webhooks.constructEvent(...args),
  },
} as unknown as Stripe

/** Calculate the platform fee amount in cents */
export function platformFeeAmount(entryFeeDollars: number): number {
  return Math.round(entryFeeDollars * 100 * (PLATFORM_FEE_PERCENT / 100))
}
