<script setup>
import { profile, careers, personalProjects, skills, educations, certifications } from './payload.js'
</script>

<template>
  <div class="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
    <!-- Header / Profile Section -->
    <header class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ profile.name }}</h1>
          <p class="text-lg font-medium text-brand-500 mt-1">{{ profile.position }}</p>
        </div>
        <div class="flex flex-wrap gap-3 text-sm text-gray-600">
          <a :href="'mailto:' + profile.email" class="hover:text-brand-500 transition-colors flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            {{ profile.email }}
          </a>
          <span class="text-gray-300">|</span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            {{ profile.phone }}
          </span>
          <span class="text-gray-300">|</span>
          <a :href="profile.github" target="_blank" rel="noreferrer" class="hover:text-brand-500 transition-colors flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            GitHub
          </a>
        </div>
      </div>
      <p class="text-gray-700 leading-relaxed mt-5 text-sm sm:text-base whitespace-pre-line font-normal">
        {{ profile.bio }}
      </p>
    </header>

    <!-- Work Experience Section -->
    <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-brand-500 rounded-full inline-block"></span>
        Work Experience
      </h2>

      <div class="space-y-10">
        <div v-for="(career, cIdx) in careers" :key="cIdx" class="border-l-2 border-gray-200 pl-5 ml-2 relative">
          <div class="absolute -left-[9px] top-1 w-4 h-4 bg-white border-2 border-brand-500 rounded-full"></div>
          
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
            <h3 class="text-lg font-bold text-gray-900">{{ career.company }}</h3>
            <span class="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{{ career.period }}</span>
          </div>
          <p class="text-sm font-medium text-brand-600 mb-2">{{ career.position }}</p>
          <p class="text-xs text-gray-600 mb-4">{{ career.description }}</p>

          <!-- Projects under career -->
          <div class="space-y-6 mt-4">
            <div v-for="(project, pIdx) in career.projects" :key="pIdx" class="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                <h4 class="font-bold text-gray-900 text-sm sm:text-base">{{ project.title }}</h4>
                <span class="text-xs text-gray-500">{{ project.period }}</span>
              </div>
              <p class="text-xs font-semibold text-gray-700 mb-3">역할: {{ project.role }}</p>

              <ul class="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 mb-4">
                <li v-for="(ach, aIdx) in project.achievements" :key="aIdx" class="leading-relaxed">
                  {{ ach }}
                </li>
              </ul>

              <div class="flex flex-wrap gap-1.5">
                <span v-for="(skill, sIdx) in project.skills" :key="sIdx" class="text-[11px] font-medium bg-white text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Side / Personal Projects Section -->
    <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-brand-500 rounded-full inline-block"></span>
        Side & Domain Projects
      </h2>

      <div class="space-y-6">
        <div v-for="(proj, idx) in personalProjects" :key="idx" class="border border-gray-100 rounded-xl p-6 bg-gray-50 hover:border-brand-500 transition-colors">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
            <h3 class="text-base font-bold text-gray-900">{{ proj.title }}</h3>
            <span class="text-xs text-gray-500">{{ proj.period }}</span>
          </div>
          <p class="text-xs text-gray-600 mb-3">{{ proj.description }}</p>

          <ul class="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 mb-4">
            <li v-for="(ach, aIdx) in proj.achievements" :key="aIdx" class="leading-relaxed">
              {{ ach }}
            </li>
          </ul>

          <div class="flex flex-wrap gap-1.5 items-center justify-between">
            <div class="flex flex-wrap gap-1.5">
              <span v-for="(skill, sIdx) in proj.skills" :key="sIdx" class="text-[11px] font-medium bg-white text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                {{ skill }}
              </span>
            </div>
            <a v-if="proj.link" :href="proj.link" target="_blank" rel="noreferrer" class="text-xs font-semibold text-brand-500 hover:underline">
              GitHub Repo →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
      <h2 class="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
        <span class="w-2.5 h-2.5 bg-brand-500 rounded-full inline-block"></span>
        Skill Inventory
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(cat, idx) in skills" :key="idx" class="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <h3 class="text-xs font-bold text-brand-600 uppercase tracking-wider mb-2.5">{{ cat.category }}</h3>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="(item, iIdx) in cat.items" :key="iIdx" class="text-xs bg-white text-gray-800 px-2.5 py-1 rounded-md border border-gray-200 font-medium">
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Education & Certifications Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <!-- Education -->
      <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-brand-500 rounded-full inline-block"></span>
          Education
        </h2>
        <div class="space-y-4">
          <div v-for="(edu, idx) in educations" :key="idx">
            <div class="flex justify-between items-baseline">
              <h3 class="text-sm font-bold text-gray-900">{{ edu.institution }}</h3>
              <span class="text-xs text-gray-500">{{ edu.period }}</span>
            </div>
            <p class="text-xs text-gray-600 mt-0.5">{{ edu.course }}</p>
          </div>
        </div>
      </section>

      <!-- Certifications -->
      <section class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
          <span class="w-2.5 h-2.5 bg-brand-500 rounded-full inline-block"></span>
          Certifications
        </h2>
        <div class="space-y-3">
          <div v-for="(cert, idx) in certifications" :key="idx" class="flex justify-between items-center text-sm">
            <div>
              <span class="font-bold text-gray-900">{{ cert.name }}</span>
              <span class="text-xs text-gray-500 ml-2">({{ cert.issuer }})</span>
            </div>
            <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{{ cert.date }}</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer class="text-center text-xs text-gray-400 py-6">
      © {{ new Date().getFullYear() }} {{ profile.name }}. Powered by Vue 3 & Vite.
    </footer>
  </div>
</template>
