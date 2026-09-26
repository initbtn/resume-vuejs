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
      // 8대 도메인 병렬 조회 시도
      const [
        profileRes,
        introduceRes,
        skillRes,
        experienceRes,
        projectRes,
        educationRes,
        etcRes,
        footerRes
      ] = await Promise.all([
        (activeClient as any).from('profile').select('*').maybeSingle(),
        (activeClient as any).from('introduce').select('*').maybeSingle(),
        (activeClient as any).from('skill').select('*').order('order_index', { ascending: true }),
        (activeClient as any).from('experience').select('*').order('order_index', { ascending: true }),
        (activeClient as any).from('project').select('*').order('order_index', { ascending: true }),
        (activeClient as any).from('education').select('*').order('order_index', { ascending: true }),
        (activeClient as any).from('etc').select('*').order('order_index', { ascending: true }),
        (activeClient as any).from('footer').select('*').maybeSingle()
      ])

      let hasRemoteData = false

      if (profileRes?.data) {
        data.value.profile = {
          name: profileRes.data.name,
          position: profileRes.data.position,
          email: profileRes.data.email,
          phone: profileRes.data.phone,
          github: profileRes.data.github,
          location: profileRes.data.location
        }
        hasRemoteData = true
      }

      if (introduceRes?.data && introduceRes.data.contents?.length > 0) {
        data.value.introduce = {
          contents: introduceRes.data.contents
        }
        hasRemoteData = true
      }

      if (skillRes?.data && skillRes.data.length > 0) {
        data.value.skill = {
          categories: skillRes.data.map((item: any) => ({
            category: item.category,
            items: item.items
          }))
        }
        hasRemoteData = true
      }

      if (experienceRes?.data && experienceRes.data.length > 0) {
        data.value.experience = {
          list: experienceRes.data.map((item: any) => ({
            company: item.company,
            position: item.position,
            period: item.period,
            description: item.description ?? undefined,
            projects: Array.isArray(item.projects) ? item.projects : []
          }))
        }
        hasRemoteData = true
      }

      if (projectRes?.data && projectRes.data.length > 0) {
        data.value.project = {
          list: projectRes.data.map((item: any) => ({
            title: item.title,
            period: item.period,
            where: item.where ?? undefined,
            description: item.description ?? undefined,
            achievements: item.achievements ?? [],
            skills: item.skills ?? [],
            link: item.link ?? undefined
          }))
        }
        hasRemoteData = true
      }

      if (educationRes?.data && educationRes.data.length > 0) {
        data.value.education = {
          list: educationRes.data.map((item: any) => ({
            institution: item.institution,
            course: item.course,
            period: item.period
          }))
        }
        hasRemoteData = true
      }

      if (etcRes?.data && etcRes.data.length > 0) {
        data.value.etc = {
          certifications: etcRes.data.map((item: any) => ({
            name: item.name,
            issuer: item.issuer,
            date: item.date
          }))
        }
        hasRemoteData = true
      }

      if (footerRes?.data) {
        data.value.footer = {
          sign: footerRes.data.sign,
          since: footerRes.data.since,
          github: footerRes.data.github,
          originalRepo: footerRes.data.originalRepo ?? undefined
        }
        hasRemoteData = true
      }

      source.value = hasRemoteData ? 'supabase' : 'fallback'
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
