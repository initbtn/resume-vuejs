<script setup lang="ts">
import CommonSection from '../common/CommonSection.vue'
import CommonRow from '../common/CommonRow.vue'
import type { ISkill } from '../../payload/types'

defineProps<{
  payload: ISkill
}>()
</script>

<template>
  <CommonSection title="SKILL">
    <div class="space-y-6">
      <CommonRow v-for="(cat, idx) in payload.categories" :key="idx" :index="idx">
        <template #left>
          <h4 class="text-base font-bold text-gray-700">{{ cat.category }}</h4>
        </template>
        <template #right>
          <div class="flex flex-wrap gap-1.5 items-center">
            <span
              v-for="(item, iIdx) in cat.items"
              :key="iIdx"
              class="text-xs bg-blue-50 text-[#3c78d8] border border-blue-200 px-2.5 py-1 rounded font-medium"
            >
              {{ item }}
            </span>
          </div>
        </template>
      </CommonRow>
    </div>
  </CommonSection>
</template>
