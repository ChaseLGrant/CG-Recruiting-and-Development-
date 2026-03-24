'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { ensureProfile } from '@/lib/ensure-profile'
import type { UserRole } from '@/lib/types'

const CONNECTION_ERROR =
  'Could not connect to the database. This usually means the Supabase environment variables are missing or incorrect. ' +
  'Visit the /setup page for a step-by-step guide, or check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel → Settings → Environment Variables, then redeploy.'

const DATABASE_SCHEMA_ERROR =
  'Your Supabase database schema is not set up yet. ' +
  'Go to your Supabase dashboard → SQL Editor → New query → paste the contents of supabase/schema.sql → click Run. ' +
  'Then try signing up again.'

function isFetchError(message: string) {
  return message === 'Failed to fetch' || message.includes('fetch')
}

function isDatabaseSchemaError(message: string) {
  return message.includes('Database error saving new user')
}

function SignUpForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultRole = (searchParams.get('role') as UserRole) || 'host'

  const [role, setRole] = useState<UserRole>(defaultRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSetupLink, setShowSetupLink] = useState(false)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowSetupLink(false)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role, full_name: fullName },
        },
      })

      if (signUpError) {
        if (isDatabaseSchemaError(signUpError.message)) {
          setError(DATABASE_SCHEMA_ERROR)
          setShowSetupLink(true)
        } else if (isFetchError(signUpError.message)) {
          setError(CONNECTION_ERROR)
          setShowSetupLink(true)
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError('This email is already registered. Please check your email for the confirmation link, or try logging in.')
        setLoading(false)
        return
      }

      if (data.user && !data.session) {
        setSuccess(true)
        setLoading(false)
        return
      }

      if (data.user) {
        await ensureProfile(supabase, data.user)
      }

      router.push(`/dashboard/${role}`)
    } catch (err) {
      if (err instanceof TypeError && isFetchError(err.message)) {
        setError(CONNECTION_ERROR)
        setShowSetupLink(true)
      } else {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      }
      setLoading(false)
    }
  }

  const roles: { value: UserRole; label: string; desc: string; emoji: string }[] = [
    { value: 'host', label: 'Tournament Host', desc: 'Create and manage tournaments, collect entry fees', emoji: '🏆' },
    { value: 'team', label: 'Team / Player', desc: 'Browse tournaments and register your team', emoji: '⚾' },
  ]

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">RI</span>
          <span className="text-sm font-semibold text-muted">Run It</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold">Create Account</h1>
        <p className="mb-8 text-muted">Join thousands of teams running their own games.</p>

        {success ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
              <strong>Check your email!</strong> We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.
            </div>
            <Link
              href="/auth/login"
              className="block w-full rounded-lg bg-accent py-3 text-center font-semibold text-white hover:bg-accent-hover"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">I want to...</label>
              <div className="grid grid-cols-1 gap-2">
                {roles.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`rounded-xl border p-4 text-left transition ${
                      role === r.value
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-surface hover:border-border-light'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{r.emoji}</span>
                      <div>
                        <div className="font-semibold">{r.label}</div>
                        <div className="text-xs text-muted">{r.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                placeholder="John Smith"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-error/10 px-4 py-2 text-sm text-error">
                {error}
                {showSetupLink && (
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] items-center justify-center"><div className="text-muted">Loading...</div></div>}>
      <SignUpForm />
    </Suspense>
  )
}
