<script setup lang="ts">
import { reactive, ref } from 'vue'

interface FieldDef {
  key: string
  label: string
  list?: boolean
}

interface SaveResult {
  success: boolean
  error?: { message?: string } | null
}

type Row = Record<string, any>

const props = defineProps<{
  items: Row[]
  fields: FieldDef[]
  summary: (item: Row) => string
  // 탭마다 저장 함수의 인자 타입이 달라 any 로 받는다(행은 기존 행 + 수정 필드)
  save: (row: any) => Promise<SaveResult>
  remove: (id: number) => Promise<SaveResult>
}>()

const emit = defineEmits<{
  (e: 'feedback', type: 'success' | 'error', text: string): void
}>()

const editingId = ref<number | null>(null)
const form = reactive<Record<string, string>>({})
const busy = ref(false)

const startEdit = (item: Row) => {
  editingId.value = item.id
  for (const f of props.fields) {
    const v = item[f.key]
    form[f.key] = f.list ? (Array.isArray(v) ? v.join(', ') : '') : (v ?? '')
  }
}

const cancelEdit = () => {
  editingId.value = null
}

const fail = (res: SaveResult, fallback: string) => emit('feedback', 'error', res.error?.message || fallback)

const saveEdit = async (item: Row) => {
  const patch: Row = {}
  for (const f of props.fields) {
    patch[f.key] = f.list
      ? form[f.key].split(',').map((s) => s.trim()).filter(Boolean)
      : form[f.key]
  }
  busy.value = true
  try {
    // 폼에 없는 필드(설명·성과·기술·링크·중첩 프로젝트 등)는 upsert 로 지워지지 않도록 기존 행을 그대로 싣는다
    const res = await props.save({ ...item, ...patch })
    if (res.success) {
      editingId.value = null
      emit('feedback', 'success', '수정되었습니다.')
    } else {
      fail(res, '수정 실패')
    }
  } finally {
    busy.value = false
  }
}

// 목록 전체가 서로 다른 order_index 로 정렬돼 있으면 인접 두 행의 값을 맞바꾼다.
// 값이 없거나 같은 행이 있으면(이전 CMS 추가분은 모두 0) 옮기지 않은 행이 튀지 않도록 목록 전체를 위치 기준(1..n)으로 다시 매긴다.
const planMove = (rows: Row[], idx: number, j: number): Row[] => {
  const strictlyOrdered = rows.every(
    (r, i) => typeof r.order_index === 'number' && (i === 0 || r.order_index > rows[i - 1].order_index)
  )
  if (strictlyOrdered) {
    return [
      { ...rows[idx], order_index: rows[j].order_index },
      { ...rows[j], order_index: rows[idx].order_index }
    ]
  }
  const moved = rows.slice()
  moved[idx] = rows[j]
  moved[j] = rows[idx]
  return moved
    .map((r, pos): Row => ({ ...r, order_index: pos + 1 }))
    .filter((r) => r.order_index !== rows.find((o) => o.id === r.id)?.order_index)
}

const move = async (idx: number, dir: -1 | 1) => {
  const j = idx + dir
  if (j < 0 || j >= props.items.length) return
  const plan = planMove(props.items, idx, j)
  busy.value = true
  try {
    for (const [n, row] of plan.entries()) {
      const res = await props.save(row)
      if (!res.success) return fail(res, n === 0 ? '순서 변경 실패' : '순서 변경 실패(일부만 반영됨)')
    }
    emit('feedback', 'success', '순서가 변경되었습니다.')
  } finally {
    busy.value = false
  }
}

const removeItem = async (item: Row) => {
  const res = await props.remove(item.id)
  if (res.success) emit('feedback', 'success', '삭제되었습니다.')
  else fail(res, '삭제 실패')
}
</script>

<template>
  <div v-if="items.length" class="space-y-2 pt-2">
    <div
      v-for="(item, idx) in items"
      :key="item.id ?? idx"
      :data-testid="`cms-row-${idx}`"
      class="p-3 bg-gray-50 border rounded-lg space-y-2"
    >
      <template v-if="item.id !== undefined && editingId === item.id">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <label v-for="f in fields" :key="f.key" class="text-xs text-gray-600 space-y-1">
            <span>{{ f.label }}{{ f.list ? ' (쉼표 구분)' : '' }}</span>
            <input
              v-model="form[f.key]"
              type="text"
              :data-testid="`cms-edit-input-${f.key}`"
              class="w-full px-3 py-2 border rounded-lg text-sm text-gray-900"
            />
          </label>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" data-testid="cms-edit-cancel" class="px-3 py-1.5 border rounded-lg text-xs" @click="cancelEdit">취소</button>
          <button
            type="button"
            data-testid="cms-edit-save"
            :disabled="busy"
            class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
            @click="saveEdit(item)"
          >
            저장
          </button>
        </div>
      </template>
      <div v-else class="flex justify-between items-center gap-2">
        <span class="font-bold text-sm text-gray-800">{{ summary(item) }}</span>
        <div v-if="item.id !== undefined" class="flex items-center gap-2 shrink-0">
          <button
            type="button"
            :data-testid="`cms-up-${idx}`"
            :disabled="busy || idx === 0"
            class="text-xs text-gray-600 hover:underline disabled:opacity-40"
            aria-label="위로 이동"
            @click="move(idx, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            :data-testid="`cms-down-${idx}`"
            :disabled="busy || idx === items.length - 1"
            class="text-xs text-gray-600 hover:underline disabled:opacity-40"
            aria-label="아래로 이동"
            @click="move(idx, 1)"
          >
            ↓
          </button>
          <button type="button" :data-testid="`cms-edit-${idx}`" class="text-xs text-indigo-600 hover:underline" @click="startEdit(item)">수정</button>
          <button type="button" :data-testid="`cms-delete-${idx}`" class="text-xs text-red-600 hover:underline" @click="removeItem(item)">삭제</button>
        </div>
      </div>
    </div>
  </div>
</template>
