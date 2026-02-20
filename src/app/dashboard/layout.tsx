import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Skip auth check during build / when Supabase env vars are not configured.
  // In production, Supabase env vars must be set for auth to work.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return <>{children}</>
  }

  let authenticated = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    authenticated = !!user
  } catch (error) {
    console.error('Dashboard auth error:', error)
    authenticated = false
  }

  if (!authenticated) {
    redirect('/auth/login')
  }

  return <>{children}</>
}
