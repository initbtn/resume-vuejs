<script setup>
import CommonSection from '../common/CommonSection.vue'

defineProps({
  payload: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <CommonSection title="INTRODUCE">
    <div class="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed bg-gray-50 p-5 rounded border-l-4 border-[#3c78d8]">
      <p v-for="(p, idx) in payload.contents" :key="idx">
        {{ p }}
      </p>
    </div>
  </CommonSection>
</template>
