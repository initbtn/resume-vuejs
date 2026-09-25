<script setup lang="ts">
import CommonSection from '../common/CommonSection.vue'
import CommonRow from '../common/CommonRow.vue'
import type { IExperience } from '../../payload/types'

defineProps<{
  payload: IExperience
}>()
</script>

<template>
  <CommonSection title="EXPERIENCE">
    <div class="space-y-10">
      <div v-for="(career, cIdx) in payload.list" :key="cIdx">
        <hr v-if="cIdx > 0" class="my-8 border-gray-200" />

        <CommonRow>
          <template #left>
            <h4 class="text-base font-semibold text-gray-500">{{ career.period }}</h4>
          </template>
          <template #right>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h3 class="text-xl font-bold text-gray-900">{{ career.company }}</h3>
              <span v-if="career.period.includes('현재')" class="text-xs bg-blue-600 text-white font-medium px-2 py-0.5 rounded">
                재직 중
              </span>
            </div>
            <p class="text-sm font-medium text-gray-600 italic mb-1">{{ career.position }}</p>
            <p class="text-xs text-gray-500 mb-4">{{ career.description }}</p>

            <!-- Projects in Career -->
            <div class="space-y-6 mt-4">
              <div v-for="(project, pIdx) in career.projects" :key="pIdx" class="border-t border-dashed border-gray-200 pt-4">
                <div class="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2">
                  <h5 class="text-base font-bold text-gray-800">{{ project.title }}</h5>
                  <span class="text-xs text-gray-400 font-mono">{{ project.period }}</span>
                </div>
                <p class="text-xs font-semibold text-gray-700 mb-2">역할: {{ project.role }}</p>

                <ul class="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700 mb-3 leading-relaxed">
                  <li v-for="(ach, aIdx) in project.achievements" :key="aIdx">
                    {{ ach }}
                  </li>
                </ul>

                <div class="flex flex-wrap gap-1 mt-2">
                  <span class="text-xs font-bold text-gray-500 mr-1 self-center">Skill Keywords:</span>
                  <span v-for="(skill, sIdx) in project.skills" :key="sIdx" class="text-xs bg-gray-600 text-white px-2 py-0.5 rounded font-normal">
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </CommonRow>
      </div>
    </div>
  </CommonSection>
</template>
