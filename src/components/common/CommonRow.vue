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
    <div
      class="split-row grid grid-cols-1 md:grid-cols-[200px_1fr] gap-2 md:gap-6"
      data-testid="split-row"
    >
      <!-- Left (200px on desktop, right-aligned) -->
      <div class="split-left md:text-right">
        <slot name="left" />
      </div>
      <!-- Right (1fr on desktop) -->
      <div class="split-right min-w-0">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
