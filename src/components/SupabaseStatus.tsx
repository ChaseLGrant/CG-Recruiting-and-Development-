'use client'

import { useEffect, useState } from 'react'
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase/client'

type Status = 'checking' | 'connected' | 'not-configured' | 'error'

export function SupabaseStatus() {
  const configured = isSupabaseConfigured()
  const [status, setStatus] = useState<Status>(configured ? 'checking' : 'not-configured')

  useEffect(() => {
    if (!configured) return

    let cancelled = false

    async function check() {
      try {
        const supabase = getSupabaseClient()
        await supabase.auth.getSession()
        if (!cancelled) setStatus('connected')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    check()
    return () => { cancelled = true }
  }, [configured])

  const config: Record<Status, { label: string; color: string }> = {
    checking:         { label: '○ Checking Supabase…',       color: 'text-yellow-500' },
    connected:        { label: '● Supabase connected',       color: 'text-green-500' },
    'not-configured': { label: '○ Supabase not configured',  color: 'text-yellow-500' },
    error:            { label: '● Supabase unreachable',     color: 'text-red-500' },
  }

  const { label, color } = config[status]

  return (
    <span className={`inline-block text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
