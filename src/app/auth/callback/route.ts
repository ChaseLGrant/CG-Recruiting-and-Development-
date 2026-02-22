import { createClient } from '@/lib/supabase-server'
import { ensureProfile } from '@/lib/ensure-profile'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        // Ensure profile exists (fallback for missing/failed trigger)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await ensureProfile(supabase, user)
        }

        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error('Auth callback exchange error:', error.message)
    } catch (err) {
      console.error('Auth callback error:', err)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth`)
}
