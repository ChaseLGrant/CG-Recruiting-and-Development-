import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let cachedClient: SupabaseClient | null = null

/**
 * Returns a Supabase browser client.
 *
 * - Validates NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY at
 *   **call time**, not at import time, so the module can be imported safely
 *   during `next build` even when env vars are missing.
 * - The client instance is cached so repeated calls return the same object.
 * - Throws a descriptive error only when the function is actually invoked
 *   without the required env vars (never during build/SSR import).
 */
export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
    )
  }

  cachedClient = createBrowserClient(url, key)
  return cachedClient
}

/**
 * Returns true when the public Supabase env vars are present.
 * Safe to call during build / SSR — never throws.
 */
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
