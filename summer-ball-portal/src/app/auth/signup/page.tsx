'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import type { UserRole } from '@/lib/types'

function SignUpForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const defaultRole = (searchParams.get('role') as UserRole) || 'player'

  const [role, setRole] = useState<UserRole>(defaultRole)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, full_name: fullName },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    router.push(`/dashboard/${role}`)
  }

  const roles: { value: UserRole; label: string; desc: string }[] = [
    { value: 'coach', label: 'College Coach', desc: 'Post available players from your program' },
    { value: 'team', label: 'Summer Team / League', desc: 'Post open roster spots & find players' },
    { value: 'player', label: 'Player', desc: 'Create your profile & find opportunities' },
  ]

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-bold">Create Account</h1>
        <p className="mb-8 text-muted">Join the Summer Ball Portal</p>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">I am a...</label>
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
                  <div className="font-semibold">{r.label}</div>
                  <div className="text-xs text-muted">{r.desc}</div>
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
