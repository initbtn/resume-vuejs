import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchResumeFromGateway, sendCmsToGateway, authGatewayRequest } from '../src/lib/apiClient'
import { useResumeData } from '../src/composables/useResumeData'
import { useAdminCms } from '../src/composables/useAdminCms'
import { useAuth } from '../src/composables/useAuth'
import resumeHandler from '../api/resume'
import cmsHandler from '../api/cms'
import authHandler from '../api/auth'

describe('WAS API Gateway & Client Integration (Issue #50)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear()
    }
  })

  describe('apiClient Gateway Functions', () => {
    it('fetchResumeFromGateway should fetch /api/resume and return data', async () => {
      const mockPayload = {
        profile: { name: '게이트웨이개발자', position: 'Lead', email: 'gateway@test.com' }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockPayload })
      } as any)

      const result = await fetchResumeFromGateway('/api/resume')
      expect(global.fetch).toHaveBeenCalledWith('/api/resume')
      expect(result?.profile?.name).toBe('게이트웨이개발자')
    })

    it('sendCmsToGateway should post payload to /api/cms with Bearer token', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'default' } })
      } as any)

      const result = await sendCmsToGateway('profile', 'upsert', { name: '새이름' }, 'mock-token')
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cms',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-token'
          }),
          body: JSON.stringify({ table: 'profile', action: 'upsert', payload: { name: '새이름' } })
        })
      )
      expect(result.success).toBe(true)
    })

    it('authGatewayRequest should post login action to /api/auth', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: { id: 'usr-1', email: 'test@example.com' },
          session: { access_token: 'jwt-123' }
        })
      } as any)

      const result = await authGatewayRequest('login', { email: 'test@example.com', password: 'pw' })
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ action: 'login', email: 'test@example.com', password: 'pw' })
        })
      )
      expect(result.success).toBe(true)
      expect(result.user?.id).toBe('usr-1')
    })
  })

  describe('useResumeData with WAS Gateway', () => {
    it('client가 null일 때 WAS 게이트웨이 호출이 성공하면 source가 supabase가 되고 데이터가 반영되어야 한다', async () => {
      const mockGatewayData = {
        profile: { name: '게이트웨이홍길동', position: '엔지니어', email: 'gw@test.com' }
      }
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: mockGatewayData })
      } as any)

      const { data, source, fetchData, loading } = useResumeData({ client: null })
      await fetchData()

      expect(data.value.profile.name).toBe('게이트웨이홍길동')
      expect(source.value).toBe('supabase')
      expect(loading.value).toBe(false)
    })

    it('client가 null이고 게이트웨이 호출 실패 시 안전하게 fallback으로 유지되어야 한다', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const { source, fetchData, loading } = useResumeData({ client: null })
      await fetchData()

      expect(source.value).toBe('fallback')
      expect(loading.value).toBe(false)
    })
  })

  describe('useAdminCms with WAS Gateway and Bearer Token', () => {
    it('client가 null일 때 updateProfile이 WAS 게이트웨이를 경유하여 호출되고 토큰이 전달되어야 한다', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'default' } })
      } as any)

      const { updateProfile } = useAdminCms({ client: null, token: 'custom-admin-jwt' })
      const res = await updateProfile({
        name: '게이트웨이수정',
        position: 'Architect',
        email: 'arch@test.com'
      })

      expect(res.success).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cms',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer custom-admin-jwt'
          }),
          body: expect.stringContaining('profile')
        })
      )
    })

    it('localStorage에 저장된 토큰이 있을 때 token 옵션 없이도 헤더에 주입되어야 한다', async () => {
      window.localStorage.setItem('resume_admin_token', 'local-saved-token')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { id: 'default' } })
      } as any)

      const { updateProfile } = useAdminCms({ client: null })
      const res = await updateProfile({
        name: '로컬토큰수정',
        position: 'Architect',
        email: 'arch@test.com'
      })

      expect(res.success).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/cms',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer local-saved-token'
          })
        })
      )
    })
  })

  describe('useAuth with WAS Gateway and Persistence', () => {
    it('client가 null일 때 signIn이 성공하면 localStorage에 토큰이 영속화되어야 한다', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          user: { id: 'gw-user-1', email: 'admin@gw.com' },
          session: { access_token: 'gw-jwt-secret' }
        })
      } as any)

      const { signIn, user, isAuthenticated } = useAuth({ client: null, autoInitialize: false })
      const res = await signIn('admin@gw.com', 'password123')

      expect(res.success).toBe(true)
      expect(user.value?.id).toBe('gw-user-1')
      expect(isAuthenticated.value).toBe(true)
      expect(window.localStorage.getItem('resume_admin_token')).toBe('gw-jwt-secret')
    })

    it('signOut 호출 시 localStorage의 세션 토큰이 삭제되어야 한다', async () => {
      window.localStorage.setItem('resume_admin_token', 'active-token')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      } as any)

      const { signOut } = useAuth({ client: null, autoInitialize: false })
      await signOut()

      expect(window.localStorage.getItem('resume_admin_token')).toBeNull()
    })
  })

  describe('Serverless Handlers Method, CORS and Auth Guards', () => {
    it('resumeHandler should return 405 for POST request', async () => {
      const req: any = { method: 'POST', headers: {} }
      let statusCode = 0
      let responseBody = ''
      const res: any = {
        setHeader: vi.fn(),
        statusCode: 0,
        end: (data?: string) => {
          statusCode = res.statusCode
          if (data) responseBody = data
        }
      }

      await resumeHandler(req, res)
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
      expect(statusCode).toBe(405)
      expect(responseBody).toContain('Method Not Allowed')
    })

    it('cmsHandler should return 405 for GET request', async () => {
      const req: any = { method: 'GET', headers: {} }
      let statusCode = 0
      const res: any = {
        setHeader: vi.fn(),
        statusCode: 0,
        end: () => {
          statusCode = res.statusCode
        }
      }

      await cmsHandler(req, res)
      expect(statusCode).toBe(405)
    })

    it('cmsHandler should return 401 when Authorization Bearer token is missing', async () => {
      process.env.SUPABASE_URL = 'https://mock.supabase.co'
      process.env.SUPABASE_ANON_KEY = 'mock-key'

      const req: any = { method: 'POST', headers: {} }
      let statusCode = 0
      let responseBody = ''
      const res: any = {
        setHeader: vi.fn(),
        statusCode: 0,
        end: (data?: string) => {
          statusCode = res.statusCode
          if (data) responseBody = data
        }
      }

      await cmsHandler(req, res)
      expect(statusCode).toBe(401)
      expect(responseBody).toContain('Unauthorized')
    })

    it('authHandler should return 405 for GET request', async () => {
      const req: any = { method: 'GET', headers: {} }
      let statusCode = 0
      const res: any = {
        setHeader: vi.fn(),
        statusCode: 0,
        end: () => {
          statusCode = res.statusCode
        }
      }

      await authHandler(req, res)
      expect(statusCode).toBe(405)
    })
  })
})
