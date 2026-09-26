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
      const mockQueryBuilder = {
        maybeSingle: vi.fn().mockRejectedValue(new Error('Network error or table not found')),
        order: vi.fn().mockRejectedValue(new Error('Network error or table not found'))
      }
      const mockClient = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue(mockQueryBuilder)
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

    it('Supabase 데이터 조회 성공 시 8대 도메인 원격 데이터를 반영하고 source가 supabase가 되어야 한다', async () => {
      const mockProfile = {
        name: '홍길동',
        position: 'Full Stack Engineer',
        email: 'test@example.com',
        phone: '010-1234-5678',
        github: 'https://github.com/test',
        location: '서울'
      }
      const mockIntroduce = {
        contents: ['안녕하세요. 원격 소개글입니다.']
      }
      const mockSkill = [
        { category: 'Frontend', items: ['Vue 3', 'TypeScript'] }
      ]
      const mockExperience = [
        { company: '원격 테크', position: '리드 엔지니어', period: '2024 - 현재', description: '설명', projects: [] }
      ]
      const mockProject = [
        { title: '원격 프로젝트', period: '2024', achievements: ['성과'], skills: ['Vue'] }
      ]
      const mockEducation = [
        { institution: '원격 대학교', course: '컴퓨터공학', period: '2020 - 2024' }
      ]
      const mockEtc = [
        { name: '정보처리기사', issuer: '한국산업인력공단', date: '2024' }
      ]
      const mockFooter = {
        sign: '홍길동',
        since: 2026,
        github: 'https://github.com/test'
      }

      const mockClient = {
        from: vi.fn().mockImplementation((table: string) => {
          return {
            select: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockImplementation(() => {
                if (table === 'profile') return Promise.resolve({ data: mockProfile, error: null })
                if (table === 'introduce') return Promise.resolve({ data: mockIntroduce, error: null })
                if (table === 'footer') return Promise.resolve({ data: mockFooter, error: null })
                return Promise.resolve({ data: null, error: null })
              }),
              order: vi.fn().mockImplementation(() => {
                if (table === 'skill') return Promise.resolve({ data: mockSkill, error: null })
                if (table === 'experience') return Promise.resolve({ data: mockExperience, error: null })
                if (table === 'project') return Promise.resolve({ data: mockProject, error: null })
                if (table === 'education') return Promise.resolve({ data: mockEducation, error: null })
                if (table === 'etc') return Promise.resolve({ data: mockEtc, error: null })
                return Promise.resolve({ data: [], error: null })
              })
            })
          }
        })
      } as any

      const { data, source, fetchData } = useResumeData({
        client: mockClient
      })

      await fetchData()

      expect(data.value.profile.name).toBe('홍길동')
      expect(data.value.introduce.contents).toEqual(['안녕하세요. 원격 소개글입니다.'])
      expect(data.value.skill.categories[0].category).toBe('Frontend')
      expect(data.value.experience.list[0].company).toBe('원격 테크')
      expect(data.value.project.list[0].title).toBe('원격 프로젝트')
      expect(data.value.education.list[0].institution).toBe('원격 대학교')
      expect(data.value.etc.certifications[0].name).toBe('정보처리기사')
      expect(data.value.footer.sign).toBe('홍길동')
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
  })
})


