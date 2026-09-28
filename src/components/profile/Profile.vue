<script setup lang="ts">
import type { IProfile } from '../../payload/types'

defineProps<{
  payload: IProfile
}>()
</script>

<template>
  <div class="profile-sidebar pt-6 pb-6 md:pb-0 border-b md:border-b-0 border-gray-200">
    <!-- Profile Photo -->
    <div class="mb-5">
      <picture>
        <source srcset="/profile.webp" type="image/webp" />
        <img
          src="/profile-opt.jpg"
          alt="프로필 사진"
          class="w-32 h-32 rounded-full object-cover object-top shadow-md"
        />
      </picture>
    </div>

    <!-- Name & Position -->
    <div class="mb-6">
      <h1 class="text-3xl font-extrabold tracking-tight text-gray-900 leading-tight">{{ payload.name }}</h1>
      <p class="text-base font-semibold text-[#3c78d8] mt-1">{{ payload.position }}</p>
    </div>

    <!-- Contact Info -->
    <div class="space-y-2 text-sm text-gray-600">
      <div v-if="payload.email" class="flex items-start gap-2">
        <span class="font-semibold text-gray-400 w-16 flex-shrink-0">Email</span>
        <a :href="'mailto:' + payload.email" class="hover:underline text-gray-700 break-all">{{ payload.email }}</a>
      </div>
      <div v-if="payload.phone" class="flex items-start gap-2">
        <span class="font-semibold text-gray-400 w-16 flex-shrink-0">Phone</span>
        <span class="text-gray-700">{{ payload.phone }}</span>
      </div>
      <div v-if="payload.github" class="flex items-start gap-2">
        <span class="font-semibold text-gray-400 w-16 flex-shrink-0">GitHub</span>
        <a :href="payload.github" target="_blank" rel="noreferrer" class="hover:underline text-blue-600 break-all">{{ payload.github }}</a>
      </div>
      <div v-if="payload.location" class="flex items-start gap-2">
        <span class="font-semibold text-gray-400 w-16 flex-shrink-0">Location</span>
        <span class="text-gray-700">{{ payload.location }}</span>
      </div>
    </div>
  </div>
</template>
