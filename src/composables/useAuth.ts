import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { authGatewayRequest } from '../lib/apiClient'

const TOKEN_STORAGE_KEY = 'resume_admin_token'

export interface AuthUser {
  id: string
  email?: string
  [key: string]: any
}

export interface AuthSession {
  access_token: string
  user: AuthUser
  [key: string]: any
}

export interface UseAuthOptions {
  autoInitialize?: boolean
}

export interface SignInResult {
  success: boolean
  error?: Error | null
  user?: AuthUser | null
  session?: AuthSession | null
}

export interface UseAuthReturn {
  user: Ref<AuthUser | null>
  session: Ref<AuthSession | null>
  isAuthenticated: ComputedRef<boolean>
  loading: Ref<boolean>
  error: Ref<Error | null>
  signIn: (email: string, password: string) => Promise<SignInResult>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export function useAuth(options: UseAuthOptions = {}): UseAuthReturn {
  const autoInitialize = options.autoInitialize ?? true

  const user = ref<AuthUser | null>(null)
  const session = ref<AuthSession | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  const isAuthenticated = computed(() => !!session.value && !!user.value)

  const initialize = async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY)
      if (storedToken) {
        try {
          loading.value = true
          const res = await authGatewayRequest('getUser', { token: storedToken })
          if (res.success && res.user) {
            user.value = res.user
            session.value = { access_token: storedToken, user: res.user }
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
  }

  const signIn = async (email: string, password: string): Promise<SignInResult> => {
    error.value = null

    if (!email || !password || email.trim() === '' || password.trim() === '') {
      const valError = new Error('이메일과 비밀번호를 모두 입력해주세요.')
      error.value = valError
      return { success: false, error: valError }
    }

    if (typeof fetch === 'undefined') {
      const clientError = new Error('네트워크 환경이 지원되지 않습니다.')
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

  const signOut = async (): Promise<void> => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
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
    initialize
  }
}
