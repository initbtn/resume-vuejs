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

  it('should have accurate 2026 project schedules and planned status for marine GIS platform', () => {
    const projects = Payload.project.list

    // 프로젝트 기간에 2024년 오표기가 없어야 함
    const has2024 = projects.some((p) => p.period.includes('2024'))
    expect(has2024).toBe(false)

    // resume-vuejs 프로젝트는 2026년 진행 중이어야 함
    const resumeVue = projects.find((p) => p.title.includes('resume-vuejs'))
    expect(resumeVue).toBeDefined()
    expect(resumeVue?.period).toContain('2026')
    expect(resumeVue?.period).toContain('현재')

    // 해양 관제 플랫폼은 2026년 주제선정/기획 상태여야 함
    const marineGis = projects.find((p) => p.title.includes('해양 친환경 설비'))
    expect(marineGis).toBeDefined()
    expect(marineGis?.period).toContain('2026')
    expect(marineGis?.period).toMatch(/주제선정|기획/)
    expect(marineGis?.description).toMatch(/주제선정|기획/)
  })
})
