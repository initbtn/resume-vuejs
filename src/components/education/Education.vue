<script setup lang="ts">
import CommonSection from '../common/CommonSection.vue'
import CommonRow from '../common/CommonRow.vue'
import type { IEducation } from '../../payload/types'

defineProps<{
  educationPayload: IEducation
}>()
</script>

<template>
  <CommonSection title="EDUCATION">
    <div class="space-y-6">
      <CommonRow v-for="(edu, idx) in educationPayload.list" :key="idx" :index="idx">
        <template #left>
          <h4 class="text-base font-semibold text-gray-500">{{ edu.period }}</h4>
        </template>
        <template #right>
          <h4 class="text-base font-bold text-gray-900">{{ edu.institution }}</h4>
          <p class="text-sm text-gray-600 mt-0.5">{{ edu.course }}</p>
        </template>
      </CommonRow>
    </div>
  </CommonSection>
</template>
