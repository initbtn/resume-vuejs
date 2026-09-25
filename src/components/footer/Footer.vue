<script setup>
defineProps({
  payload: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <footer class="mt-16 pt-8 pb-12 border-t border-gray-200 text-center text-xs text-gray-500">
    <p class="font-serif italic text-sm text-gray-400 mb-1">{{ payload.sign }}</p>
    <p>
      © {{ payload.since }} {{ payload.sign }}. Ported to Vue 3 & Vite from
      <a :href="payload.originalRepo" target="_blank" rel="noreferrer" class="underline text-blue-500">resume-nextjs</a>.
    </p>
  </footer>
</template>
