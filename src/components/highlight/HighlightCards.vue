<script setup lang="ts">
export interface HighlightCard {
  title: string
  description: string
  keywords: string[]
}

const defaultCards: HighlightCard[] = [
  {
    title: 'Startup to Enterprise',
    description: '5인 스타트업부터 대기업까지, 다양한 규모의 조직에서 성장한 풀스택 커리어',
    keywords: ['Adaptability', 'Growth', 'Leadership'],
  },
  {
    title: 'Product-Driven Architecture',
    description: '비즈니스 요구사항 구체화부터 대규모 시스템 설계, 성능 최적화, 성과 측정까지 전 과정을 주도',
    keywords: ['System Design', 'Optimization', 'Business Impact'],
  },
  {
    title: 'Knowledge Sharing',
    description: '400여 개 기술 포스트, 다수의 외부 발표와 멘토링으로 개발 커뮤니티에 꾸준히 기여',
    keywords: ['Blog', 'Mentoring', 'Open Source'],
  },
]

defineProps<{
  cards?: HighlightCard[]
}>()
</script>

<template>
  <div class="editorial-section my-8" data-testid="highlight-card-grid">
    <div class="card-grid-3">
      <div
        v-for="card in (cards || defaultCards)"
        :key="card.title"
        class="highlight-card bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        data-testid="highlight-card"
      >
        <div>
          <h3 class="highlight-title text-base font-semibold text-gray-900 mb-2">
            {{ card.title }}
          </h3>
          <p class="highlight-description text-sm text-gray-600 mb-4 leading-relaxed">
            {{ card.description }}
          </p>
        </div>
        <div class="highlight-keywords flex flex-wrap gap-1.5">
          <span
            v-for="tag in card.keywords"
            :key="tag"
            class="tag tag--accent px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-100"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
