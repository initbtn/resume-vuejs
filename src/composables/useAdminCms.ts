import { ref } from 'vue'
import { supabase, type TypedSupabaseClient } from '../lib/supabase'
import type { Database } from '../types/database.types'

export interface UseAdminCmsOptions {
  client?: TypedSupabaseClient | null
  onSuccess?: () => Promise<void> | void
}

export interface CmsOperationResult<T = any> {
  success: boolean
  error?: Error | null
  data?: T
}

type ProfileInsert = Database['public']['Tables']['profile']['Insert']
type IntroduceInsert = Database['public']['Tables']['introduce']['Insert']
type SkillInsert = Database['public']['Tables']['skill']['Insert']
type ExperienceInsert = Database['public']['Tables']['experience']['Insert']
type HighlightInsert = Database['public']['Tables']['highlight']['Insert']
type ProjectInsert = Database['public']['Tables']['project']['Insert']
type EducationInsert = Database['public']['Tables']['education']['Insert']
type EtcInsert = Database['public']['Tables']['etc']['Insert']
type FooterInsert = Database['public']['Tables']['footer']['Insert']

export type ReorderTable = 'highlight' | 'skill' | 'experience' | 'project' | 'education' | 'etc'

// 순서 이동은 행 전체를 upsert 로 보낸다 — 일부 열만 보내면 삽입 시도 행의 NOT NULL 검사에 걸릴 수 있다
const REORDER_COLUMNS: Record<ReorderTable, string[]> = {
  highlight: ['title', 'description', 'keywords'],
  skill: ['category', 'items'],
  experience: ['company', 'position', 'period', 'description', 'projects'],
  project: ['title', 'period', 'where', 'description', 'achievements', 'skills', 'link'],
  education: ['institution', 'course', 'period'],
  etc: ['name', 'issuer', 'date']
}
const ARRAY_COLUMNS = new Set(['keywords', 'items', 'achievements', 'skills', 'projects'])

export function useAdminCms(options: UseAdminCmsOptions = {}) {
  const client = options.client !== undefined ? options.client : supabase
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  const handleSuccess = async <T>(data?: T): Promise<CmsOperationResult<T>> => {
    error.value = null
    if (options.onSuccess) {
      await options.onSuccess()
    }
    return { success: true, data }
  }

  const handleError = (err: any): CmsOperationResult => {
    const errorObj = err instanceof Error ? err : new Error(err?.message || String(err))
    error.value = errorObj
    return { success: false, error: errorObj }
  }

  // 1. Profile Update
  const updateProfile = async (payload: {
    name: string
    position: string
    email: string
    phone?: string
    github?: string
    location?: string
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!payload.name?.trim() || !payload.position?.trim() || !payload.email?.trim()) {
      return handleError(new Error('이름, 포지션, 이메일 등 필수 항목을 모두 입력해주세요.'))
    }

    if (!client) {
      return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    }

    try {
      loading.value = true
      const row: ProfileInsert = {
        id: 'default',
        name: payload.name.trim(),
        position: payload.position.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || '',
        github: payload.github?.trim() || '',
        location: payload.location?.trim() || '',
        updated_at: new Date().toISOString()
      }

      const { data, error: dbError } = await client.from('profile').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 2. Introduce Update
  const updateIntroduce = async (contents: string[]): Promise<CmsOperationResult> => {
    error.value = null
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: IntroduceInsert = {
        id: 'default',
        contents: contents.filter(c => c.trim().length > 0),
        updated_at: new Date().toISOString()
      }

      const { data, error: dbError } = await client.from('introduce').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 3. Skill Save / Delete
  const saveSkill = async (category: {
    id?: number
    category: string
    items: string[]
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!category.category.trim()) {
      return handleError(new Error('카테고리 이름을 입력해주세요.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: SkillInsert = {
        category: category.category.trim(),
        items: category.items,
        order_index: category.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (category.id !== undefined) {
        row.id = category.id as never
      }

      const { data, error: dbError } = await client.from('skill').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  const deleteSkill = async (id: number): Promise<CmsOperationResult> => {
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    try {
      loading.value = true
      const { data, error: dbError } = await client.from('skill').delete().eq('id', id)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 4. Experience Save / Delete
  const saveExperience = async (exp: {
    id?: number
    company: string
    position: string
    period: string
    description?: string | null
    projects?: any
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!exp.company.trim() || !exp.position.trim() || !exp.period.trim()) {
      return handleError(new Error('회사명, 직무, 기간은 필수 입력 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: ExperienceInsert = {
        company: exp.company.trim(),
        position: exp.position.trim(),
        period: exp.period.trim(),
        description: exp.description || null,
        projects: exp.projects || [],
        order_index: exp.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (exp.id !== undefined) {
        row.id = exp.id as never
      }

      const { data, error: dbError } = await client.from('experience').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  const deleteExperience = async (id: number): Promise<CmsOperationResult> => {
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    try {
      loading.value = true
      const { data, error: dbError } = await client.from('experience').delete().eq('id', id)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 5. Project Save / Delete
  const saveProject = async (proj: {
    id?: number
    title: string
    period: string
    where?: string | null
    description?: string | null
    achievements?: string[]
    skills?: string[]
    link?: string | null
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!proj.title.trim() || !proj.period.trim()) {
      return handleError(new Error('프로젝트명과 기간은 필수 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: ProjectInsert = {
        title: proj.title.trim(),
        period: proj.period.trim(),
        where: proj.where || null,
        description: proj.description || null,
        achievements: proj.achievements || [],
        skills: proj.skills || [],
        link: proj.link || null,
        order_index: proj.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (proj.id !== undefined) {
        row.id = proj.id as never
      }

      const { data, error: dbError } = await client.from('project').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  const deleteProject = async (id: number): Promise<CmsOperationResult> => {
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    try {
      loading.value = true
      const { data, error: dbError } = await client.from('project').delete().eq('id', id)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 6. Education Save / Delete (Columns: institution, course, period)
  const saveEducation = async (edu: {
    id?: number
    institution: string
    course: string
    period: string
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!edu.institution.trim() || !edu.course.trim() || !edu.period.trim()) {
      return handleError(new Error('기관명, 과정명, 기간은 필수 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: EducationInsert = {
        institution: edu.institution.trim(),
        course: edu.course.trim(),
        period: edu.period.trim(),
        order_index: edu.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (edu.id !== undefined) {
        row.id = edu.id as never
      }

      const { data, error: dbError } = await client.from('education').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  const deleteEducation = async (id: number): Promise<CmsOperationResult> => {
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    try {
      loading.value = true
      const { data, error: dbError } = await client.from('education').delete().eq('id', id)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 7. Etc Save / Delete (Columns: name, issuer, date)
  const saveEtc = async (item: {
    id?: number
    name: string
    issuer: string
    date: string
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!item.name.trim() || !item.issuer.trim() || !item.date.trim()) {
      return handleError(new Error('자격증/활동명, 발급처, 취득일은 필수 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: EtcInsert = {
        name: item.name.trim(),
        issuer: item.issuer.trim(),
        date: item.date.trim(),
        order_index: item.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (item.id !== undefined) {
        row.id = item.id as never
      }

      const { data, error: dbError } = await client.from('etc').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  const deleteEtc = async (id: number): Promise<CmsOperationResult> => {
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    try {
      loading.value = true
      const { data, error: dbError } = await client.from('etc').delete().eq('id', id)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // Highlight Save / Delete (Columns: title, description, keywords)
  const saveHighlight = async (item: {
    id?: number
    title: string
    description: string
    keywords: string[]
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!item.title.trim() || !item.description.trim()) {
      return handleError(new Error('핵심 역량 카드의 제목과 설명은 필수 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: HighlightInsert = {
        title: item.title.trim(),
        description: item.description.trim(),
        keywords: item.keywords.map((k) => k.trim()).filter(Boolean),
        order_index: item.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (item.id !== undefined) {
        row.id = item.id as never
      }

      const { data, error: dbError } = await client.from('highlight').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  const deleteHighlight = async (id: number): Promise<CmsOperationResult> => {
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    try {
      loading.value = true
      const { data, error: dbError } = await client.from('highlight').delete().eq('id', id)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 8. Footer Update
  const updateFooter = async (payload: {
    github: string
    sign: string
    since?: number
    originalRepo?: string | null
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!payload.github?.trim() || !payload.sign?.trim()) {
      return handleError(new Error('GitHub 링크와 서명 문구는 필수 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: FooterInsert = {
        id: 'default',
        github: payload.github.trim(),
        sign: payload.sign.trim(),
        since: payload.since ?? new Date().getFullYear(),
        originalRepo: payload.originalRepo || null,
        updated_at: new Date().toISOString()
      }

      const { data, error: dbError } = await client.from('footer').upsert(row)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 순서 이동: 바뀌는 행을 한 번의 upsert(배열)로 저장한다 — 중간에 실패해도 일부만 반영되지 않는다
  const reorderItems = async (table: ReorderTable, rows: Array<Record<string, any>>): Promise<CmsOperationResult> => {
    error.value = null
    if (rows.length === 0) return { success: true }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    if (rows.some((r) => r.id === undefined || r.id === null)) {
      return handleError(new Error('순서를 바꿀 행의 id 가 없습니다.'))
    }

    try {
      loading.value = true
      const now = new Date().toISOString()
      const payload = rows.map((r) => {
        const row: Record<string, unknown> = { id: r.id }
        for (const col of REORDER_COLUMNS[table]) {
          row[col] = r[col] ?? (ARRAY_COLUMNS.has(col) ? [] : null)
        }
        row.order_index = r.order_index
        row.updated_at = now
        return row
      })
      const { data, error: dbError } = await (client.from(table) as any).upsert(payload)
      if (dbError) return handleError(dbError)
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    updateProfile,
    updateIntroduce,
    saveSkill,
    deleteSkill,
    saveExperience,
    deleteExperience,
    saveProject,
    deleteProject,
    saveEducation,
    deleteEducation,
    saveEtc,
    deleteEtc,
    saveHighlight,
    deleteHighlight,
    reorderItems,
    updateFooter
  }
}
