import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'

describe('App Integration', () => {
  it('renders all sections including PROJECT', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('INTRODUCE')
    expect(wrapper.text()).toContain('SKILL')
    expect(wrapper.text()).toContain('EXPERIENCE')
    expect(wrapper.text()).toContain('PROJECT')
    expect(wrapper.text()).toContain('EDUCATION')
    expect(wrapper.text()).toContain('CERTIFICATION')
  })
})
