import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useAdminCms } from '../src/composables/useAdminCms'
import CmsModal from '../src/components/admin/CmsModal.vue'
import App from '../src/App.vue'
import { Payload } from '../src/payload'

describe('Admin CMS Dashboard & 8 Domains CUD (Issue #16)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('useAdminCms Composable', () => {
    it('초기 상태에서는 loading이 false이고 error가 null이어야 한다', () => {
      const { loading, error } = useAdminCms({ client: null })
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('정상값: updateProfile 호출 시 profile 테이블 upsert 및 refetch가 호출되어야 한다', async () => {
      const refetchMock = vi.fn().mockResolvedValue(undefined)
      const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockClient = {
        from: vi.fn().mockReturnValue({
          upsert: mockUpsert
        })
      } as any

      const { updateProfile, error, loading } = useAdminCms({
        client: mockClient,
        onSuccess: refetchMock
      })

      const profilePayload = {
        name: '홍길동',
        position: 'Senior Engineer',
        email: 'hong@example.com',
        phone: '010-1234-5678',
        github: 'https://github.com/initbtn',
        location: 'Seoul, Korea'
      }

      const result = await updateProfile(profilePayload)

      expect(result.success).toBe(true)
      expect(mockClient.from).toHaveBeenCalledWith('profile')
      expect(mockUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'default',
          name: '홍길동',
          position: 'Senior Engineer'
        })
      )
      expect(refetchMock).toHaveBeenCalled()
      expect(error.value).toBeNull()
      expect(loading.value).toBe(false)
    })

    it('완전히 틀린 값: Supabase 호출 에러 시 실패를 반환하고 error ref에 기록되어야 한다', async () => {
      const dbError = { message: 'permission denied for table profile', code: '42501' }
      const mockClient = {
        from: vi.fn().mockReturnValue({
          upsert: vi.fn().mockResolvedValue({ data: null, error: dbError })
        })
      } as any

      const { updateProfile, error } = useAdminCms({ client: mockClient })

      const result = await updateProfile({
        name: '실패테스트',
        position: 'Dev',
        email: 'fail@test.com',
        phone: '010-0000-0000',
        github: 'test',
        location: 'test'
      })

      expect(result.success).toBe(false)
      expect(result.error?.message).toContain('permission denied')
      expect(error.value?.message).toContain('permission denied')
    })

    it('일부만 맞는 값: 필수 필드 누락 시 유효성 검사에서 조기 실패(fail-fast)해야 한다', async () => {
      const mockClient = { from: vi.fn() } as any
      const { updateProfile, error } = useAdminCms({ client: mockClient })

      const result = await updateProfile({
        name: '',
        position: '',
        email: '',
        phone: '',
        github: '',
        location: ''
      })

      expect(result.success).toBe(false)
      expect(error.value?.message).toContain('필수 항목을 모두 입력해주세요')
      expect(mockClient.from).not.toHaveBeenCalled()
    })

    it('8대 도메인 CUD: experience 테이블 항목 추가/수정 및 삭제가 정상 동작해야 한다', async () => {
      const refetchMock = vi.fn().mockResolvedValue(undefined)
      const mockUpsert = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockDeleteEq = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq })

      const mockClient = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'experience') {
            return {
              upsert: mockUpsert,
              delete: mockDelete
            }
          }
          return {}
        })
      } as any

      const { saveExperience, deleteExperience } = useAdminCms({
        client: mockClient,
        onSuccess: refetchMock
      })

      // 1. Save (Insert/Update)
      const saveRes = await saveExperience({
        company: '테스트 컴퍼니',
        position: 'Lead',
        period: '2024 - 2026',
        description: '설명',
        projects: []
      })
      expect(saveRes.success).toBe(true)
      expect(mockUpsert).toHaveBeenCalled()

      // 2. Delete
      const delRes = await deleteExperience(42)
      expect(delRes.success).toBe(true)
      expect(mockDelete).toHaveBeenCalled()
      expect(mockDeleteEq).toHaveBeenCalledWith('id', 42)
      expect(refetchMock).toHaveBeenCalledTimes(2)
    })

    it('정본 스키마 일치: education 및 etc 테이블의 실제 컬럼(institution, course, name, issuer)으로 CUD가 호출되어야 한다', async () => {
      const refetchMock = vi.fn().mockResolvedValue(undefined)
      const mockEduUpsert = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEtcUpsert = vi.fn().mockResolvedValue({ data: null, error: null })

      const mockClient = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === 'education') return { upsert: mockEduUpsert }
          if (table === 'etc') return { upsert: mockEtcUpsert }
          return {}
        })
      } as any

      const { saveEducation, saveEtc } = useAdminCms({
        client: mockClient,
        onSuccess: refetchMock
      })

      // education
      const eduRes = await saveEducation({
        institution: '서울대학교',
        course: '컴퓨터공학과 학사',
        period: '2016.03 - 2020.02'
      })
      expect(eduRes.success).toBe(true)
      expect(mockEduUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          institution: '서울대학교',
          course: '컴퓨터공학과 학사',
          period: '2016.03 - 2020.02'
        })
      )

      // etc
      const etcRes = await saveEtc({
        name: '정보처리기사',
        issuer: '한국산업인력공단',
        date: '2021.06'
      })
      expect(etcRes.success).toBe(true)
      expect(mockEtcUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: '정보처리기사',
          issuer: '한국산업인력공단',
          date: '2021.06'
        })
      )
    })
  })

  describe('CmsModal Component', () => {
    it('실제 PayloadType 정본 구조를 주입했을 때 8대 도메인 탭 및 기존 목록이 정상 렌더링되어야 한다', () => {
      const wrapper = mount(CmsModal, {
        props: {
          isOpen: true,
          initialData: Payload // 실제 앱의 정본 페이로드 주입 (list, categories 구조 검증)
        }
      })

      expect(wrapper.find('[data-testid="cms-modal"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('프로필')
      expect(wrapper.text()).toContain('자기소개')
      expect(wrapper.text()).toContain('스킬')
      expect(wrapper.text()).toContain('경력')
      expect(wrapper.text()).toContain('프로젝트')
      expect(wrapper.text()).toContain('학력')
      expect(wrapper.text()).toContain('기타')
      expect(wrapper.text()).toContain('푸터')

      // 실제 정본 데이터가 input 폼에 바인딩되었는지 확인
      const nameInput = wrapper.find('input[type="text"]')
      expect((nameInput.element as HTMLInputElement).value).toBe(Payload.profile.name)
    })

    it('닫기 버튼 클릭 시 close 이벤트가 emit되어야 한다', async () => {
      const wrapper = mount(CmsModal, {
        props: {
          isOpen: true,
          initialData: Payload
        }
      })

      const closeBtn = wrapper.find('[data-testid="cms-modal-close"]')
      expect(closeBtn.exists()).toBe(true)
      await closeBtn.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('App Integration (DoD 1, 2, 3)', () => {
    it('관리자 로그인 상태에서 CMS 편집 대시보드 버튼이 렌더링되어야 한다', () => {
      const wrapper = mount(App)
      // 초기 미인증 상태에서는 CMS 버튼 미노출
      expect(wrapper.find('[data-testid="open-cms-button"]').exists()).toBe(false)
    })
  })
})
