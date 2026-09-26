import { ref, onMounted, type Ref } from 'vue'
import type { PayloadType } from '../payload/types'
import { Payload } from '../payload'
import { supabase, type TypedSupabaseClient } from '../lib/supabase'

export interface UseResumeDataOptions {
  client?: TypedSupabaseClient | null
  autoFetch?: boolean
}

export interface UseResumeDataReturn {
  data: Ref<PayloadType>
  loading: Ref<boolean>
  error: Ref<Error | null>
  source: Ref<'supabase' | 'fallback'>
  fetchData: () => Promise<void>
}

export function useResumeData(options: UseResumeDataOptions = {}): UseResumeDataReturn {
  const activeClient = options.client !== undefined ? options.client : supabase

  // 깊은 복사로 초기 로컬 fallback 데이터 생성
  const initialData: PayloadType = {
    profile: { ...Payload.profile },
    introduce: { ...Payload.introduce },
    skill: { ...Payload.skill },
    experience: { ...Payload.experience },
    project: { ...Payload.project },
    education: { ...Payload.education },
    etc: { ...Payload.etc },
    footer: { ...Payload.footer }
  }

  const data = ref<PayloadType>(initialData)
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)
  const source = ref<'supabase' | 'fallback'>('fallback')

  const fetchData = async (): Promise<void> => {
    if (!activeClient) {
      source.value = 'fallback'
      return
    }

    loading.value = true
    error.value = null

    try {
      // 8대 도메인 중 profile 등 원격 테이블 조회 시도
      const { data: profileData, error: profileError } = await (activeClient as any)
        .from('profile')
        .select('*')
        .maybeSingle()

      if (profileError) {
        throw profileError
      }

      let hasRemoteData = false

      if (profileData) {
        data.value.profile = {
          ...data.value.profile,
          ...profileData
        }
        hasRemoteData = true
      }

      if (hasRemoteData) {
        source.value = 'supabase'
      } else {
        source.value = 'fallback'
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      source.value = 'fallback'
    } finally {
      loading.value = false
    }
  }

  if (options.autoFetch) {
    try {
      onMounted(() => {
        void fetchData()
      })
    } catch {
      // 컴포넌트 라이프사이클 밖(단위 테스트 등)에서 호출 시 무시
    }
  }

  return {
    data,
    loading,
    error,
    source,
    fetchData
  }
}
