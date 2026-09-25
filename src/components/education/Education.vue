<script setup lang="ts">
import CommonSection from '../common/CommonSection.vue'
import CommonRow from '../common/CommonRow.vue'
import type { IEducation, IEtc } from '../../payload/types'

defineProps<{
  educationPayload: IEducation
  etcPayload: IEtc
}>()
</script>

<template>
  <div class="space-y-12">
    <!-- Education Section -->
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

    <!-- Certification / Etc Section -->
    <CommonSection title="CERTIFICATION">
      <div class="space-y-4">
        <CommonRow v-for="(cert, idx) in etcPayload.certifications" :key="idx" :index="idx">
          <template #left>
            <span class="text-sm font-semibold text-gray-500">{{ cert.date }}</span>
          </template>
          <template #right>
            <div class="flex items-baseline gap-2">
              <h4 class="text-sm font-bold text-gray-900">{{ cert.name }}</h4>
              <span class="text-xs text-gray-500">({{ cert.issuer }})</span>
            </div>
          </template>
        </CommonRow>
      </div>
    </CommonSection>
  </div>
</template>
