<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<template>
  <section class="mt-12 mb-8">
    <!-- Header with #3c78d8 signature style -->
    <div class="pb-3 mb-6 border-b border-gray-200">
      <h2 class="text-2xl font-bold text-[#3c78d8] tracking-tight">
        <span>{{ title }}</span>
      </h2>
    </div>
    <!-- Slot content -->
    <div>
      <slot />
    </div>
  </section>
</template>
