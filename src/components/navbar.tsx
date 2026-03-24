'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { Profile } from '@/lib/types'

export function Navbar() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function getProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          if (data) setProfile(data)
        }
      } catch (err) {
        console.error('Navbar auth check failed:', err)
      }
    }
    getProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    window.location.href = '/'
  }

  const dashboardLink = profile
    ? `/dashboard/${profile.role}`
    : '/auth/login'

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-lg font-black">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-black text-white">
            RI
          </span>
          <span className="tracking-tight">Run It</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/tournaments" className="text-sm text-muted hover:text-foreground transition-colors">
            Browse
          </Link>
          <Link href="/tournaments/create" className="text-sm text-muted hover:text-foreground transition-colors">
            Create Tournament
          </Link>
          {profile ? (
            <>
              <Link href={dashboardLink} className="text-sm text-muted hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-muted hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:text-foreground md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-surface px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/tournaments" className="text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
              Browse Tournaments
            </Link>
            <Link href="/tournaments/create" className="text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
              Create Tournament
            </Link>
            {profile ? (
              <>
                <Link href={dashboardLink} className="text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button onClick={handleSignOut} className="text-left text-sm text-muted hover:text-foreground">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-muted hover:text-foreground" onClick={() => setMenuOpen(false)}>
                  Log In
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-block rounded-lg bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:bg-accent-hover"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
