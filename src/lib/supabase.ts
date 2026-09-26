import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

export type TypedSupabaseClient = SupabaseClient<Database>

export interface CreateSupabaseClientOptions {
  persistSession?: boolean
}

export function createSupabaseClient(
  url?: string,
  anonKey?: string,
  options?: CreateSupabaseClientOptions
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

  const persistSession = options?.persistSession ?? (typeof window !== 'undefined')

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession,
      autoRefreshToken: persistSession
    }
  })
}

export const supabase: TypedSupabaseClient | null = createSupabaseClient()
