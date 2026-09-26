<script setup lang="ts">
import { ref } from 'vue'
import { useResumeData } from './composables/useResumeData'
import { useAuth } from './composables/useAuth'
import Profile from './components/profile/Profile.vue'
import Introduce from './components/introduce/Introduce.vue'
import Skill from './components/skill/Skill.vue'
import Experience from './components/experience/Experience.vue'
import Project from './components/project/Project.vue'
import Education from './components/education/Education.vue'
import Footer from './components/footer/Footer.vue'
import LoginModal from './components/admin/LoginModal.vue'

const { data: resumeData } = useResumeData({ autoFetch: true })
const { user, isAuthenticated, loading: authLoading, error: authError, signIn, signOut } = useAuth()

const isLoginModalOpen = ref(false)
const loginErrorMessage = ref<string | null>(null)

const openLoginModal = () => {
  loginErrorMessage.value = null
  isLoginModalOpen.value = true
}

const closeLoginModal = () => {
  isLoginModalOpen.value = false
  loginErrorMessage.value = null
}

const handleLogin = async (credentials: { email: string; password: string }) => {
  loginErrorMessage.value = null
  const result = await signIn(credentials.email, credentials.password)
  if (result.success) {
    isLoginModalOpen.value = false
  } else if (result.error) {
    loginErrorMessage.value = result.error.message || '로그인 중 오류가 발생했습니다.'
  }
}

const handleSignOut = async () => {
  await signOut()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Admin Top Bar (Visible when Authenticated) -->
    <header
      v-if="isAuthenticated"
      data-testid="admin-top-bar"
      class="bg-indigo-900 text-white px-4 py-2 text-sm shadow-md flex items-center justify-between sticky top-0 z-40"
    >
      <div class="flex items-center space-x-2">
        <span class="inline-block w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></span>
        <span class="font-semibold tracking-wide">관리자 모드 (Supabase Authenticated)</span>
        <span class="text-indigo-200 text-xs hidden sm:inline">| {{ user?.email }}</span>
      </div>
      <div class="flex items-center space-x-3">
        <button
          data-testid="admin-logout-button"
          type="button"
          class="px-3 py-1 bg-indigo-800 hover:bg-indigo-700 text-xs rounded transition-colors text-white font-medium border border-indigo-700"
          :disabled="authLoading"
          @click="handleSignOut"
        >
          로그아웃
        </button>
      </div>
    </header>

    <!-- Main Resume Container -->
    <main class="flex-1">
      <div class="resume-container max-w-4xl mx-auto px-4 py-8 text-gray-800">
        <!-- Component-driven orchestration with Supabase / Fallback pipeline -->
        <Profile :payload="resumeData.profile" />
        <Introduce :payload="resumeData.introduce" />
        <Skill :payload="resumeData.skill" />
        <Experience :payload="resumeData.experience" />
        <Project :payload="resumeData.project" />
        <Education :education-payload="resumeData.education" :etc-payload="resumeData.etc" />
        <Footer :payload="resumeData.footer" />
      </div>
    </main>

    <!-- Admin Entry Floating Trigger (When Unauthenticated) -->
    <div
      v-if="!isAuthenticated"
      class="fixed bottom-6 right-6 z-30"
    >
      <button
        data-testid="admin-login-button"
        type="button"
        class="flex items-center space-x-2 bg-gray-900 hover:bg-black text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg transition-transform hover:scale-105 opacity-80 hover:opacity-100"
        title="관리자 로그인"
        @click="openLoginModal"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>관리자</span>
      </button>
    </div>

    <!-- Login Modal Dialog -->
    <LoginModal
      :is-open="isLoginModalOpen"
      :loading="authLoading"
      :error-message="loginErrorMessage || (authError ? authError.message : null)"
      @close="closeLoginModal"
      @submit="handleLogin"
    />
  </div>
</template>

<style scoped>
.resume-container {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  line-height: 1.8;
  word-break: keep-all;
}
</style>
