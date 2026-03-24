import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  // Route to the right dashboard based on role
  if (profile.role === 'host' || profile.role === 'coach') {
    redirect('/dashboard/host')
  }

  // team, player, and all other roles go to team dashboard
  redirect('/dashboard/team')
}
