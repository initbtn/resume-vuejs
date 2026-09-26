import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase, type TypedSupabaseClient } from '../lib/supabase'

export interface UseAuthOptions {
  client?: TypedSupabaseClient | null
  autoInitialize?: boolean
}

export interface SignInResult {
  success: boolean
  error?: AuthError | Error | null
  user?: User | null
  session?: Session | null
}

export interface UseAuthReturn {
  user: Ref<User | null>
  session: Ref<Session | null>
  isAuthenticated: ComputedRef<boolean>
  loading: Ref<boolean>
  error: Ref<AuthError | Error | null>
  signIn: (email: string, password: string) => Promise<SignInResult>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
  client: TypedSupabaseClient | null
}

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const client = options.client !== undefined ? options.client : supabase
  const autoInitialize = options.autoInitialize ?? true

  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<AuthError | Error | null>(null)

  const isAuthenticated = computed(() => !!session.value && !!user.value)

  const initialize = async () => {
    if (!client) {
      return
    }

    try {
      loading.value = true
      const { data, error: sessionError } = await client.auth.getSession()
      if (sessionError) {
        error.value = sessionError
      } else if (data?.session) {
        session.value = data.session
        user.value = data.session.user
      }

      client.auth.onAuthStateChange((_event, newSession) => {
        session.value = newSession
        user.value = newSession ? newSession.user : null
        if (!newSession) {
          error.value = null
        }
      })
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    error.value = null

    if (!email || !password || email.trim() === '' || password.trim() === '') {
      const valError = new Error('이메일과 비밀번호를 모두 입력해주세요.')
      error.value = valError
      return { success: false, error: valError }
    }

    if (!client) {
      const clientError = new Error('Supabase 클라이언트가 초기화되지 않았습니다.')
      error.value = clientError
      return { success: false, error: clientError }
    }

    try {
      loading.value = true
      const { data, error: signInError } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })

      if (signInError) {
        error.value = signInError
        return { success: false, error: signInError }
      }

      if (data?.session && data?.user) {
        session.value = data.session
        user.value = data.user
        return {
          success: true,
          user: data.user,
          session: data.session
        }
      }

      return { success: true }
    } catch (err: any) {
      const handledError = err instanceof Error ? err : new Error(String(err))
      error.value = handledError
      return { success: false, error: handledError }
    } finally {
      loading.value = false
    }
  }

  const signOut = async (): Promise<void> => {
    if (!client) {
      user.value = null
      session.value = null
      return
    }

    try {
      loading.value = true
      await client.auth.signOut()
      user.value = null
      session.value = null
      error.value = null
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  if (autoInitialize && client) {
    initialize()
  }

  return {
    user,
    session,
    isAuthenticated,
    loading,
    error,
    signIn,
    signOut,
    initialize,
    client
  }
}
