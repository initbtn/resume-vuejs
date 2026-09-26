import { ref } from 'vue'
import { supabase, type TypedSupabaseClient } from '../lib/supabase'

export interface UseAdminCmsOptions {
  client?: TypedSupabaseClient | null
  onSuccess?: () => Promise<void> | void
}

export interface CmsOperationResult {
  success: boolean
  error?: Error | null
  data?: any
}

export function useAdminCms(options: UseAdminCmsOptions = {}) {
  const client = options.client !== undefined ? options.client : supabase
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)

  const handleSuccess = async (data?: any): Promise<CmsOperationResult> => {
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
    phone: string
    github: string
    location: string
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!payload.name || !payload.position || !payload.email) {
      return handleError(new Error('이름, 포지션, 이메일 등 필수 항목을 모두 입력해주세요.'))
    }

    if (!client) {
      return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    }

    try {
      loading.value = true
      const { data, error: dbError } = await client
        .from('profile')
        .upsert({
          id: 'default',
          name: payload.name.trim(),
          position: payload.position.trim(),
          email: payload.email.trim(),
          phone: payload.phone?.trim() || '',
          github: payload.github?.trim() || '',
          location: payload.location?.trim() || '',
          updated_at: new Date().toISOString()
        })

      if (dbError) {
        return handleError(dbError)
      }
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
    if (!client) {
      return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    }

    try {
      loading.value = true
      const { data, error: dbError } = await client
        .from('introduce')
        .upsert({
          id: 'default',
          contents: contents.filter(c => c.trim().length > 0),
          updated_at: new Date().toISOString()
        })

      if (dbError) {
        return handleError(dbError)
      }
      return await handleSuccess(data)
    } catch (err) {
      return handleError(err)
    } finally {
      loading.value = false
    }
  }

  // 3. Skill Category Save / Delete
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
    if (!client) {
      return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))
    }

    try {
      loading.value = true
      const row: any = {
        category: category.category.trim(),
        items: category.items,
        order_index: category.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (category.id !== undefined) {
        row.id = category.id
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
    projects?: any[]
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!exp.company.trim() || !exp.position.trim() || !exp.period.trim()) {
      return handleError(new Error('회사명, 직무, 기간은 필수 입력 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: any = {
        company: exp.company.trim(),
        position: exp.position.trim(),
        period: exp.period.trim(),
        description: exp.description || null,
        projects: exp.projects || [],
        order_index: exp.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (exp.id !== undefined) {
        row.id = exp.id
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
      const row: any = {
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
        row.id = proj.id
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

  // 6. Education Save / Delete
  const saveEducation = async (edu: {
    id?: number
    name: string
    major: string
    period: string
    description?: string | null
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!edu.name.trim() || !edu.period.trim()) {
      return handleError(new Error('기관명과 기간은 필수 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: any = {
        name: edu.name.trim(),
        major: edu.major.trim(),
        period: edu.period.trim(),
        description: edu.description || null,
        order_index: edu.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (edu.id !== undefined) {
        row.id = edu.id
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

  // 7. Etc Save / Delete
  const saveEtc = async (item: {
    id?: number
    title: string
    period: string
    description?: string | null
    order_index?: number
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!item.title.trim() || !item.period.trim()) {
      return handleError(new Error('제목과 기간은 필수 항목입니다.'))
    }
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const row: any = {
        title: item.title.trim(),
        period: item.period.trim(),
        description: item.description || null,
        order_index: item.order_index ?? 0,
        updated_at: new Date().toISOString()
      }
      if (item.id !== undefined) {
        row.id = item.id
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

  // 8. Footer Update
  const updateFooter = async (payload: {
    github: string
    sign: string
    since?: number
    originalRepo?: string | null
  }): Promise<CmsOperationResult> => {
    error.value = null
    if (!client) return handleError(new Error('Supabase 클라이언트가 설정되지 않았습니다.'))

    try {
      loading.value = true
      const { data, error: dbError } = await client
        .from('footer')
        .upsert({
          id: 'default',
          github: payload.github.trim(),
          sign: payload.sign.trim(),
          since: payload.since ?? new Date().getFullYear(),
          originalRepo: payload.originalRepo || null,
          updated_at: new Date().toISOString()
        })

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
    updateFooter
  }
}
