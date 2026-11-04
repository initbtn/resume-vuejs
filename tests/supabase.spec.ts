import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useResumeData } from '../src/composables/useResumeData'

describe('Supabase Client & Composable (Milestone 2 - Issue #4)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('useResumeData Composable & Fallback 무결성', () => {
    it('초기 상태에서는 기본 빈 Payload 상태를 유지한다', async () => {
      const { data, loading, error, source, fetchData } = useResumeData()

      expect(data.value.profile.name).toBe('')
      expect(source.value).toBe('empty')
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, data: null })
      })

      await fetchData()
      expect(data.value.profile.name).toBe('')
      expect(source.value).toBe('empty')
    })

    it('게이트웨이 호출 시 에러가 발생하면 error에 기록하고 빈 상태를 유지한다', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error or gateway offline'))

      const { data, loading, error, source, fetchData } = useResumeData()

      await fetchData()

      expect(data.value.profile.name).toBe('')
      expect(source.value).toBe('empty')
      expect(error.value).not.toBeNull()
      expect(error.value?.message).toContain('Network error or gateway offline')
      expect(loading.value).toBe(false)
    })

    it('게이트웨이 데이터 조회 성공 시 원격 데이터를 반영하고 source가 gateway가 되어야 한다', async () => {
      const mockProfile = {
        name: '홍길동',
        position: 'Full Stack Engineer',
        email: 'test@example.com'
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            profile: mockProfile
          }
        })
      })

      const { data, source, fetchData } = useResumeData()

      await fetchData()

      expect(data.value.profile.name).toBe('홍길동')
      expect(source.value).toBe('gateway')
    })
  })

  describe('Supabase DB DDL & RLS Security Schema (Milestone 2 - Issue #8)', () => {
    it('마이그레이션 SQL에 8대 도메인 테이블 생성 및 RLS 정책이 전수 선언되어야 한다', async () => {
      const fs = await import('fs')
      const path = await import('path')

      const migrationFile = path.resolve(__dirname, '../supabase/migrations/20260926000000_create_resume_tables.sql')
      expect(fs.existsSync(migrationFile)).toBe(true)

      const sqlContent = fs.readFileSync(migrationFile, 'utf-8')
      const domains = ['profile', 'introduce', 'skill', 'experience', 'project', 'education', 'etc', 'footer']

      for (const domain of domains) {
        expect(sqlContent).toContain(`CREATE TABLE IF NOT EXISTS public.${domain}`)
        expect(sqlContent).toContain(`ALTER TABLE public.${domain} ENABLE ROW LEVEL SECURITY;`)
        expect(sqlContent).toContain(`CREATE POLICY "Allow public read access for anon" ON public.${domain}`)
        expect(sqlContent).toContain(`CREATE POLICY "Allow authenticated write access" ON public.${domain}`)
      }
    })

    it('시드 데이터 SQL에 8대 도메인의 초기 데이터가 정의되어 있어야 한다', async () => {
      const fs = await import('fs')
      const path = await import('path')

      const seedFile = path.resolve(__dirname, '../supabase/seed.sql')
      expect(fs.existsSync(seedFile)).toBe(true)

      const seedContent = fs.readFileSync(seedFile, 'utf-8')
      const domains = ['profile', 'introduce', 'skill', 'experience', 'project', 'education', 'etc', 'footer']

      for (const domain of domains) {
        expect(seedContent).toContain(`public.${domain}`)
      }
    })

    it('database.types.ts에 8대 도메인의 테이블 타입 정의가 완전하게 포함되어야 한다', async () => {
      const fs = await import('fs')
      const path = await import('path')

      const typesFile = path.resolve(__dirname, '../src/types/database.types.ts')
      expect(fs.existsSync(typesFile)).toBe(true)

      const typesContent = fs.readFileSync(typesFile, 'utf-8')
      const domains = ['profile', 'introduce', 'skill', 'experience', 'project', 'education', 'etc', 'footer']

      for (const domain of domains) {
        expect(typesContent).toContain(`${domain}: {`)
      }
    })
  })

  describe('Supabase Security Hardening - Network Restrictions & CORS (Issue #12)', () => {
    it('scripts/supabase.sh에 network-allow-ip 및 network-restrictions 서브커맨드가 정의되어 있어야 한다', async () => {
      const fs = await import('fs')
      const path = await import('path')

      const scriptFile = path.resolve(__dirname, '../scripts/supabase.sh')
      expect(fs.existsSync(scriptFile)).toBe(true)

      const scriptContent = fs.readFileSync(scriptFile, 'utf-8')
      expect(scriptContent).toContain('network-allow-ip)')
      expect(scriptContent).toContain('network-restrictions)')
      expect(scriptContent).toContain('dbAllowedCidrs')
      expect(scriptContent).toContain('network-restrictions/apply')
    })
  })

  describe('Frontend Supabase Integration & 8 Domains Fetching (Milestone 2 - Issue #14)', () => {
    it('deploy.yml 워크플로의 빌드 스텝에 클라이언트 DB 자격증명(VITE_SUPABASE_*)이 노출되지 않아야 한다 (Issue #50 아키텍처 보안 규율)', async () => {
      const fs = await import('fs')
      const path = await import('path')

      const workflowFile = path.resolve(__dirname, '../.github/workflows/deploy.yml')
      expect(fs.existsSync(workflowFile)).toBe(true)

      const workflowContent = fs.readFileSync(workflowFile, 'utf-8')
      expect(workflowContent).not.toContain('VITE_SUPABASE_URL:')
      expect(workflowContent).not.toContain('VITE_SUPABASE_ANON_KEY:')
    })

    it('useResumeData 호출 시 게이트웨이를 통해 8대 도메인 전체 데이터가 수신 및 반영되어야 한다', async () => {
      const mockFullPayload = {
        profile: { name: '테스트유저' },
        introduce: { contents: ['소개 1'] },
        highlight: { list: [] },
        skill: { categories: [] },
        experience: { list: [] },
        project: { list: [] },
        education: { list: [] },
        etc: { certifications: [] },
        footer: { sign: 'sign' }
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockFullPayload
        })
      })

      const { data, source, fetchData } = useResumeData()
      await fetchData()

      expect(data.value.profile.name).toBe('테스트유저')
      expect(data.value.introduce.contents).toEqual(['소개 1'])
      expect(source.value).toBe('gateway')
    })

    it('게이트웨이 HTTP 에러 반환 시 error.value에 에러를 기록하고 empty 상태를 유지해야 한다', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: 'Internal Gateway Error'
        })
      })

      const { data, loading, error, source, fetchData } = useResumeData()

      await fetchData()

      expect(data.value.skill.categories).toEqual([])
      expect(source.value).toBe('empty')
      expect(error.value).not.toBeNull()
      expect(error.value?.message).toContain('HTTP 500')
      expect(loading.value).toBe(false)
    })
  })
})
