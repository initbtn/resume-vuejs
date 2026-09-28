/**
 * Issue #24: resume.yowu.dev 실측 기반 레이아웃 구조 정정 — TDD RED
 *
 * 검증 대상:
 * 1. App 레이아웃이 840px 단일 에디토리얼 컨테이너(resume-container) 구조를 갖는지
 * 2. Profile 컴포넌트가 상단에서 가로 flex(profile-identity) 구조를 갖는지
 * 3. CommonSection이 구분선 스타일을 포함하는지
 * 4. Skill 배지 형태 렌더링
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

describe('App 레이아웃 — resume-container 단일 컬럼 구조', () => {
  it('중앙 정렬된 resume-container(data-testid=resume-container)가 존재한다', async () => {
    const { default: App } = await import('../src/App.vue')
    const wrapper = mount(App, {
      global: {
        stubs: {
          Profile: true,
          Introduce: true,
          HighlightCards: true,
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
    const container = wrapper.find('[data-testid="resume-container"]')
    expect(container.exists()).toBe(true)
    // 기존의 좌우 aside 사이드바 분할은 없어야 함
    expect(wrapper.find('[data-testid="resume-sidebar"]').exists()).toBe(false)
  })
})

describe('Profile 컴포넌트 — 상단 가로 flex 레이아웃', () => {
  it('profile-identity 영역이 존재하고 이미지와 텍스트를 flex로 포함한다', async () => {
    const { default: Profile } = await import('../src/components/profile/Profile.vue')
    const wrapper = mount(Profile, {
      props: { payload: Payload.profile },
    })
    const identity = wrapper.find('[data-testid="profile-identity"]')
    expect(identity.exists()).toBe(true)
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.text()).toContain(Payload.profile.name)
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
