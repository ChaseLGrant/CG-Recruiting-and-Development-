'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface HealthStatus {
  status: string
  supabase: {
    configured: boolean
    connected: boolean
    schemaReady: boolean
    tables: string[]
    tablesExpected: string[]
    error: string | null
  }
}

export default function SetupPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkHealth()
  }, [])

  async function checkHealth() {
    setLoading(true)
    try {
      const res = await fetch('/api/health')
      const data = await res.json()
      setHealth(data)
    } catch {
      setHealth(null)
    }
    setLoading(false)
  }

  const configured = health?.supabase?.configured ?? false
  const connected = health?.supabase?.connected ?? false
  const schemaReady = health?.supabase?.schemaReady ?? false
  const allGood = configured && connected && schemaReady

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold">Setup Guide</h1>
      <p className="mb-8 text-muted">
        Follow these steps to connect your Supabase backend. The status checks below update automatically.
      </p>

      {/* Live Status */}
      <div className="mb-8 rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold">Connection Status</h2>
          <button
            onClick={checkHealth}
            disabled={loading}
            className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Refresh'}
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <StatusRow label="Environment variables set" ok={configured} />
          <StatusRow label="Connected to Supabase" ok={connected} />
          <StatusRow label="Database tables created" ok={schemaReady} />
        </div>
        {allGood && (
          <div className="mt-4 rounded-lg bg-success/10 px-4 py-2 text-sm text-success">
            ✅ Everything is connected! <Link href="/auth/signup" className="underline">Try signing up →</Link>
          </div>
        )}
      </div>

      {/* Step 1 */}
      <SetupStep
        number={1}
        title="Create a Supabase project"
        done={configured}
      >
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Go to{' '}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              supabase.com/dashboard
            </a>{' '}
            and sign in (or create a free account)
          </li>
          <li>Click <strong>New Project</strong></li>
          <li>Pick a name, set a database password, choose a region</li>
          <li>Click <strong>Create new project</strong> — wait ~2 minutes</li>
        </ol>
      </SetupStep>

      {/* Step 2 */}
      <SetupStep
        number={2}
        title="Run the database schema"
        done={schemaReady}
      >
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>In Supabase, click <strong>SQL Editor</strong> in the left sidebar</li>
          <li>Click <strong>New query</strong></li>
          <li>
            Open{' '}
            <a href="https://github.com/ChaseLGrant/CG-Recruiting-and-Development-/blob/main/supabase/schema.sql" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              supabase/schema.sql
            </a>{' '}
            — copy <strong>ALL</strong> the contents
          </li>
          <li>Paste it into the SQL editor and click <strong>Run</strong></li>
          <li>You should see &quot;Success. No rows returned&quot;</li>
        </ol>
      </SetupStep>

      {/* Step 3 */}
      <SetupStep
        number={3}
        title="Copy your Supabase API keys"
        done={configured}
      >
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>In Supabase dashboard → <strong>Settings</strong> (gear icon) → <strong>API</strong></li>
          <li>
            Find these two values:
            <div className="mt-2 rounded-lg bg-surface-2 p-3">
              <div className="mb-2">
                <span className="font-mono text-xs text-accent">NEXT_PUBLIC_SUPABASE_URL</span>
                <br />
                <span className="text-xs text-muted">Under &quot;Project URL&quot; — looks like <code>https://abcdefghijkl.supabase.co</code></span>
              </div>
              <div>
                <span className="font-mono text-xs text-accent">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <br />
                <span className="text-xs text-muted">Under &quot;Project API keys&quot; → the key labeled <code>anon public</code> — long string starting with <code>eyJ...</code></span>
              </div>
            </div>
          </li>
        </ol>
      </SetupStep>

      {/* Step 4 — THE KEY STEP */}
      <SetupStep
        number={4}
        title="Add the keys to Vercel (this is where you put the URL!)"
        done={configured && connected}
        highlight
      >
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>
            Go to{' '}
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              vercel.com/dashboard
            </a>
          </li>
          <li>Click on your <strong>Summer Ball Portal</strong> project</li>
          <li>Click <strong>Settings</strong> in the top nav</li>
          <li>Click <strong>Environment Variables</strong> in the left sidebar</li>
          <li>
            Add each variable:
            <div className="mt-2 space-y-2">
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                <div className="mb-1 text-xs font-bold text-accent">Variable 1:</div>
                <div className="text-xs">
                  <strong>Key:</strong> <code className="rounded bg-surface-2 px-1">NEXT_PUBLIC_SUPABASE_URL</code>
                </div>
                <div className="text-xs">
                  <strong>Value:</strong> paste your Project URL from Supabase (e.g. <code>https://abcdefghijkl.supabase.co</code>)
                </div>
              </div>
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                <div className="mb-1 text-xs font-bold text-accent">Variable 2:</div>
                <div className="text-xs">
                  <strong>Key:</strong> <code className="rounded bg-surface-2 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                </div>
                <div className="text-xs">
                  <strong>Value:</strong> paste your anon public key from Supabase
                </div>
              </div>
            </div>
          </li>
          <li>Click <strong>Save</strong> for each one</li>
          <li>
            <strong className="text-accent">⚠️ IMPORTANT: Redeploy!</strong> Go to <strong>Deployments</strong> tab → click <strong>⋮</strong> on the latest → <strong>Redeploy</strong>
            <br />
            <span className="text-xs text-muted">(Environment variables are baked in at build time — you must redeploy after adding them)</span>
          </li>
        </ol>
      </SetupStep>

      {/* Step 5 */}
      <SetupStep
        number={5}
        title="Configure auth redirect URLs"
        done={allGood}
      >
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>In Supabase → <strong>Authentication</strong> → <strong>URL Configuration</strong></li>
          <li>
            Set <strong>Site URL</strong> to your Vercel URL:
            <code className="ml-1 rounded bg-surface-2 px-2 py-0.5 text-xs">https://your-project.vercel.app</code>
          </li>
          <li>
            Under <strong>Redirect URLs</strong>, add:
            <code className="ml-1 rounded bg-surface-2 px-2 py-0.5 text-xs">https://your-project.vercel.app/auth/callback</code>
          </li>
          <li>Click <strong>Save</strong></li>
        </ol>
        <p className="mt-2 text-xs text-muted">
          💡 For testing, you can also disable email confirmation: Supabase → Authentication → Providers → Email → turn off &quot;Confirm email&quot;
        </p>
      </SetupStep>

      {/* Final CTA */}
      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-center">
        <h3 className="mb-2 font-bold">Done? Check your connection:</h3>
        <button
          onClick={checkHealth}
          className="rounded-lg bg-accent px-6 py-2.5 font-semibold text-white hover:bg-accent-hover"
        >
          Check Connection Status
        </button>
        {allGood && (
          <div className="mt-4">
            <Link
              href="/auth/signup"
              className="inline-block rounded-lg bg-success/10 px-6 py-2.5 font-semibold text-success hover:bg-success/20"
            >
              ✅ All connected — Go to Sign Up →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${ok ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
        {ok ? '✓' : '✗'}
      </span>
      <span className={ok ? 'text-foreground' : 'text-muted'}>{label}</span>
    </div>
  )
}

function SetupStep({
  number,
  title,
  done,
  highlight,
  children,
}: {
  number: number
  title: string
  done: boolean
  highlight?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={`mb-6 rounded-xl border p-5 ${highlight ? 'border-accent/40 bg-accent/5' : 'border-border bg-surface'} ${done ? 'opacity-70' : ''}`}>
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-success/20 text-success' : 'bg-accent/20 text-accent'}`}>
          {done ? '✓' : number}
        </span>
        <h3 className="font-bold">{title}</h3>
      </div>
      {children}
    </div>
  )
}
