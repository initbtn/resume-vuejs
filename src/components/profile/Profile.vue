<script setup lang="ts">
import type { IProfile } from '../../payload/types'

defineProps<{
  payload: IProfile
}>()
</script>

<template>
  <div class="profile-section pb-6 mb-8 border-b border-gray-200" data-testid="profile-section">
    <div
      class="profile-identity flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8"
      data-testid="profile-identity"
    >
      <!-- Profile Photo -->
      <div class="profile-image-wrap shrink-0">
        <picture>
          <source srcset="/profile.webp" type="image/webp" />
          <img
            src="/profile-opt.jpg"
            alt="프로필 사진"
            class="profile-image w-32 h-32 md:w-36 md:h-36 rounded-full object-cover object-top shadow-md border-2 border-gray-100"
          />
        </picture>
      </div>

      <!-- Identity Text -->
      <div class="profile-identity-text flex-1 min-w-0 text-center md:text-left">
        <h1 class="profile-name text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
          {{ payload.name }}
        </h1>
        <p v-if="payload.position" class="profile-tagline text-base md:text-lg font-medium text-blue-600 mt-1 mb-4">
          {{ payload.position }}
        </p>

        <!-- Contacts -->
        <div class="profile-contacts flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2 text-sm text-gray-600">
          <div v-if="payload.email" class="profile-contact-item flex items-center gap-1.5">
            <span class="font-semibold text-gray-400">Email:</span>
            <a :href="'mailto:' + payload.email" class="hover:underline text-gray-700 hover:text-blue-600 break-all">
              {{ payload.email }}
            </a>
          </div>
          <div v-if="payload.phone" class="profile-contact-item flex items-center gap-1.5">
            <span class="font-semibold text-gray-400">Phone:</span>
            <span class="text-gray-700">{{ payload.phone }}</span>
          </div>
          <div v-if="payload.github" class="profile-contact-item flex items-center gap-1.5">
            <span class="font-semibold text-gray-400">GitHub:</span>
            <a :href="payload.github" target="_blank" rel="noreferrer" class="hover:underline text-blue-600 break-all">
              {{ payload.github }}
            </a>
          </div>
          <div v-if="payload.location" class="profile-contact-item flex items-center gap-1.5">
            <span class="font-semibold text-gray-400">Location:</span>
            <span class="text-gray-700">{{ payload.location }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
