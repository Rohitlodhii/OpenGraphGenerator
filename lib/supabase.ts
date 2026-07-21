import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { StorageServiceError } from "@/types/storage"

const globalForSupabase = globalThis as typeof globalThis & {
  openggSupabase?: SupabaseClient
}

const getSupabaseConfiguration = () => {
  const url =
    process.env.SUPABASE_URL ??
    process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new StorageServiceError(
      "Supabase Storage is not configured. Set a Supabase URL and public API key.",
      "configuration",
    )
  }

  return { url, key }
}

/**
 * Returns the application's shared Supabase client. The client is created
 * lazily and cached on globalThis so development hot reloads do not create
 * duplicate instances.
 */
export const getSupabaseClient = (): SupabaseClient => {
  if (globalForSupabase.openggSupabase) {
    return globalForSupabase.openggSupabase
  }

  const { url, key } = getSupabaseConfiguration()
  globalForSupabase.openggSupabase = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  })

  return globalForSupabase.openggSupabase
}
