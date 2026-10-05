import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

const authState = vi.hoisted(() => ({ authenticated: false }))

vi.mock('../src/composables/useAuth', async () => {
  const { ref } = await import('vue')
  return {
    useAuth: () => ({
      user: ref(authState.authenticated ? { email: 'admin@example.com' } : null),
      isAuthenticated: ref(authState.authenticated),
      loading: ref(false),
      error: ref(null),
      signIn: vi.fn(),
      signOut: vi.fn()
    })
  }
})

import App from '../src/App.vue'

describe('App — PDF 출력 버튼 문구·위치와 섹션 순서 (Issue #36)', () => {
  beforeEach(() => {
    authState.authenticated = false
  })

  it('인쇄 버튼 글자는 정확히 「PDF 출력」이고 title 은 「A4 PDF 출력」이다', () => {
    const wrapper = mount(App)
    const btn = wrapper.find('[data-testid="print-button"]')
    expect(btn.exists()).toBe(true)
    expect(btn.text()).toBe('PDF 출력')
    expect(btn.attributes('title')).toBe('A4 PDF 출력')
    expect(wrapper.text()).not.toContain('저장 / 인쇄')
  })

  it('인쇄 버튼은 관리자 버튼과 같은 우하단 컨테이너 안에서 관리자 버튼보다 위(앞)에 있다', () => {
    const wrapper = mount(App)
    const box = wrapper.find('[data-testid="floating-actions"]')
    expect(box.exists()).toBe(true)
    expect(box.classes()).toEqual(expect.arrayContaining(['fixed', 'bottom-6', 'right-6', 'flex', 'flex-col']))
    expect(box.classes()).not.toContain('left-6')

    const print = box.find('[data-testid="print-button"]')
    const admin = box.find('[data-testid="admin-login-button"]')
    expect(print.exists()).toBe(true)
    expect(admin.exists()).toBe(true)
    // print 이 admin 보다 문서상 앞(= flex-col 에서 위)
    expect(print.element.compareDocumentPosition(admin.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('관리자 버튼이 없는 인증 상태에서도 인쇄 버튼은 같은 우하단 컨테이너에 남는다', () => {
    authState.authenticated = true
    const wrapper = mount(App)
    expect(wrapper.find('[data-testid="admin-top-bar"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="admin-login-button"]').exists()).toBe(false)

    const box = wrapper.find('[data-testid="floating-actions"]')
    expect(box.exists()).toBe(true)
    expect(box.find('[data-testid="print-button"]').exists()).toBe(true)
  })

  it('섹션 렌더 순서는 INTRODUCE → CERTIFICATION → SKILL → EXPERIENCE → PROJECT → EDUCATION 이다', () => {
    const wrapper = mount(App)
    const titles = wrapper.findAll('section h2').map((h) => h.text())
    expect(titles).toEqual(['INTRODUCE', 'CERTIFICATION', 'SKILL', 'EXPERIENCE', 'PROJECT', 'EDUCATION'])
  })
})
