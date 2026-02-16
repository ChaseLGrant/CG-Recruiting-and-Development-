export const APP_NAME = 'Summer Ball Portal'
export const APP_DESCRIPTION = 'Connect college players with summer baseball opportunities'

export const ROUTES = {
  home: '/',
  login: '/auth/login',
  signup: '/auth/signup',
  players: '/players',
  listings: '/listings',
  dashboard: {
    coach: '/dashboard/coach',
    team: '/dashboard/team',
    player: '/dashboard/player',
    coachBulkAdd: '/dashboard/coach/bulk-add',
    coachPlayers: '/dashboard/coach/players',
    teamListings: '/dashboard/team/listings',
    teamListingsNew: '/dashboard/team/listings/new',
  },
} as const
