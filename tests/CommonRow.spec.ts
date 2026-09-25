import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommonRow from '../src/components/common/CommonRow.vue'

describe('TDD: CommonRow.vue Component Rendering', () => {
  it('left와 right 슬롯에 전달된 컨텐츠가 col-3 / col-9 2열 그리드로 렌더링되어야 한다', () => {
    const wrapper = mount(CommonRow, {
      props: { index: 0 },
      slots: {
        left: '<span class="test-left">2024.04 ~ 2025.03</span>',
        right: '<span class="test-right">프로젝트 성과 및 상세 내용</span>'
      }
    })

    expect(wrapper.find('.test-left').text()).toBe('2024.04 ~ 2025.03')
    expect(wrapper.find('.test-right').text()).toBe('프로젝트 성과 및 상세 내용')
  })

  it('index가 0보다 클 때만 구분선(hr)이 렌더링되어야 한다', () => {
    const row0 = mount(CommonRow, { props: { index: 0 } })
    expect(row0.find('hr').exists()).toBe(false)

    const row1 = mount(CommonRow, { props: { index: 1 } })
    expect(row1.find('hr').exists()).toBe(true)
  })
})
