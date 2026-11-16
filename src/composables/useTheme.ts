import { ref, computed } from 'vue'

export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'resume_theme'

// 전역 단일 상태 유지 (여러 곳에서 호출해도 동기화)
const currentTheme = ref<ThemeMode>('light')

export function useTheme() {
  const isDark = computed(() => currentTheme.value === 'dark')

  const applyThemeToDOM = (mode: ThemeMode) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }

  const initTheme = () => {
    if (typeof window === 'undefined') return

    // 1. localStorage 확인
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    if (saved === 'light' || saved === 'dark') {
      currentTheme.value = saved
      applyThemeToDOM(saved)
      return
    }

    // 2. 시스템 prefers-color-scheme 확인
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentTheme.value = 'dark'
      applyThemeToDOM('dark')
    } else {
      currentTheme.value = 'light'
      applyThemeToDOM('light')
    }
  }

  const setTheme = (mode: ThemeMode) => {
    currentTheme.value = mode
    applyThemeToDOM(mode)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    }
  }

  const toggleTheme = () => {
    setTheme(currentTheme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: currentTheme,
    isDark,
    initTheme,
    setTheme,
    toggleTheme
  }
}
