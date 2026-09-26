<script setup lang="ts">
import { useResumeData } from './composables/useResumeData'
import Profile from './components/profile/Profile.vue'
import Introduce from './components/introduce/Introduce.vue'
import Skill from './components/skill/Skill.vue'
import Experience from './components/experience/Experience.vue'
import Project from './components/project/Project.vue'
import Education from './components/education/Education.vue'
import Footer from './components/footer/Footer.vue'

const { data: resumeData } = useResumeData({ autoFetch: true })
</script>

<template>
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
</template>

<style scoped>
.resume-container {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  line-height: 1.8;
  word-break: keep-all;
}
</style>
