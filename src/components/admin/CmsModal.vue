<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { useAdminCms } from '../../composables/useAdminCms'

interface Props {
  isOpen: boolean
  initialData?: any
  onRefetch?: () => Promise<void> | void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeTab = ref<'profile' | 'introduce' | 'skill' | 'experience' | 'project' | 'education' | 'etc' | 'footer'>('profile')
const feedbackMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const {
  loading,
  updateProfile,
  updateIntroduce,
  saveSkill,
  deleteSkill,
  saveExperience,
  deleteExperience,
  saveProject,
  deleteProject,
  saveEducation,
  deleteEducation,
  saveEtc,
  deleteEtc,
  updateFooter
} = useAdminCms({
  onSuccess: async () => {
    if (props.onRefetch) {
      await props.onRefetch()
    }
  }
})

// Local form states
const profileForm = reactive({
  name: '',
  position: '',
  email: '',
  phone: '',
  github: '',
  location: ''
})

const introduceText = ref('')

const newSkill = reactive({ category: '', items: '' })
const newExp = reactive({ company: '', position: '', period: '', description: '' })
const newProj = reactive({ title: '', period: '', where: '', description: '' })
const newEdu = reactive({ name: '', major: '', period: '' })
const newEtc = reactive({ title: '', period: '', description: '' })

const footerForm = reactive({
  github: '',
  sign: '',
  since: new Date().getFullYear(),
  originalRepo: ''
})

watch(
  () => props.initialData,
  (newData) => {
    if (!newData) return
    if (newData.profile) {
      profileForm.name = newData.profile.name || ''
      profileForm.position = newData.profile.position || ''
      profileForm.email = newData.profile.email || ''
      profileForm.phone = newData.profile.phone || ''
      profileForm.github = newData.profile.github || ''
      profileForm.location = newData.profile.location || ''
    }
    if (newData.introduce?.contents) {
      introduceText.value = newData.introduce.contents.join('\n')
    }
    if (newData.footer) {
      footerForm.github = newData.footer.github || ''
      footerForm.sign = newData.footer.sign || ''
      footerForm.since = newData.footer.since || new Date().getFullYear()
      footerForm.originalRepo = newData.footer.originalRepo || ''
    }
  },
  { immediate: true, deep: true }
)

const showFeedback = (type: 'success' | 'error', text: string) => {
  feedbackMessage.value = { type, text }
  setTimeout(() => {
    feedbackMessage.value = null
  }, 4000)
}

const handleSaveProfile = async () => {
  const res = await updateProfile(profileForm)
  if (res.success) showFeedback('success', '프로필이 저장되었습니다.')
  else showFeedback('error', res.error?.message || '프로필 저장 실패')
}

const handleSaveIntroduce = async () => {
  const lines = introduceText.value.split('\n')
  const res = await updateIntroduce(lines)
  if (res.success) showFeedback('success', '자기소개가 저장되었습니다.')
  else showFeedback('error', res.error?.message || '자기소개 저장 실패')
}

const handleAddSkill = async () => {
  if (!newSkill.category.trim()) return
  const items = newSkill.items.split(',').map(s => s.trim()).filter(Boolean)
  const res = await saveSkill({ category: newSkill.category, items })
  if (res.success) {
    showFeedback('success', '스킬 카테고리가 추가되었습니다.')
    newSkill.category = ''
    newSkill.items = ''
  } else {
    showFeedback('error', res.error?.message || '스킬 추가 실패')
  }
}

const handleDeleteSkill = async (id: number) => {
  const res = await deleteSkill(id)
  if (res.success) showFeedback('success', '스킬 항목이 삭제되었습니다.')
  else showFeedback('error', res.error?.message || '스킬 삭제 실패')
}

const handleAddExperience = async () => {
  if (!newExp.company.trim() || !newExp.position.trim()) return
  const res = await saveExperience(newExp)
  if (res.success) {
    showFeedback('success', '경력 사항이 추가되었습니다.')
    newExp.company = ''
    newExp.position = ''
    newExp.period = ''
    newExp.description = ''
  } else {
    showFeedback('error', res.error?.message || '경력 추가 실패')
  }
}

const handleDeleteExperience = async (id: number) => {
  const res = await deleteExperience(id)
  if (res.success) showFeedback('success', '경력 사항이 삭제되었습니다.')
  else showFeedback('error', res.error?.message || '경력 삭제 실패')
}

const handleAddProject = async () => {
  if (!newProj.title.trim()) return
  const res = await saveProject(newProj)
  if (res.success) {
    showFeedback('success', '프로젝트가 추가되었습니다.')
    newProj.title = ''
    newProj.period = ''
    newProj.where = ''
    newProj.description = ''
  } else {
    showFeedback('error', res.error?.message || '프로젝트 추가 실패')
  }
}

const handleDeleteProject = async (id: number) => {
  const res = await deleteProject(id)
  if (res.success) showFeedback('success', '프로젝트가 삭제되었습니다.')
  else showFeedback('error', res.error?.message || '프로젝트 삭제 실패')
}

const handleAddEducation = async () => {
  if (!newEdu.name.trim()) return
  const res = await saveEducation(newEdu)
  if (res.success) {
    showFeedback('success', '학력 사항이 추가되었습니다.')
    newEdu.name = ''
    newEdu.major = ''
    newEdu.period = ''
  } else {
    showFeedback('error', res.error?.message || '학력 추가 실패')
  }
}

const handleDeleteEducation = async (id: number) => {
  const res = await deleteEducation(id)
  if (res.success) showFeedback('success', '학력 사항이 삭제되었습니다.')
  else showFeedback('error', res.error?.message || '학력 삭제 실패')
}

const handleAddEtc = async () => {
  if (!newEtc.title.trim()) return
  const res = await saveEtc(newEtc)
  if (res.success) {
    showFeedback('success', '기타/자격증 항목이 추가되었습니다.')
    newEtc.title = ''
    newEtc.period = ''
    newEtc.description = ''
  } else {
    showFeedback('error', res.error?.message || '기타 추가 실패')
  }
}

const handleDeleteEtc = async (id: number) => {
  const res = await deleteEtc(id)
  if (res.success) showFeedback('success', '기타 항목이 삭제되었습니다.')
  else showFeedback('error', res.error?.message || '기타 삭제 실패')
}

const handleSaveFooter = async () => {
  const res = await updateFooter(footerForm)
  if (res.success) showFeedback('success', '푸터 정보가 저장되었습니다.')
  else showFeedback('error', res.error?.message || '푸터 저장 실패')
}
</script>

<template>
  <div
    v-if="isOpen"
    data-testid="cms-modal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 overflow-y-auto"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      @click.stop
    >
      <!-- Header -->
      <div class="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-xl">🛠️</span>
          <h2 class="text-lg font-bold tracking-tight">이력서 데이터 CMS 대시보드</h2>
        </div>
        <button
          data-testid="cms-modal-close"
          type="button"
          class="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
          @click="emit('close')"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Feedback Toast -->
      <div
        v-if="feedbackMessage"
        class="px-6 py-2.5 text-sm font-medium transition-all"
        :class="feedbackMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-red-50 text-red-800 border-b border-red-200'"
      >
        {{ feedbackMessage.text }}
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-gray-200 bg-gray-50 overflow-x-auto text-sm font-medium text-gray-600">
        <button
          v-for="tab in [
            { key: 'profile', label: '프로필' },
            { key: 'introduce', label: '자기소개' },
            { key: 'skill', label: '스킬' },
            { key: 'experience', label: '경력' },
            { key: 'project', label: '프로젝트' },
            { key: 'education', label: '학력' },
            { key: 'etc', label: '기타' },
            { key: 'footer', label: '푸터' }
          ]"
          :key="tab.key"
          type="button"
          class="px-5 py-3 whitespace-nowrap border-b-2 transition-colors"
          :class="activeTab === tab.key ? 'border-indigo-600 text-indigo-600 font-semibold bg-white' : 'border-transparent hover:text-gray-900 hover:border-gray-300'"
          @click="activeTab = tab.key as any"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab Contents Area -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- 1. Profile Tab -->
        <div v-if="activeTab === 'profile'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">기본 프로필 편집</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">이름</label>
              <input v-model="profileForm.name" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">포지션</label>
              <input v-model="profileForm.position" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">이메일</label>
              <input v-model="profileForm.email" type="email" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">전화번호</label>
              <input v-model="profileForm.phone" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">GitHub 링크</label>
              <input v-model="profileForm.github" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">거주 위치</label>
              <input v-model="profileForm.location" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div class="flex justify-end pt-4">
            <button
              type="button"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow"
              :disabled="loading"
              @click="handleSaveProfile"
            >
              {{ loading ? '저장 중...' : '프로필 저장' }}
            </button>
          </div>
        </div>

        <!-- 2. Introduce Tab -->
        <div v-if="activeTab === 'introduce'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">자기소개 문구 편집</h3>
          <p class="text-xs text-gray-500">한 줄에 한 단락씩 입력해주세요.</p>
          <textarea
            v-model="introduceText"
            rows="8"
            class="w-full px-3 py-2 border rounded-lg text-sm font-sans"
            placeholder="자기소개 문구를 입력하세요..."
          ></textarea>
          <div class="flex justify-end">
            <button
              type="button"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow"
              :disabled="loading"
              @click="handleSaveIntroduce"
            >
              {{ loading ? '저장 중...' : '자기소개 저장' }}
            </button>
          </div>
        </div>

        <!-- 3. Skill Tab -->
        <div v-if="activeTab === 'skill'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">기술 스택 카테고리 관리</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input v-model="newSkill.category" type="text" placeholder="카테고리명 (예: Frontend)" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newSkill.items" type="text" placeholder="항목들 (쉼표 구분)" class="px-3 py-2 border rounded-lg text-sm" />
            <button type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold" @click="handleAddSkill">스킬 추가</button>
          </div>
          <div v-if="initialData?.skill?.categories?.length" class="space-y-2 pt-2">
            <div
              v-for="(cat, idx) in initialData.skill.categories"
              :key="idx"
              class="p-3 bg-gray-50 border rounded-lg flex items-center justify-between"
            >
              <div>
                <span class="font-bold text-sm text-gray-800">{{ cat.category }}</span>
                <span class="ml-2 text-xs text-gray-500">({{ cat.items.join(', ') }})</span>
              </div>
              <button v-if="cat.id" type="button" class="text-xs text-red-600 hover:underline" @click="handleDeleteSkill(cat.id)">삭제</button>
            </div>
          </div>
        </div>

        <!-- 4. Experience Tab -->
        <div v-if="activeTab === 'experience'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">경력 사항</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input v-model="newExp.company" type="text" placeholder="회사명" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newExp.position" type="text" placeholder="직무" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newExp.period" type="text" placeholder="기간 (예: 2022.01 - 현재)" class="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div class="flex justify-end">
            <button type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold" @click="handleAddExperience">경력 추가</button>
          </div>
          <div v-if="initialData?.experience?.length" class="space-y-2 pt-2">
            <div
              v-for="(exp, idx) in initialData.experience"
              :key="idx"
              class="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
            >
              <div>
                <span class="font-bold text-sm text-gray-800">{{ exp.company }} - {{ exp.position }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ exp.period }}</span>
              </div>
              <button v-if="exp.id" type="button" class="text-xs text-red-600 hover:underline" @click="handleDeleteExperience(exp.id)">삭제</button>
            </div>
          </div>
        </div>

        <!-- 5. Project Tab -->
        <div v-if="activeTab === 'project'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">프로젝트 목록</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input v-model="newProj.title" type="text" placeholder="프로젝트명" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newProj.period" type="text" placeholder="기간" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newProj.where" type="text" placeholder="소속/기관" class="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div class="flex justify-end">
            <button type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold" @click="handleAddProject">프로젝트 추가</button>
          </div>
          <div v-if="initialData?.project?.length" class="space-y-2 pt-2">
            <div
              v-for="(proj, idx) in initialData.project"
              :key="idx"
              class="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
            >
              <div>
                <span class="font-bold text-sm text-gray-800">{{ proj.title }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ proj.period }}</span>
              </div>
              <button v-if="proj.id" type="button" class="text-xs text-red-600 hover:underline" @click="handleDeleteProject(proj.id)">삭제</button>
            </div>
          </div>
        </div>

        <!-- 6. Education Tab -->
        <div v-if="activeTab === 'education'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">학력 목록</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input v-model="newEdu.name" type="text" placeholder="기관/대학명" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newEdu.major" type="text" placeholder="전공" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newEdu.period" type="text" placeholder="기간" class="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div class="flex justify-end">
            <button type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold" @click="handleAddEducation">학력 추가</button>
          </div>
          <div v-if="initialData?.education?.length" class="space-y-2 pt-2">
            <div
              v-for="(edu, idx) in initialData.education"
              :key="idx"
              class="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
            >
              <span class="font-bold text-sm">{{ edu.name }} ({{ edu.major }})</span>
              <button v-if="edu.id" type="button" class="text-xs text-red-600 hover:underline" @click="handleDeleteEducation(edu.id)">삭제</button>
            </div>
          </div>
        </div>

        <!-- 7. Etc Tab -->
        <div v-if="activeTab === 'etc'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">기타 / 자격증 목록</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input v-model="newEtc.title" type="text" placeholder="자격증/활동명" class="px-3 py-2 border rounded-lg text-sm" />
            <input v-model="newEtc.period" type="text" placeholder="취득일/기간" class="px-3 py-2 border rounded-lg text-sm" />
            <button type="button" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold" @click="handleAddEtc">기타 추가</button>
          </div>
          <div v-if="initialData?.etc?.length" class="space-y-2 pt-2">
            <div
              v-for="(item, idx) in initialData.etc"
              :key="idx"
              class="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
            >
              <span class="font-bold text-sm">{{ item.title }} ({{ item.period }})</span>
              <button v-if="item.id" type="button" class="text-xs text-red-600 hover:underline" @click="handleDeleteEtc(item.id)">삭제</button>
            </div>
          </div>
        </div>

        <!-- 8. Footer Tab -->
        <div v-if="activeTab === 'footer'" class="space-y-4">
          <h3 class="text-base font-bold text-gray-900 border-b pb-2">푸터 정보 편집</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">GitHub 링크</label>
              <input v-model="footerForm.github" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">서명(Sign 문구)</label>
              <input v-model="footerForm.sign" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">시작 연도(Since)</label>
              <input v-model.number="footerForm.since" type="number" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">원본 레포 링크</label>
              <input v-model="footerForm.originalRepo" type="text" class="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <div class="flex justify-end pt-4">
            <button
              type="button"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow"
              :disabled="loading"
              @click="handleSaveFooter"
            >
              {{ loading ? '저장 중...' : '푸터 저장' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
