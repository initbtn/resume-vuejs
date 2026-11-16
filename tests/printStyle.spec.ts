import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('Print Style & Admin/Print Button Hide Rules (Issue #41)', () => {
  const styleCssPath = path.resolve(__dirname, '../src/style.css')
  const appVuePath = path.resolve(__dirname, '../src/App.vue')

  const styleCss = fs.readFileSync(styleCssPath, 'utf-8')
  const appVue = fs.readFileSync(appVuePath, 'utf-8')

  // 인쇄 시 숨겨야 하는 대상 5대 testid
  const TARGET_TEST_IDS = [
    'admin-top-bar',
    'admin-login-button',
    'open-cms-button',
    'admin-logout-button',
    'print-button'
  ] as const

  it('@media print 블록이 숨김 대상 5개 data-testid 를 모두 display: none 으로 지정한다', () => {
    // @media print 블록 추출
    const printMediaMatch = styleCss.match(/@media\s+print\s*\{([\s\S]*?)\n\}/)
    expect(printMediaMatch, 'src/style.css 에 @media print 블록이 존재해야 합니다').toBeTruthy()

    const printBlock = printMediaMatch![1]

    for (const testId of TARGET_TEST_IDS) {
      // [data-testid="..."] 셀렉터가 포함되어 있는지 검증
      const selectorRegex = new RegExp(`\\[data-testid=["']${testId}["']\\]`)
      expect(
        selectorRegex.test(printBlock),
        `@media print 블록 내에 [data-testid="${testId}"] 셀렉터가 포함되어야 합니다`
      ).toBe(true)
    }

    // 대상 셀렉터들이 display: none !important 규칙과 연결되어 있는지 검증
    // 1) 4개 관리자 UI 묶음
    const adminGroupRegex = /\[data-testid="admin-top-bar"\][\s\S]*?\[data-testid="admin-login-button"\][\s\S]*?\[data-testid="open-cms-button"\][\s\S]*?\[data-testid="admin-logout-button"\]\s*\{\s*display:\s*none\s*!important;\s*\}/
    expect(adminGroupRegex.test(printBlock)).toBe(true)

    // 2) 인쇄 버튼 단독
    const printButtonRegex = /\[data-testid="print-button"\]\s*\{\s*display:\s*none\s*!important;\s*\}/
    expect(printButtonRegex.test(printBlock)).toBe(true)
  })

  it('숨김 대상 data-testid 5개가 src/App.vue 에 실제로 존재한다 (이름 변경/삭제 방지)', () => {
    for (const testId of TARGET_TEST_IDS) {
      const appAttrRegex = new RegExp(`data-testid=["']${testId}["']`)
      expect(
        appAttrRegex.test(appVue),
        `src/App.vue 에 data-testid="${testId}" 요소가 실제로 존재해야 합니다`
      ).toBe(true)
    }
  })
})
