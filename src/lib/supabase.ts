import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

export type TypedSupabaseClient = SupabaseClient<Database>

export function createSupabaseClient(
  url?: string,
  anonKey?: string
): TypedSupabaseClient | null {
  const supabaseUrl =
    url !== undefined ? url : (import.meta.env?.VITE_SUPABASE_URL as string | undefined)
  const supabaseAnonKey =
    anonKey !== undefined
      ? anonKey
      : (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined)

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.trim() === '' || supabaseAnonKey.trim() === '') {
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  })
}

export const supabase: TypedSupabaseClient | null = createSupabaseClient()
