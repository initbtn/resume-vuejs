import { ref, onMounted, type Ref } from 'vue'
import { type PayloadType, createEmptyPayload } from '../types/payload.types'
import { fetchResumeFromGateway } from '../lib/apiClient'

export interface UseResumeDataOptions {
  apiUrl?: string
  autoFetch?: boolean
  initialData?: PayloadType
}

export interface UseResumeDataReturn {
  data: Ref<PayloadType>
  loading: Ref<boolean>
  error: Ref<Error | null>
  source: Ref<'gateway' | 'empty' | 'initial'>
  fetchData: () => Promise<void>
}

export function useResumeData(options: UseResumeDataOptions = {}): UseResumeDataReturn {
  const hasCustomInitial = Boolean(options.initialData)

  const data = ref<PayloadType>(
    options.initialData
      ? JSON.parse(JSON.stringify(options.initialData))
      : createEmptyPayload()
  )
  const loading = ref<boolean>(false)
  const error = ref<Error | null>(null)
  const source = ref<'gateway' | 'empty' | 'initial'>(
    hasCustomInitial ? 'initial' : 'empty'
  )

  const fetchData = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const gatewayData = await fetchResumeFromGateway(options.apiUrl)
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
