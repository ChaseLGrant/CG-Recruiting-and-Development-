import type { SupabaseClient, User } from '@supabase/supabase-js'

/**
 * Ensures a profile row exists for the given user.
 *
 * The database trigger `on_auth_user_created` normally creates the profile,
 * but if the trigger was not set up, failed silently, or was removed, this
 * function acts as a safety net so the user can still log in.
 *
 * Uses upsert with `onConflict: 'id'` and `ignoreDuplicates: true` so it
 * only inserts when no profile exists — it never overwrites a profile that
 * the trigger (or the user) already created.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  user: User,
): Promise<void> {
  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      email: user.email ?? '',
      role: user.user_metadata?.role ?? 'player',
      full_name: user.user_metadata?.full_name ?? '',
    },
    { onConflict: 'id', ignoreDuplicates: true },
  )

  if (error) {
    // Log but don't throw — the profile table may not exist yet.
    console.error('ensureProfile: could not upsert profile:', error.message)
  }
}
