export type UserRole = 'player' | 'coach' | 'team' | 'host'

export interface Profile {
  id: string
  email: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export interface Program {
  id: string
  created_by: string
  college_name: string
  location_city: string | null
  location_state: string | null
  coach_name: string | null
  coach_email: string | null
  coach_phone: string | null
  logo_url: string | null
  created_at: string
}

export interface Player {
  id: string
  user_id: string | null
  program_id: string | null
  created_by_coach_id: string | null
  name: string
  position_primary: string | null
  position_secondary: string | null
  grad_year: number | null
  height: string | null
  weight: string | null
  bats: string | null
  throws: string | null
  stats_text: string | null
  bio: string | null
  video_url: string | null
  availability_start: string | null
  availability_end: string | null
  availability_notes: string | null
  contact_email: string | null
  contact_phone: string | null
  created_at: string
  programs?: Program
}

export interface Team {
  id: string
  created_by: string
  team_name: string
  league_name: string | null
  location_city: string | null
  location_state: string | null
  website_url: string | null
  contact_email: string | null
  logo_url: string | null
  description: string | null
  created_at: string
}

export interface Listing {
  id: string
  team_id: string
  listing_title: string
  season_start: string | null
  season_end: string | null
  positions_needed: string[]
  roster_spots_open: number | null
  housing_provided: 'yes' | 'no' | 'unknown'
  stipend_text: string | null
  requirements_text: string | null
  notes: string | null
  contact_email: string | null
  is_active: boolean
  created_at: string
  teams?: Team
}

export interface Inquiry {
  id: string
  from_user_id: string | null
  from_name: string | null
  from_email: string | null
  to_team_id: string | null
  to_listing_id: string | null
  to_player_id: string | null
  message: string | null
  created_at: string
}

export interface BulkPlayerRow {
  _rowId: string
  name: string
  position_primary: string
  grad_year: string
  availability_start: string
  availability_end: string
  contact_email: string
  contact_phone: string
  bats: string
  throws: string
  height: string
  weight: string
  video_url: string
  notes: string
  _error?: string
  _saved?: boolean
}

// ============================================================
// Run It — Tournament Types
// ============================================================

export type TournamentFormat = 'bracket' | 'round_robin'
export type TournamentSport = 'baseball' | 'softball'
export type PaymentStatus = 'pending' | 'paid' | 'free' | 'failed'

export interface Tournament {
  id: string
  host_id: string
  name: string
  location: string
  date: string
  max_teams: number
  entry_fee: number
  description: string | null
  format: TournamentFormat
  sport: TournamentSport
  is_active: boolean
  created_at: string
  profiles?: { full_name: string | null; email: string }
  tournament_registrations?: TournamentRegistration[]
}

export interface TournamentRegistration {
  id: string
  tournament_id: string
  user_id: string
  team_name: string
  payment_status: PaymentStatus
  stripe_session_id: string | null
  amount_paid: number | null
  created_at: string
  tournaments?: Tournament
}

export const POSITIONS = [
  'P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH', 'UTIL', 'IF', 'OF'
] as const

export const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY'
] as const
