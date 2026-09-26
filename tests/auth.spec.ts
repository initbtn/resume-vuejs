import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useAuth } from '../src/composables/useAuth'
import LoginModal from '../src/components/admin/LoginModal.vue'
import App from '../src/App.vue'

describe('Admin Authentication & Routing (Issue #15)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe('useAuth Composable', () => {
    it('초기 상태에서는 인증되지 않은(unauthenticated) 상태여야 한다', () => {
      const { user, session, isAuthenticated, loading, error } = useAuth({ client: null })

      expect(user.value).toBeNull()
      expect(session.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('정상값: 올바른 자격증명으로 signIn 시 세션 및 사용자 정보가 갱신되어야 한다', async () => {
      const mockUser = {
        id: 'usr-12345',
        email: 'admin@example.com',
        role: 'authenticated'
      }
      const mockSession = {
        access_token: 'valid-jwt-token-xyz',
        token_type: 'bearer',
        user: mockUser
      }

      const mockClient = {
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
          onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
          signInWithPassword: vi.fn().mockResolvedValue({
            data: { user: mockUser, session: mockSession },
            error: null
          }),
          signOut: vi.fn().mockResolvedValue({ error: null })
        }
      } as any

      const { user, session, isAuthenticated, signIn, error } = useAuth({ client: mockClient })

      const result = await signIn('admin@example.com', 'correct-password')

      expect(result.success).toBe(true)
      expect(user.value?.email).toBe('admin@example.com')
      expect(user.value?.id).toBe('usr-12345')
      expect(session.value?.access_token).toBe('valid-jwt-token-xyz')
      expect(isAuthenticated.value).toBe(true)
      expect(error.value).toBeNull()
    })

    it('완전히 틀린 값: 잘못된 자격증명으로 signIn 시 에러가 기록되고 세션이 없어야 한다', async () => {
      const authError = {
        message: 'Invalid login credentials',
        status: 400
      }

      const mockClient = {
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
          onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
          signInWithPassword: vi.fn().mockResolvedValue({
            data: { user: null, session: null },
            error: authError
          }),
          signOut: vi.fn().mockResolvedValue({ error: null })
        }
      } as any

      const { user, session, isAuthenticated, signIn, error } = useAuth({ client: mockClient })

      const result = await signIn('admin@example.com', 'wrong-password')

      expect(result.success).toBe(false)
      expect(result.error?.message).toBe('Invalid login credentials')
      expect(user.value).toBeNull()
      expect(session.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
      expect(error.value?.message).toBe('Invalid login credentials')
    })

    it('일부만 맞는 값: 빈 이메일 또는 비밀번호 전달 시 조기 거부되어야 한다', async () => {
      const mockClient = {
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
          onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
          signInWithPassword: vi.fn(),
          signOut: vi.fn()
        }
      } as any

      const { signIn, error } = useAuth({ client: mockClient })

      const result = await signIn('', 'some-password')

      expect(result.success).toBe(false)
      expect(error.value?.message).toContain('이메일과 비밀번호를 모두 입력해주세요')
      expect(mockClient.auth.signInWithPassword).not.toHaveBeenCalled()
    })

    it('맞지만 헷갈리는 값: signOut 호출 시 인증 상태가 완전히 초기화되어야 한다', async () => {
      const mockUser = { id: 'usr-1', email: 'admin@example.com' }
      const mockSession = { access_token: 'token-1', user: mockUser }

      const mockClient = {
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: mockSession }, error: null }),
          onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
          signInWithPassword: vi.fn(),
          signOut: vi.fn().mockResolvedValue({ error: null })
        }
      } as any

      const { user, session, isAuthenticated, signOut, initialize } = useAuth({ client: mockClient })

      await initialize()
      expect(isAuthenticated.value).toBe(true)

      await signOut()

      expect(user.value).toBeNull()
      expect(session.value).toBeNull()
      expect(isAuthenticated.value).toBe(false)
      expect(mockClient.auth.signOut).toHaveBeenCalled()
    })
  })

  describe('LoginModal Component', () => {
    it('isOpen이 true일 때 모달 다이얼로그 및 입력 폼이 렌더링되어야 한다', async () => {
      const wrapper = mount(LoginModal, {
        props: {
          isOpen: true
        }
      })

      expect(wrapper.find('[data-testid="login-modal"]').exists()).toBe(true)
      expect(wrapper.find('input[type="email"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').text()).toContain('로그인')
    })

    it('isOpen이 false일 때는 모달 다이얼로그가 표시되지 않아야 한다', () => {
      const wrapper = mount(LoginModal, {
        props: {
          isOpen: false
        }
      })

      expect(wrapper.find('[data-testid="login-modal"]').exists()).toBe(false)
    })

    it('폼 제출 시 submit 이벤트 및 입력된 이메일/비밀번호 페이로드가 emit되어야 한다', async () => {
      const wrapper = mount(LoginModal, {
        props: {
          isOpen: true,
          loading: false,
          errorMessage: null
        }
      })

      await wrapper.find('input[type="email"]').setValue('admin@example.com')
      await wrapper.find('input[type="password"]').setValue('my-secret-pw')
      await wrapper.find('form').trigger('submit.prevent')

      expect(wrapper.emitted('submit')).toBeTruthy()
      expect(wrapper.emitted('submit')![0]).toEqual([
        { email: 'admin@example.com', password: 'my-secret-pw' }
      ])
    })

    it('errorMessage prop이 전달되면 에러 메시지가 렌더링되어야 한다', () => {
      const wrapper = mount(LoginModal, {
        props: {
          isOpen: true,
          loading: false,
          errorMessage: '자격증명이 일치하지 않습니다.'
        }
      })

      const errorEl = wrapper.find('[data-testid="login-error"]')
      expect(errorEl.exists()).toBe(true)
      expect(errorEl.text()).toContain('자격증명이 일치하지 않습니다.')
    })

    it('닫기 버튼 클릭 시 close 이벤트가 emit되어야 한다', async () => {
      const wrapper = mount(LoginModal, {
        props: {
          isOpen: true
        }
      })

      const closeBtn = wrapper.find('[data-testid="modal-close-button"]')
      expect(closeBtn.exists()).toBe(true)
      await closeBtn.trigger('click')

      expect(wrapper.emitted('close')).toBeTruthy()
    })
  })

  describe('App Integration & Admin Flow (DoD 1 & DoD 3)', () => {
    it('초기 미인증 상태에서 관리자 로그인 버튼이 노출되고 클릭 시 모달이 열려야 한다', async () => {
      const wrapper = mount(App)

      const loginBtn = wrapper.find('[data-testid="admin-login-button"]')
      expect(loginBtn.exists()).toBe(true)
      expect(wrapper.find('[data-testid="admin-top-bar"]').exists()).toBe(false)

      // 클릭 시 모달 오픈
      await loginBtn.trigger('click')
      expect(wrapper.find('[data-testid="login-modal"]').exists()).toBe(true)

      // 취소/닫기 클릭 시 모달 닫힘
      const closeBtn = wrapper.find('[data-testid="modal-close-button"]')
      await closeBtn.trigger('click')
      expect(wrapper.find('[data-testid="login-modal"]').exists()).toBe(false)
    })
  })
})
