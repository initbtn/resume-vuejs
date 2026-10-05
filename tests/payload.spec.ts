import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
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

  it('should list resume-vuejs and busan-youth-day projects in 2026 (marine GIS removed)', () => {
    const projects = Payload.project.list

    expect(projects.some((p) => p.period.includes('2024'))).toBe(false)

    const resumeVue = projects.find((p) => p.title.includes('resume-vuejs'))
    expect(resumeVue).toBeDefined()
    expect(resumeVue?.period).toContain('2026')
    expect(resumeVue?.period).toContain('현재')

    expect(projects.some((p) => p.title.includes('해양 친환경 설비'))).toBe(false)

    const byd = projects.find((p) => p.title.includes('busan-youth-day'))
    expect(byd).toBeDefined()
    expect(byd?.period).toContain('2026.09')
    expect(byd?.link).toBe('https://github.com/initbtn/busan-youth-day')
  })

  const EXPECTED_SKILL = [
    { category: 'Front-end', items: ['React.js', 'JavaScript (ES6+)', 'HTML5/CSS3', 'TailwindCSS'] },
    { category: 'Back-end', items: ['Node.js', 'Express', 'NestJS', 'Docker', 'Nginx', 'MySQL', 'Sequelize ORM'] },
    { category: 'Infra', items: ['AWS', 'Akamai Linode', 'Terraform', 'Ansible', 'Makefile', 'Cloudflare'] },
    {
      category: 'Domain Knowledge',
      items: [
        '결제/인증/보험 Open API 연동',
        '조선해양 도메인',
        '가스일반제조시설 안전관리(업무용대형연소기 제조시설 안전관리)'
      ]
    }
  ]

  it('should expose the 4 skill categories in order with exact items (Issue #31)', () => {
    expect(
      Payload.skill.categories.map((c) => ({ category: c.category, items: c.items }))
    ).toEqual(EXPECTED_SKILL)
  })

  it('should not keep removed template/legacy skill items or old category names (Issue #31)', () => {
    const names = Payload.skill.categories.map((c) => c.category)
    const items = Payload.skill.categories.flatMap((c) => c.items)
    for (const removed of ['Vue.js 3', 'Axios', 'Chart.js / ECharts', 'RESTful API', 'Git / GitHub', 'Loki / Promtail', '제로트러스트 보안 체계']) {
      expect(items).not.toContain(removed)
    }
    expect(names).not.toContain('Back-end & Cloud')
    expect(names).not.toContain('Database & DevOps')
  })

  it('should keep supabase/seed.sql skill rows identical to the payload skill (Issue #31)', () => {
    const seed = readFileSync(resolve(__dirname, '../supabase/seed.sql'), 'utf8')
    const block = seed.slice(seed.indexOf('INSERT INTO public.skill'), seed.indexOf('-- 4. Experience'))
    EXPECTED_SKILL.forEach((c, i) => {
      const row = `('${c.category}', ARRAY[${c.items.map((x) => `'${x}'`).join(', ')}], ${i + 1})`
      expect(block).toContain(row)
    })
    expect((block.match(/^\('/gm) ?? []).length).toBe(EXPECTED_SKILL.length)
  })

  it('should expose highlight cards payload', () => {
    expect(Payload.highlight.list.length).toBe(3)
  })
})
