<script setup lang="ts">
export interface HighlightCard {
  title: string
  description: string
  keywords: string[]
}

defineProps<{
  cards?: HighlightCard[]
}>()
</script>

<template>
  <div v-if="cards && cards.length > 0" class="editorial-section my-8" data-testid="highlight-card-grid">
    <div class="card-grid-3">
      <div
        v-for="card in cards"
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
        <div class="highlight-keywords flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-gray-100">
          <span
            v-for="kw in card.keywords"
            :key="kw"
            class="tag tag--accent px-2 py-0.5 text-xs font-medium rounded bg-blue-50 text-blue-700 border border-blue-100"
          >
            {{ kw }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
