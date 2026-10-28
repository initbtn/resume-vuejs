import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { User, Session, AuthError } from '@supabase/supabase-js'
import type { TypedSupabaseClient } from '../lib/supabase'
import { authGatewayRequest } from '../lib/apiClient'

const TOKEN_STORAGE_KEY = 'resume_admin_token'

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
  const client = options.client !== undefined ? options.client : null
  const autoInitialize = options.autoInitialize ?? true

  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<AuthError | Error | null>(null)

  const isAuthenticated = computed(() => !!session.value && !!user.value)

  const initialize = async () => {
    if (!client) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
        if (storedToken) {
          try {
            loading.value = true
            const res = await authGatewayRequest('getUser', { token: storedToken })
            if (res.success && res.user) {
              user.value = res.user
              session.value = { access_token: storedToken, user: res.user } as any
            } else {
              window.localStorage.removeItem(TOKEN_STORAGE_KEY)
            }
          } catch {
            window.localStorage.removeItem(TOKEN_STORAGE_KEY)
          } finally {
            loading.value = false
          }
        }
      }
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
      if (typeof fetch === 'undefined') {
        const clientError = new Error('Supabase 클라이언트가 초기화되지 않았습니다.')
        error.value = clientError
        return { success: false, error: clientError }
      }
      try {
        loading.value = true
        const res = await authGatewayRequest('login', { email: email.trim(), password: password.trim() })
        if (!res.success) {
          const err = new Error(res.error || '인증에 실패했습니다.')
          error.value = err
          return { success: false, error: err }
        }
        user.value = res.user
        session.value = res.session
        if (typeof window !== 'undefined' && window.localStorage && res.session?.access_token) {
          window.localStorage.setItem(TOKEN_STORAGE_KEY, res.session.access_token)
        }
        return { success: true, user: res.user, session: res.session }
      } catch (err: any) {
        const handledError = err instanceof Error ? err : new Error(String(err))
        error.value = handledError
        return { success: false, error: handledError }
      } finally {
        loading.value = false
      }
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
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }

    if (client) {
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
      return
    }

    try {
      loading.value = true
      await authGatewayRequest('logout')
      user.value = null
      session.value = null
      error.value = null
    } catch (err: any) {
      error.value = err instanceof Error ? err : new Error(String(err))
    } finally {
      loading.value = false
    }
  }

  if (autoInitialize) {
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
