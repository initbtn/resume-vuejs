import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HighlightCards from '../src/components/highlight/HighlightCards.vue'

describe('HighlightCards — 핵심 역량 3단 카드 그리드', () => {
  it('card-grid-3 컨테이너와 3개의 highlight-card를 렌더링한다', () => {
    const wrapper = mount(HighlightCards)
    const grid = wrapper.find('[data-testid="highlight-card-grid"]')
    expect(grid.exists()).toBe(true)

    const cards = wrapper.findAll('[data-testid="highlight-card"]')
    expect(cards.length).toBe(3)
  })

  it('각 카드에 제목, 설명, 키워드 태그들이 렌더링된다', () => {
    const wrapper = mount(HighlightCards)
    const firstCard = wrapper.find('[data-testid="highlight-card"]')
    expect(firstCard.find('.highlight-title').exists()).toBe(true)
    expect(firstCard.find('.highlight-description').exists()).toBe(true)
    expect(firstCard.findAll('.highlight-keywords span').length).toBeGreaterThan(0)
  })
})
