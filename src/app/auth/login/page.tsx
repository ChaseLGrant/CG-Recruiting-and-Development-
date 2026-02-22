'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { ensureProfile } from '@/lib/ensure-profile'

const CONNECTION_ERROR =
  'Could not connect to the database. This usually means the Supabase environment variables are missing or incorrect. ' +
  'Visit the /setup page for a step-by-step guide, or check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel → Settings → Environment Variables, then redeploy.'

function isFetchError(message: string) {
  return message === 'Failed to fetch' || message.includes('fetch')
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (loginError) {
        if (isFetchError(loginError.message)) {
          setError(CONNECTION_ERROR)
        } else if (loginError.message === 'Email not confirmed') {
          setError('Your email is not confirmed yet. Check your inbox for the confirmation link from Supabase.')
        } else {
          setError(loginError.message)
        }
        setLoading(false)
        return
      }

      // Ensure profile exists (fallback for missing/failed trigger)
      await ensureProfile(supabase, data.user)

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      router.push(`/dashboard/${profile?.role || 'player'}`)
    } catch (err) {
      if (err instanceof TypeError && isFetchError(err.message)) {
        setError(CONNECTION_ERROR)
      } else {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>
        <p className="mb-8 text-muted">Log in to Summer Ball Portal</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
              placeholder="Your password"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
              {error}
              {error.includes('Could not connect') && (
                <Link href="/setup" className="mt-2 block font-semibold text-accent underline">
                  Open Setup Guide →
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-3 font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
