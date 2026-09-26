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
      const queryTable = (table: string, isSingle: boolean) => {
        const query = (activeClient as any).from(table).select('*')
        if (isSingle) {
          return typeof query?.maybeSingle === 'function' ? query.maybeSingle() : query
        }
        return typeof query?.order === 'function' ? query.order('order_index', { ascending: true }) : query
      }

      // 8대 도메인 테이블 병렬 조회 (단일 행: maybeSingle, 다중 행: order_index 정렬)
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
        queryTable('profile', true),
        queryTable('introduce', true),
        queryTable('skill', false),
        queryTable('experience', false),
        queryTable('project', false),
        queryTable('education', false),
        queryTable('etc', false),
        queryTable('footer', true)
      ])

      // PostgREST API 에러 확인 (RLS 거부, 권한 오류 등)
      const anyError = [
        profileRes?.error,
        introduceRes?.error,
        skillRes?.error,
        experienceRes?.error,
        projectRes?.error,
        educationRes?.error,
        etcRes?.error,
        footerRes?.error
      ].find(Boolean)

      if (anyError) {
        error.value = anyError instanceof Error ? anyError : new Error(anyError.message || String(anyError))
        source.value = 'fallback'
        return
      }

      let hasRemoteData = false

      if (profileRes?.data) {
        data.value.profile = {
          ...data.value.profile,
          ...profileRes.data
        }
        hasRemoteData = true
      }

      if (introduceRes?.data?.contents && introduceRes.data.contents.length > 0) {
        data.value.introduce = {
          contents: introduceRes.data.contents
        }
        hasRemoteData = true
      }

      if (skillRes?.data && skillRes.data.length > 0) {
        data.value.skill = {
          categories: skillRes.data.map((row: any) => ({
            category: row.category,
            items: row.items || []
          }))
        }
        hasRemoteData = true
      }

      if (experienceRes?.data && experienceRes.data.length > 0) {
        data.value.experience = {
          list: experienceRes.data.map((row: any) => ({
            company: row.company,
            position: row.position,
            period: row.period,
            description: row.description || undefined,
            projects: row.projects || undefined
          }))
        }
        hasRemoteData = true
      }

      if (projectRes?.data && projectRes.data.length > 0) {
        data.value.project = {
          list: projectRes.data.map((row: any) => ({
            title: row.title,
            period: row.period,
            where: row.where || undefined,
            description: row.description || undefined,
            achievements: row.achievements || undefined,
            skills: row.skills || undefined,
            link: row.link || undefined
          }))
        }
        hasRemoteData = true
      }

      if (educationRes?.data && educationRes.data.length > 0) {
        data.value.education = {
          list: educationRes.data.map((row: any) => ({
            institution: row.institution,
            course: row.course,
            period: row.period
          }))
        }
        hasRemoteData = true
      }

      if (etcRes?.data && etcRes.data.length > 0) {
        data.value.etc = {
          certifications: etcRes.data.map((row: any) => ({
            name: row.name,
            issuer: row.issuer,
            date: row.date
          }))
        }
        hasRemoteData = true
      }

      if (footerRes?.data) {
        data.value.footer = {
          sign: footerRes.data.sign,
          since: footerRes.data.since,
          github: footerRes.data.github,
          originalRepo: footerRes.data.originalRepo || undefined
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
