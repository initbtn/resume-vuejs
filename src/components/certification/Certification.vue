<script setup lang="ts">
import CommonSection from '../common/CommonSection.vue'
import CommonRow from '../common/CommonRow.vue'
import type { IEtc } from '../../payload/types'

defineProps<{
  etcPayload: IEtc
}>()
</script>

<template>
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
</template>
