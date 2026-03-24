import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const location = searchParams.get('location')
  const date = searchParams.get('date')
  const sport = searchParams.get('sport')

  let query = supabase
    .from('tournaments')
    .select(`
      *,
      profiles (full_name, email),
      tournament_registrations (id, payment_status)
    `)
    .eq('is_active', true)
    .order('date', { ascending: true })

  if (location) query = query.ilike('location', `%${location}%`)
  if (date) query = query.gte('date', date)
  if (sport) query = query.eq('sport', sport)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tournaments: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await request.json()
  const { name, location, date, max_teams, entry_fee, description, format, sport } = body

  if (!name || !location || !date) {
    return NextResponse.json({ error: 'name, location, and date are required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tournaments')
    .insert({
      host_id: user.id,
      name,
      location,
      date,
      max_teams: max_teams || 8,
      entry_fee: entry_fee || 0,
      description: description || null,
      format: format || 'bracket',
      sport: sport || 'baseball',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ tournament: data }, { status: 201 })
}
