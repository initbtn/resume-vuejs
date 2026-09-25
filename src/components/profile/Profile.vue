<script setup>
defineProps({
  payload: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <header class="pt-6 pb-8 border-b border-gray-200">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">{{ payload.name }}</h1>
        <p class="text-xl font-normal text-[#3c78d8] mt-1">{{ payload.position }}</p>
      </div>
      <div class="text-sm text-gray-600 space-y-1 text-left md:text-right">
        <div><span class="font-medium text-gray-400">Email:</span> <a :href="'mailto:' + payload.email" class="hover:underline text-gray-700">{{ payload.email }}</a></div>
        <div><span class="font-medium text-gray-400">Phone:</span> {{ payload.phone }}</div>
        <div><span class="font-medium text-gray-400">GitHub:</span> <a :href="payload.github" target="_blank" rel="noreferrer" class="hover:underline text-blue-600">{{ payload.github }}</a></div>
        <div><span class="font-medium text-gray-400">Location:</span> {{ payload.location }}</div>
      </div>
    </div>
  </header>
</template>
