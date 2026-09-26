import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSupabaseClient } from '../src/lib/supabase'
import { useResumeData } from '../src/composables/useResumeData'
import { Payload } from '../src/payload'

describe('Supabase Client & Composable (Milestone 2 - Issue #4)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('createSupabaseClient', () => {
    it('환경변수나 파라미터가 없으면 null을 반환해야 한다', () => {
      const client = createSupabaseClient('', '')
      expect(client).toBeNull()
    })

    it('유효한 url과 anonKey가 주어지면 SupabaseClient 인스턴스를 생성해야 한다', () => {
      const client = createSupabaseClient(
        'https://rhkrhkxrnpfnrqxwjojo.supabase.co',
        'dummy-anon-key'
      )
      expect(client).not.toBeNull()
      expect(client).toBeDefined()
      expect(typeof client?.from).toBe('function')
    })
  })

  describe('useResumeData Composable & Fallback 무결성', () => {
    it('클라이언트가 비활성화 상태일 때 기본 로컬 Payload로 fallback되어야 한다', async () => {
      const { data, loading, error, source, fetchData } = useResumeData({
        client: null
      })

      expect(data.value.profile.name).toBe(Payload.profile.name)
      expect(source.value).toBe('fallback')
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()

      await fetchData()
      expect(data.value.profile.name).toBe(Payload.profile.name)
      expect(source.value).toBe('fallback')
    })

    it('Supabase 호출 시 에러가 발생해도 로컬 Payload로 안전하게 fallback되어야 한다', async () => {
      const mockClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Network error or table not found')
          })
        })
      } as any

      const { data, loading, error, source, fetchData } = useResumeData({
        client: mockClient
      })

      await fetchData()

      expect(data.value.profile.name).toBe(Payload.profile.name)
      expect(source.value).toBe('fallback')
      expect(error.value).not.toBeNull()
      expect(loading.value).toBe(false)
    })

    it('Supabase 데이터 조회 성공 시 원격 데이터를 반영하고 source가 supabase가 되어야 한다', async () => {
      const mockProfile = {
        name: '홍길동',
        role: 'Full Stack Engineer',
        email: 'test@example.com'
      }

      const mockClient = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'profile') {
            return {
              select: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({
                  data: mockProfile,
                  error: null
                })
              })
            }
          }
          return {
            select: vi.fn().mockResolvedValue({
              data: null,
              error: null
            })
          }
        })
      } as any

      const { data, source, fetchData } = useResumeData({
        client: mockClient
      })

      await fetchData()

      expect(data.value.profile.name).toBe('홍길동')
      expect(source.value).toBe('supabase')
    })
  })
})
