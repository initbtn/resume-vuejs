import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '../src/composables/useTheme'

describe('useTheme Composable (Issue #77)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.restoreAllMocks()
  })

  it('기본 시스템 설정(light)일 때 theme은 light이고 html에 dark 클래스가 없다', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    const { theme, isDark, initTheme } = useTheme()
    initTheme()

    expect(theme.value).toBe('light')
    expect(isDark.value).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('시스템 prefers-color-scheme이 dark일 때 초기 테마는 dark로 설정된다', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    const { theme, isDark, initTheme } = useTheme()
    initTheme()

    expect(theme.value).toBe('dark')
    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('localStorage에 저장된 값이 있으면 시스템 설정보다 우선한다', () => {
    localStorage.setItem('resume_theme', 'dark')
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false, // system is light
      media: query
    }))

    const { theme, isDark, initTheme } = useTheme()
    initTheme()

    expect(theme.value).toBe('dark')
    expect(isDark.value).toBe(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('toggleTheme 호출 시 테마가 light <-> dark 로 토글되고 localStorage 및 html 클래스에 반영된다', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({ matches: false }))
    const { theme, isDark, toggleTheme, initTheme } = useTheme()
    initTheme()

    expect(theme.value).toBe('light')

    toggleTheme()
    expect(theme.value).toBe('dark')
    expect(isDark.value).toBe(true)
    expect(localStorage.getItem('resume_theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    toggleTheme()
    expect(theme.value).toBe('light')
    expect(isDark.value).toBe(false)
    expect(localStorage.getItem('resume_theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
