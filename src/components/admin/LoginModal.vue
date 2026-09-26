<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  isOpen: boolean
  loading?: boolean
  errorMessage?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errorMessage: null
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { email: string; password: string }): void
}>()

const email = ref('')
const password = ref('')

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      email.value = ''
      password.value = ''
    }
  }
)

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('submit', {
    email: email.value,
    password: password.value
  })
}
</script>

<template>
  <div
    v-if="isOpen"
    data-testid="login-modal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
  >
    <div
      class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 id="modal-title" class="text-lg font-bold text-gray-900">
          관리자 로그인
        </h3>
        <button
          data-testid="modal-close-button"
          type="button"
          class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          aria-label="닫기"
          @click="handleClose"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form Body -->
      <form class="p-6 space-y-4" @submit.prevent="handleSubmit">
        <div v-if="errorMessage" data-testid="login-error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {{ errorMessage }}
        </div>

        <div>
          <label for="admin-email" class="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            id="admin-email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            placeholder="admin@example.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            :disabled="loading"
          />
        </div>

        <div>
          <label for="admin-password" class="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            id="admin-password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            :disabled="loading"
          />
        </div>

        <!-- Footer / Action Buttons -->
        <div class="pt-2 flex items-center justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            :disabled="loading"
            @click="handleClose"
          >
            취소
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm disabled:opacity-50"
            :disabled="loading"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span>{{ loading ? '인증 중...' : '로그인' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
