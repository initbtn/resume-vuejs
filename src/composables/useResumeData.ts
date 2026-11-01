import { ref, onMounted, type Ref } from 'vue'
import { type PayloadType, createEmptyPayload } from '../types/payload.types'
import type { TypedSupabaseClient } from '../lib/supabase'
import { fetchResumeFromGateway } from '../lib/apiClient'

export interface UseResumeDataOptions {
  client?: TypedSupabaseClient | null
  apiUrl?: string
  autoFetch?: boolean
}

export interface UseResumeDataReturn {
  data: Ref<PayloadType>
  loading: Ref<boolean>
  error: Ref<Error | null>
  source: Ref<'supabase' | 'gateway' | 'empty'>
  fetchData: () => Promise<void>
}

export function useResumeData(options: UseResumeDataOptions = {}): UseResumeDataReturn {
  const activeClient = options.client !== undefined ? options.client : null

  const data = ref<PayloadType>(createEmptyPayload())
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)
  const source = ref<'supabase' | 'gateway' | 'empty'>('empty')

  const fetchData = async (): Promise<void> => {
    loading.value = true
    error.value = null

    if (!activeClient) {
      try {
        const gatewayData = await fetchResumeFromGateway(options.apiUrl || '/api/resume')
        if (gatewayData) {
          if (gatewayData.profile) data.value.profile = { ...data.value.profile, ...gatewayData.profile }
          if (gatewayData.introduce?.contents) {
            data.value.introduce = { contents: gatewayData.introduce.contents }
          }
          if (gatewayData.highlight?.list) {
            data.value.highlight = { list: gatewayData.highlight.list }
          }
          if (gatewayData.skill?.categories) {
            data.value.skill = { categories: gatewayData.skill.categories }
          }
          if (gatewayData.experience?.list) {
            data.value.experience = { list: gatewayData.experience.list }
          }
          if (gatewayData.project?.list) {
            data.value.project = { list: gatewayData.project.list }
          }
          if (gatewayData.education?.list) {
            data.value.education = { list: gatewayData.education.list }
          }
          if (gatewayData.etc?.certifications) {
            data.value.etc = { certifications: gatewayData.etc.certifications }
          }
          if (gatewayData.footer) data.value.footer = { ...data.value.footer, ...gatewayData.footer }

          source.value = 'gateway'
          return
        }
      } catch (err) {
        error.value = err instanceof Error ? err : new Error(String(err))
      } finally {
        loading.value = false
      }
      return
    }

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
        highlightRes,
        skillRes,
        experienceRes,
        projectRes,
        educationRes,
        etcRes,
        footerRes
      ] = await Promise.all([
        queryTable('profile', true),
        queryTable('introduce', true),
        queryTable('highlight', false),
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
        highlightRes?.error,
        skillRes?.error,
        experienceRes?.error,
        projectRes?.error,
        educationRes?.error,
        etcRes?.error,
        footerRes?.error
      ].find(Boolean)

      if (anyError) {
        error.value = anyError instanceof Error ? anyError : new Error(anyError.message || String(anyError))
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

      if (introduceRes?.data?.contents) {
        data.value.introduce = {
          contents: introduceRes.data.contents
        }
        hasRemoteData = true
      }

      if (highlightRes?.data && highlightRes.data.length > 0) {
        data.value.highlight = {
          list: highlightRes.data.map((row: any) => ({
            id: row.id,
            order_index: row.order_index,
            title: row.title,
            description: row.description,
            keywords: row.keywords || []
          }))
        }
        hasRemoteData = true
      }

      if (skillRes?.data && skillRes.data.length > 0) {
        data.value.skill = {
          categories: skillRes.data.map((row: any) => ({
            id: row.id,
            order_index: row.order_index,
            category: row.category,
            items: row.items || []
          }))
        }
        hasRemoteData = true
      }

      if (experienceRes?.data && experienceRes.data.length > 0) {
        data.value.experience = {
          list: experienceRes.data.map((row: any) => ({
            id: row.id,
            order_index: row.order_index,
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
            id: row.id,
            order_index: row.order_index,
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
            id: row.id,
            order_index: row.order_index,
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
            id: row.id,
            order_index: row.order_index,
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

      if (hasRemoteData) {
        source.value = 'supabase'
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
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
