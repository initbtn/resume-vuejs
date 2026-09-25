import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommonRow from '../src/components/common/CommonRow.vue'

describe('CommonRow Component', () => {
  it('does not render hr divider when index is 0', () => {
    const wrapper = mount(CommonRow, {
      props: { index: 0 },
      slots: {
        left: '<div class="left-content">Left</div>',
        right: '<div class="right-content">Right</div>'
      }
    })

    expect(wrapper.find('hr').exists()).toBe(false)
    expect(wrapper.find('.left-content').text()).toBe('Left')
    expect(wrapper.find('.right-content').text()).toBe('Right')
  })

  it('renders hr divider when index is greater than 0', () => {
    const wrapper = mount(CommonRow, {
      props: { index: 1 },
      slots: {
        left: '<span>Col Left</span>',
        right: '<span>Col Right</span>'
      }
    })

    expect(wrapper.find('hr').exists()).toBe(true)
    expect(wrapper.find('hr').classes()).toContain('border-gray-200')
    expect(wrapper.text()).toContain('Col Left')
    expect(wrapper.text()).toContain('Col Right')
  })

  it('uses default index of 0 when not provided', () => {
    const wrapper = mount(CommonRow)
    expect(wrapper.find('hr').exists()).toBe(false)
  })
})
