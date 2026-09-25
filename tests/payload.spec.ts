import { describe, it, expect } from 'vitest'
import { Payload } from '../src/payload/index'
import type { PayloadType } from '../src/payload/types'

describe('Payload Domain Integrity & 5 Key KPIs', () => {
  it('should conform to PayloadType interface structure', () => {
    const payload: PayloadType = Payload
    expect(payload).toBeDefined()
    expect(payload.profile).toBeDefined()
    expect(payload.introduce).toBeDefined()
    expect(payload.skill).toBeDefined()
    expect(payload.experience).toBeDefined()
    expect(payload.project).toBeDefined()
    expect(payload.education).toBeDefined()
    expect(payload.etc).toBeDefined()
    expect(payload.footer).toBeDefined()
  })

  it('should contain the 5 critical quantitative KPIs in experience achievements', () => {
    const allAchievements = Payload.experience.list
      .flatMap((exp) => exp.projects ?? [])
      .flatMap((proj) => proj.achievements ?? [])

    // KPI 1: 0% duplicate payment error
    expect(allAchievements.some((a) => a.includes('0%'))).toBe(true)
    expect(allAchievements.some((a) => a.includes('중복 결제 오류 0% 달성'))).toBe(true)

    // KPI 2: 2,653 cumulative users
    expect(allAchievements.some((a) => a.includes('2,653건'))).toBe(true)
    expect(allAchievements.some((a) => a.includes('누적 가입자 2,653건 확보'))).toBe(true)

    // KPI 3: 95% reduction in CS lead time
    expect(allAchievements.some((a) => a.includes('95% 단축'))).toBe(true)
    expect(allAchievements.some((a) => a.includes('CS 처리 리드타임을 2시간에서 5분으로 95% 단축'))).toBe(true)

    // KPI 4: incident recognition within 1 second
    expect(allAchievements.some((a) => a.includes('1초 이내'))).toBe(true)
    expect(allAchievements.some((a) => a.includes('장애 인지 시간을 수십 분~수 시간에서 1초 이내(실시간)로 단축'))).toBe(true)

    // KPI 5: incident response lead time within 15 minutes
    expect(allAchievements.some((a) => a.includes('15분 이내'))).toBe(true)
    expect(allAchievements.some((a) => a.includes('장애 대응 리드타임을 평균 15분 이내로 약 80% 이상 단축'))).toBe(true)
  })
})
