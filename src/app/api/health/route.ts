import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const APP_TABLES = ['profiles', 'programs', 'players', 'teams', 'listings', 'inquiries'] as const

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const configured = !!(supabaseUrl && supabaseKey)

  let dbConnected = false
  let dbError: string | null = null
  let tablesFound: string[] = []

  if (configured) {
    try {
      const supabase = createClient(supabaseUrl!, supabaseKey!)

      // Check all tables in parallel
      const results = await Promise.all(
        APP_TABLES.map(async (table) => {
          const { error } = await supabase.from(table).select('id').limit(1)
          return { table, ok: !error }
        })
      )

      tablesFound = results.filter(r => r.ok).map(r => r.table)
      dbConnected = tablesFound.length > 0

      if (!dbConnected) {
        dbError = 'No app tables found. Run supabase/schema.sql in your Supabase SQL Editor.'
      }
    } catch (e) {
      dbError = e instanceof Error ? e.message : 'Unknown error'
    }
  }

  return NextResponse.json({
    status: configured && dbConnected ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: {
      configured,
      connected: dbConnected,
      error: dbError,
      tables: tablesFound,
      tablesExpected: APP_TABLES,
      schemaReady: tablesFound.length === APP_TABLES.length,
    },
  })
}
