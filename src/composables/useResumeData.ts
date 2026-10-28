import { ref, onMounted, type Ref } from 'vue'
import type { PayloadType } from '../payload/types'
import { Payload } from '../payload'
import { supabase, type TypedSupabaseClient } from '../lib/supabase'
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
  source: Ref<'supabase' | 'fallback'>
  fetchData: () => Promise<void>
}

export function useResumeData(options: UseResumeDataOptions = {}): UseResumeDataReturn {
  const activeClient = options.client !== undefined ? options.client : supabase

  // 깊은 복사로 초기 로컬 fallback 데이터 생성
  const initialData: PayloadType = {
    profile: { ...Payload.profile },
    introduce: { ...Payload.introduce },
    highlight: { ...Payload.highlight },
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
    loading.value = true
    error.value = null

    if (!activeClient) {
      try {
        const gatewayData = await fetchResumeFromGateway(options.apiUrl || '/api/resume')
        if (gatewayData) {
          if (gatewayData.profile) data.value.profile = { ...data.value.profile, ...gatewayData.profile }
          if (gatewayData.introduce?.contents && gatewayData.introduce.contents.length > 0) {
            data.value.introduce = { contents: gatewayData.introduce.contents }
          }
          if (gatewayData.highlight?.list && gatewayData.highlight.list.length > 0) {
            data.value.highlight = { list: gatewayData.highlight.list }
          }
          if (gatewayData.skill?.categories && gatewayData.skill.categories.length > 0) {
            data.value.skill = { categories: gatewayData.skill.categories }
          }
          if (gatewayData.experience?.list && gatewayData.experience.list.length > 0) {
            data.value.experience = { list: gatewayData.experience.list }
          }
          if (gatewayData.project?.list && gatewayData.project.list.length > 0) {
            data.value.project = { list: gatewayData.project.list }
          }
          if (gatewayData.education?.list && gatewayData.education.list.length > 0) {
            data.value.education = { list: gatewayData.education.list }
          }
          if (gatewayData.etc?.certifications && gatewayData.etc.certifications.length > 0) {
            data.value.etc = { certifications: gatewayData.etc.certifications }
          }
          if (gatewayData.footer) data.value.footer = { ...data.value.footer, ...gatewayData.footer }

          source.value = 'supabase'
          return
        }
      } catch {
        // WAS 게이트웨이 조회 불가 시 안전하게 fallback 유지
      } finally {
        loading.value = false
      }
      source.value = 'fallback'
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
