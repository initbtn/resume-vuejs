<script setup lang="ts">
export interface CommonRowProps {
  index?: number
}

withDefaults(defineProps<CommonRowProps>(), {
  index: 0
})
</script>

<template>
  <div>
    <hr v-if="index > 0" class="my-6 border-gray-200" />
    <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
      <!-- Left (col-3, right-aligned on desktop) -->
      <div class="md:col-span-3 md:text-right">
        <slot name="left" />
      </div>
      <!-- Right (col-9) -->
      <div class="md:col-span-9">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
