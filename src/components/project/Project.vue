<script setup>
import CommonSection from '../common/CommonSection.vue'
import CommonRow from '../common/CommonRow.vue'

defineProps({
  payload: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <CommonSection title="PROJECT">
    <div class="space-y-8">
      <CommonRow v-for="(proj, idx) in payload.list" :key="idx" :index="idx">
        <template #left>
          <h4 class="text-base font-semibold text-gray-500">{{ proj.period }}</h4>
        </template>
        <template #right>
          <div class="flex flex-wrap items-baseline gap-2 mb-1">
            <h3 class="text-lg font-bold text-gray-900">{{ proj.title }}</h3>
            <a v-if="proj.link" :href="proj.link" target="_blank" rel="noreferrer" class="text-xs text-blue-600 hover:underline">
              [GitHub]
            </a>
          </div>
          <p class="text-sm text-gray-600 italic mb-3">{{ proj.description }}</p>

          <ul class="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700 mb-3 leading-relaxed">
            <li v-for="(ach, aIdx) in proj.achievements" :key="aIdx">
              {{ ach }}
            </li>
          </ul>

          <div class="flex flex-wrap gap-1 mt-2">
            <span class="text-xs font-bold text-gray-500 mr-1 self-center">Skill Keywords:</span>
            <span v-for="(skill, sIdx) in proj.skills" :key="sIdx" class="text-xs bg-gray-600 text-white px-2 py-0.5 rounded font-normal">
              {{ skill }}
            </span>
          </div>
        </template>
      </CommonRow>
    </div>
  </CommonSection>
</template>
