<script setup>
import { profile, careers, personalProjects, skills, educations, certifications } from './payload.js'
</script>

<template>
  <div class="resume-container max-w-4xl mx-auto px-4 py-8 text-gray-800">
    <!-- Profile / Header Section -->
    <header class="mb-10 pb-6 border-b border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 class="text-4xl font-extrabold tracking-tight text-gray-900">{{ profile.name }}</h1>
          <p class="text-xl font-normal text-[#3c78d8] mt-1">{{ profile.position }}</p>
        </div>
        <div class="text-sm text-gray-600 space-y-1 text-left md:text-right">
          <div><span class="font-medium text-gray-400">Email:</span> <a :href="'mailto:' + profile.email" class="hover:underline text-gray-700">{{ profile.email }}</a></div>
          <div><span class="font-medium text-gray-400">Phone:</span> {{ profile.phone }}</div>
          <div><span class="font-medium text-gray-400">GitHub:</span> <a :href="profile.github" target="_blank" rel="noreferrer" class="hover:underline text-blue-600">{{ profile.github }}</a></div>
          <div><span class="font-medium text-gray-400">Location:</span> {{ profile.location }}</div>
        </div>
      </div>
      <div class="mt-6 text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded border-l-4 border-[#3c78d8]">
        {{ profile.bio }}
      </div>
    </header>

    <!-- Experience Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-[#3c78d8] mb-6 pb-2 border-b border-gray-200 flex items-center">
        <span>EXPERIENCE</span>
      </h2>

      <div class="space-y-10">
        <div v-for="(career, cIdx) in careers" :key="cIdx">
          <hr v-if="cIdx > 0" class="my-8 border-gray-200" />
          
          <!-- Company & Overall Period (Row: col-3 / col-9) -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 mb-3">
            <div class="md:col-span-3 md:text-right">
              <h4 class="text-base font-semibold text-gray-500">{{ career.period }}</h4>
            </div>
            <div class="md:col-span-9 flex flex-wrap items-center gap-2">
              <h3 class="text-xl font-bold text-gray-900">{{ career.company }}</h3>
              <span v-if="career.period.includes('현재')" class="text-xs bg-blue-600 text-white font-medium px-2 py-0.5 rounded">재직 중</span>
            </div>
          </div>

          <!-- Position & Description -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 mb-4">
            <div class="md:col-span-3"></div>
            <div class="md:col-span-9">
              <p class="text-sm font-medium text-gray-600 italic mb-1">{{ career.position }}</p>
              <p class="text-xs text-gray-500 mb-4">{{ career.description }}</p>

              <!-- Projects inside career -->
              <div class="space-y-6 mt-4">
                <div v-for="(project, pIdx) in career.projects" :key="pIdx" class="border-t border-dashed border-gray-200 pt-4">
                  <div class="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2">
                    <h5 class="text-base font-bold text-gray-800">{{ project.title }}</h5>
                    <span class="text-xs text-gray-400 font-mono">{{ project.period }}</span>
                  </div>
                  <p class="text-xs font-semibold text-gray-700 mb-2">역할: {{ project.role }}</p>

                  <ul class="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700 mb-3 leading-relaxed">
                    <li v-for="(ach, aIdx) in project.achievements" :key="aIdx">
                      {{ ach }}
                    </li>
                  </ul>

                  <!-- Skills badges (Bootstrap Badge style) -->
                  <div class="flex flex-wrap gap-1 mt-2">
                    <span class="text-xs font-bold text-gray-500 mr-1 self-center">Skill Keywords:</span>
                    <span v-for="(skill, sIdx) in project.skills" :key="sIdx" class="text-xs bg-gray-600 text-white px-2 py-0.5 rounded font-normal">
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Section (Side & Domain Projects) -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-[#3c78d8] mb-6 pb-2 border-b border-gray-200">
        <span>PROJECT</span>
      </h2>

      <div class="space-y-8">
        <div v-for="(proj, idx) in personalProjects" :key="idx">
          <hr v-if="idx > 0" class="my-6 border-gray-200" />
          
          <div class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
            <!-- Left: Period (col-3) -->
            <div class="md:col-span-3 md:text-right">
              <h4 class="text-base font-semibold text-gray-500">{{ proj.period }}</h4>
            </div>

            <!-- Right: Content (col-9) -->
            <div class="md:col-span-9">
              <div class="flex flex-wrap items-baseline gap-2 mb-1">
                <h3 class="text-lg font-bold text-gray-900">{{ proj.title }}</h3>
                <a v-if="proj.link" :href="proj.link" target="_blank" rel="noreferrer" class="text-xs text-blue-600 hover:underline">
                  [Link]
                </a>
              </div>
              <p class="text-sm text-gray-600 italic mb-3">{{ proj.description }}</p>

              <ul class="list-disc list-outside ml-4 space-y-1 text-sm text-gray-700 mb-3 leading-relaxed">
                <li v-for="(ach, aIdx) in proj.achievements" :key="aIdx">
                  {{ ach }}
                </li>
              </ul>

              <div class="flex flex-wrap gap-1 mt-2">
                <span class="text-xs font-bold text-gray-500 mr-1 self-center">Skill Keywords:</span>
                <span v-for="(skill, sIdx) in proj.skills" :key="sIdx" class="text-xs bg-gray-600 text-white px-2 py-0.5 rounded font-normal">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-[#3c78d8] mb-6 pb-2 border-b border-gray-200">
        <span>SKILL</span>
      </h2>

      <div class="space-y-6">
        <div v-for="(cat, idx) in skills" :key="idx" class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
          <div class="md:col-span-3 md:text-right">
            <h4 class="text-base font-bold text-gray-700">{{ cat.category }}</h4>
          </div>
          <div class="md:col-span-9 flex flex-wrap gap-1.5 items-center">
            <span v-for="(item, iIdx) in cat.items" :key="iIdx" class="text-xs bg-blue-50 text-[#3c78d8] border border-blue-200 px-2.5 py-1 rounded font-medium">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Education Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-[#3c78d8] mb-6 pb-2 border-b border-gray-200">
        <span>EDUCATION</span>
      </h2>

      <div class="space-y-6">
        <div v-for="(edu, idx) in educations" :key="idx" class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
          <div class="md:col-span-3 md:text-right">
            <h4 class="text-base font-semibold text-gray-500">{{ edu.period }}</h4>
          </div>
          <div class="md:col-span-9">
            <h4 class="text-base font-bold text-gray-900">{{ edu.institution }}</h4>
            <p class="text-sm text-gray-600 mt-0.5">{{ edu.course }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Certifications Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-[#3c78d8] mb-6 pb-2 border-b border-gray-200">
        <span>CERTIFICATION</span>
      </h2>

      <div class="space-y-4">
        <div v-for="(cert, idx) in certifications" :key="idx" class="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6">
          <div class="md:col-span-3 md:text-right">
            <span class="text-sm font-semibold text-gray-500">{{ cert.date }}</span>
          </div>
          <div class="md:col-span-9 flex items-baseline gap-2">
            <h4 class="text-sm font-bold text-gray-900">{{ cert.name }}</h4>
            <span class="text-xs text-gray-500">({{ cert.issuer }})</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer (Reference Style) -->
    <footer class="mt-16 pt-8 border-t border-gray-200 text-center text-xs text-gray-500">
      <p class="font-serif italic text-sm text-gray-400 mb-1">Sung-Ho Nam</p>
      <p>© {{ new Date().getFullYear() }} {{ profile.name }}. Ported to Vue 3 & Vite from <a href="https://github.com/uyu423/resume-nextjs" target="_blank" class="underline text-blue-500">resume-nextjs</a>.</p>
    </footer>
  </div>
</template>

<style scoped>
.resume-container {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  line-height: 1.8;
  word-break: keep-all;
}
</style>
