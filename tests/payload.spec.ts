import { describe, it, expect } from 'vitest'
import { Payload } from '../src/payload/index.ts'
import type { ISkill } from '../src/payload/types.ts'

describe('TDD: Payload Data & TypeScript Definition', () => {
  it('Profile 필수 필드(name, position, email, phone)가 유효해야 한다', () => {
    expect(Payload.profile.name).toBe('남성호')
    expect(Payload.profile.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(Payload.profile.phone).toBe('010-9306-2211')
  })

  it('Experience 리스트가 최소 3개 회사여야 하며 5대 KPI가 포함되어야 한다', () => {
    expect(Payload.experience.list.length).toBeGreaterThanOrEqual(3)
    const retrust = Payload.experience.list[0]
    expect(retrust.company).toBe('(주)리트러스트')
    
    // 5대 핵심 정량 KPI 검증
    const achs = retrust.projects[0].achievements
    expect(achs.some((a: string) => a.includes('0%'))).toBe(true)
    expect(achs.some((a: string) => a.includes('2,653건'))).toBe(true)
    expect(achs.some((a: string) => a.includes('95% 단축'))).toBe(true)
    expect(achs.some((a: string) => a.includes('1초 이내'))).toBe(true)
    expect(achs.some((a: string) => a.includes('15분 이내'))).toBe(true)
  })

  it('Skill 도메인이 4개 카테고리로 분류되어 있어야 한다', () => {
    expect(Payload.skill.categories.length).toBe(4)
    const names = Payload.skill.categories.map((c: ISkill.Category) => c.category)
    expect(names).toContain('Front-end')
    expect(names).toContain('Domain Knowledge')
  })
})
