/**
 * Issue #21: resume.yowu.dev 스타일/레이아웃 적용 — TDD RED
 *
 * 검증 대상:
 * 1. 레이아웃이 2-column(사이드바 + 메인) 구조를 갖는지
 * 2. CommonSection이 구분선 스타일을 포함하는지
 * 3. Skill 배지 형태 렌더링
 * 4. @media print에서 어드민 UI 요소에 display:none이 적용되는지 (CSS @media print 규칙 사용)
 */
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Payload } from '../src/payload'
import CommonSection from '../src/components/common/CommonSection.vue'

describe('CommonSection — 섹션 헤더 스타일', () => {
  it('섹션 제목에 구분선 border-b 클래스가 있다', () => {
    const wrapper = mount(CommonSection, {
      props: { title: '경력' },
    })
    const divider = wrapper.find('[data-testid="section-divider"]')
    expect(divider.exists()).toBe(true)
    expect(divider.classes()).toContain('border-b')
  })

  it('섹션 제목 텍스트가 렌더링된다', () => {
    const wrapper = mount(CommonSection, {
      props: { title: '기술' },
    })
    expect(wrapper.text()).toContain('기술')
  })
})

describe('App 레이아웃 — 2-column 구조', () => {
  it('사이드바 영역(data-testid=sidebar)이 존재한다', async () => {
    const { default: App } = await import('../src/App.vue')
    const wrapper = mount(App, {
      global: {
        stubs: {
          Profile: true,
          Introduce: true,
          Skill: true,
          Experience: true,
          Project: true,
          Education: true,
          Footer: true,
          LoginModal: true,
          CmsModal: true,
        },
      },
    })
    expect(wrapper.find('[data-testid="resume-sidebar"]').exists()).toBe(true)
  })

  it('메인 콘텐츠 영역(data-testid=resume-main)이 존재한다', async () => {
    const { default: App } = await import('../src/App.vue')
    const wrapper = mount(App, {
      global: {
        stubs: {
          Profile: true,
          Introduce: true,
          Skill: true,
          Experience: true,
          Project: true,
          Education: true,
          Footer: true,
          LoginModal: true,
          CmsModal: true,
        },
      },
    })
    expect(wrapper.find('[data-testid="resume-main"]').exists()).toBe(true)
  })
})

describe('Skill 컴포넌트 — 배지 렌더링', () => {
  it('스킬 아이템에 badge 스타일 클래스가 있다', async () => {
    const { default: Skill } = await import('../src/components/skill/Skill.vue')
    const wrapper = mount(Skill, {
      props: { payload: Payload.skill },
    })
    const badges = wrapper.findAll('[data-testid="skill-badge"]')
    expect(badges.length).toBeGreaterThan(0)
  })
})
