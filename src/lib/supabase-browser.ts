import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a dummy client during build time / when env vars aren't set
    // This prevents build failures while still allowing the app to compile
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }

  try {
    return createBrowserClient(url, key)
  } catch {
    // If env vars are malformed, fall back to placeholder to prevent crashes
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    )
  }
}
