<script setup>
import Payload from './payload/index.js'
import Profile from './components/profile/Profile.vue'
import Introduce from './components/introduce/Introduce.vue'
import Skill from './components/skill/Skill.vue'
import Experience from './components/experience/Experience.vue'
import Project from './components/project/Project.vue'
import Education from './components/education/Education.vue'
import Footer from './components/footer/Footer.vue'
</script>

<template>
  <div class="resume-container max-w-4xl mx-auto px-4 py-8 text-gray-800">
    <!-- Component-driven orchestration identical to resume-nextjs /pages/index.tsx -->
    <Profile :payload="Payload.profile" />
    <Introduce :payload="Payload.introduce" />
    <Skill :payload="Payload.skill" />
    <Experience :payload="Payload.experience" />
    <Project :payload="Payload.project" />
    <Education :education-payload="Payload.education" :etc-payload="Payload.etc" />
    <Footer :payload="Payload.footer" />
  </div>
</template>

<style scoped>
.resume-container {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  line-height: 1.8;
  word-break: keep-all;
}
</style>
