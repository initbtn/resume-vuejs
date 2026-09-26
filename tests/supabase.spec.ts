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
    it('deploy.yml 워크플로의 빌드 스텝에 VITE_SUPABASE_URL 및 VITE_SUPABASE_ANON_KEY가 주입되어야 한다', async () => {
      const fs = await import('fs')
      const path = await import('path')

      const workflowFile = path.resolve(__dirname, '../.github/workflows/deploy.yml')
      expect(fs.existsSync(workflowFile)).toBe(true)

      const workflowContent = fs.readFileSync(workflowFile, 'utf-8')
      expect(workflowContent).toContain('VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}')
      expect(workflowContent).toContain('VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}')
    })

    it('useResumeData 호출 시 8대 도메인 테이블 전체를 조회해야 한다', async () => {
      const queriedTables: string[] = []
      const mockQueryBuilder = {
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        order: vi.fn().mockResolvedValue({ data: [], error: null })
      }
      const mockClient = {
        from: vi.fn().mockImplementation((table: string) => {
          queriedTables.push(table)
          return {
            select: vi.fn().mockReturnValue(mockQueryBuilder)
          }
        })
      } as any

      const { fetchData } = useResumeData({
        client: mockClient
      })

      await fetchData()

      const expectedDomains = ['profile', 'introduce', 'skill', 'experience', 'project', 'education', 'etc', 'footer']
      for (const domain of expectedDomains) {
        expect(queriedTables).toContain(domain)
      }
    })

    it('Supabase에서 { data: null, error } 형태의 API 에러 반환 시 error.value에 에러를 기록하고 fallback되어야 한다', async () => {
      const postgrestError = {
        message: 'permission denied for table skill',
        details: null,
        hint: null,
        code: '42501'
      }

      const mockClient = {
        from: vi.fn().mockImplementation((table: string) => {
          return {
            select: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
              order: vi.fn().mockResolvedValue(
                table === 'skill'
                  ? { data: null, error: postgrestError }
                  : { data: [], error: null }
              )
            })
          }
        })
      } as any

      const { data, loading, error, source, fetchData } = useResumeData({
        client: mockClient
      })

      await fetchData()

      expect(data.value.skill.categories).toEqual(Payload.skill.categories)
      expect(source.value).toBe('fallback')
      expect(error.value).not.toBeNull()
      expect(error.value?.message).toContain('permission denied for table skill')
      expect(loading.value).toBe(false)
    })
  })
})


