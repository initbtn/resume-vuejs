import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CmsModal from '../src/components/admin/CmsModal.vue'
import { Payload } from '../src/payload'

const api = vi.hoisted(() => {
  const ok = () => vi.fn().mockResolvedValue({ success: true })
  return {
    loading: { value: false },
    updateProfile: ok(),
    updateIntroduce: ok(),
    updateFooter: ok(),
    saveHighlight: ok(),
    deleteHighlight: ok(),
    saveSkill: ok(),
    deleteSkill: ok(),
    saveExperience: ok(),
    deleteExperience: ok(),
    saveProject: ok(),
    deleteProject: ok(),
    saveEducation: ok(),
    deleteEducation: ok(),
    saveEtc: ok(),
    deleteEtc: ok(),
    reorderItems: ok()
  }
})

vi.mock('../src/composables/useAdminCms', () => ({
  useAdminCms: () => api
}))

// 목록형 탭 6개: 라벨, 저장 함수, 수정 폼 첫 필드, 추가 폼 입력(placeholder→값)
const TABS = [
  {
    key: 'highlight', label: '핵심 역량', save: 'saveHighlight', addLabel: '카드 추가',
    items: [
      { id: 11, order_index: 1, title: 'T1', description: 'D1', keywords: ['a'] },
      { id: 12, order_index: 2, title: 'T2', description: 'D2', keywords: ['b'] },
      { id: 13, order_index: 3, title: 'T3', description: 'D3', keywords: ['c'] }
    ],
    firstField: 'title',
    add: { '제목': '새 카드', '설명': '새 설명' }, addExpect: { title: '새 카드' }
  },
  {
    key: 'skill', label: '스킬', save: 'saveSkill', addLabel: '스킬 추가',
    items: [
      { id: 11, order_index: 1, category: 'C1', items: ['a'] },
      { id: 12, order_index: 2, category: 'C2', items: ['b'] },
      { id: 13, order_index: 3, category: 'C3', items: ['c'] }
    ],
    firstField: 'category',
    add: { '카테고리명 (예: Frontend)': '새 카테고리' }, addExpect: { category: '새 카테고리' }
  },
  {
    key: 'experience', label: '경력', save: 'saveExperience', addLabel: '경력 추가',
    items: [
      { id: 11, order_index: 1, company: 'Co1', position: 'P1', period: '2020', description: '설명1', projects: [{ title: 'x', period: 'y' }] },
      { id: 12, order_index: 2, company: 'Co2', position: 'P2', period: '2021' },
      { id: 13, order_index: 3, company: 'Co3', position: 'P3', period: '2022' }
    ],
    firstField: 'company',
    preserved: { description: '설명1', projects: [{ title: 'x', period: 'y' }] },
    add: { '회사명': '새 회사', '직무': '새 직무', '기간 (예: 2022.01 - 현재)': '2026' }, addExpect: { company: '새 회사' }
  },
  {
    key: 'project', label: '프로젝트', save: 'saveProject', addLabel: '프로젝트 추가',
    items: [
      { id: 11, order_index: 1, title: 'Pr1', period: '2020', where: 'W1', description: '설명1', achievements: ['성과'], skills: ['Vue'], link: 'https://x' },
      { id: 12, order_index: 2, title: 'Pr2', period: '2021' },
      { id: 13, order_index: 3, title: 'Pr3', period: '2022' }
    ],
    firstField: 'title',
    preserved: { description: '설명1', achievements: ['성과'], skills: ['Vue'], link: 'https://x' },
    add: { '프로젝트명': '새 프로젝트', '기간': '2026' }, addExpect: { title: '새 프로젝트' }
  },
  {
    key: 'education', label: '학력', save: 'saveEducation', addLabel: '학력 추가',
    items: [
      { id: 11, order_index: 1, institution: 'I1', course: 'C1', period: '2010' },
      { id: 12, order_index: 2, institution: 'I2', course: 'C2', period: '2011' },
      { id: 13, order_index: 3, institution: 'I3', course: 'C3', period: '2012' }
    ],
    firstField: 'institution',
    add: { '기관/대학명': '새 학교', '과정/전공': '새 전공', '기간': '2026' }, addExpect: { institution: '새 학교' }
  },
  {
    key: 'etc', label: '기타', save: 'saveEtc', addLabel: '기타 추가',
    items: [
      { id: 11, order_index: 1, name: 'N1', issuer: 'S1', date: '2020' },
      { id: 12, order_index: 2, name: 'N2', issuer: 'S2', date: '2021' },
      { id: 13, order_index: 3, name: 'N3', issuer: 'S3', date: '2022' }
    ],
    firstField: 'name',
    add: { '자격증/활동명': '새 자격', '발급처': '새 발급처', '취득일': '2026' }, addExpect: { name: '새 자격' }
  }
] as const

// 정상(서로 다른 값) 외에, 이전 CMS 가 만든 같은 값·일부만 같은 값·값 없음
const ORDER_CASES = [
  { name: '값이 모두 같은 행', values: [0, 0, 0] as (number | undefined)[] },
  { name: '일부만 같은 행', values: [1, 2, 2] as (number | undefined)[] },
  { name: '값이 없는 행', values: [undefined, undefined, undefined] as (number | undefined)[] }
]

const buildData = (tab: (typeof TABS)[number]) => {
  const data: any = JSON.parse(JSON.stringify(Payload))
  const items = JSON.parse(JSON.stringify(tab.items))
  if (tab.key === 'skill') data.skill = { categories: items }
  else if (tab.key === 'etc') data.etc = { certifications: items }
  else data[tab.key] = { list: items }
  return data
}

const openTab = async (tab: (typeof TABS)[number]) => {
  const wrapper = mount(CmsModal, { props: { isOpen: true, initialData: buildData(tab) } })
  const tabBtn = wrapper.findAll('button').find((b) => b.text() === tab.label)
  expect(tabBtn, `${tab.label} 탭 버튼`).toBeTruthy()
  await tabBtn!.trigger('click')
  return wrapper
}

describe('CMS 목록형 탭 수정·순서 변경 (Issue #32)', () => {
  beforeEach(() => {
    Object.values(api).forEach((f: any) => f.mockClear?.())
  })

  describe.each(TABS)('$label 탭', (tab) => {
    it('수정: 첫 필드를 바꿔 저장하면 그 행의 id 로 저장 함수가 호출되고 폼에 없는 필드는 보존된다', async () => {
      const wrapper = await openTab(tab)
      await wrapper.find('[data-testid="cms-edit-0"]').trigger('click')
      const input = wrapper.find(`[data-testid="cms-edit-input-${tab.firstField}"]`)
      expect(input.exists()).toBe(true)
      await input.setValue('수정됨')
      await wrapper.find('[data-testid="cms-edit-save"]').trigger('click')

      const saveFn = (api as any)[tab.save]
      expect(saveFn).toHaveBeenCalledTimes(1)
      expect(saveFn).toHaveBeenCalledWith(
        expect.objectContaining({ id: 11, order_index: 1, [tab.firstField]: '수정됨' })
      )
      if ('preserved' in tab) {
        expect(saveFn).toHaveBeenCalledWith(expect.objectContaining(tab.preserved))
      }
    })

    it('수정: 저장하지 않고 취소하면 저장 함수가 호출되지 않는다', async () => {
      const wrapper = await openTab(tab)
      await wrapper.find('[data-testid="cms-edit-0"]').trigger('click')
      await wrapper.find(`[data-testid="cms-edit-input-${tab.firstField}"]`).setValue('버려질 값')
      await wrapper.find('[data-testid="cms-edit-cancel"]').trigger('click')
      expect((api as any)[tab.save]).not.toHaveBeenCalled()
      expect(wrapper.find('[data-testid="cms-edit-save"]').exists()).toBe(false)
    })

    const reorderCalls = () => (api as any).reorderItems.mock.calls as [string, any[]][]
    const reorderedRows = () => reorderCalls().flatMap(([, rows]) => rows)

    it('순서: 아래로 이동하면 인접 두 행의 order_index 를 맞바꿔 한 번의 reorderItems 로 저장한다', async () => {
      const wrapper = await openTab(tab)
      await wrapper.find('[data-testid="cms-down-0"]').trigger('click')
      await vi.waitFor(() => expect((api as any).reorderItems).toHaveBeenCalledTimes(1))

      const [table, rows] = reorderCalls()[0]
      expect(table).toBe(tab.key)
      expect(rows).toHaveLength(2)
      expect(rows).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 11, order_index: 2 }),
        expect.objectContaining({ id: 12, order_index: 1 })
      ]))
      // 행마다 저장하는 경로는 쓰지 않는다
      expect((api as any)[tab.save]).not.toHaveBeenCalled()
    })

    it('순서: 위로 이동하면 인접 두 행의 order_index 를 맞바꿔 한 번의 reorderItems 로 저장한다', async () => {
      const wrapper = await openTab(tab)
      await wrapper.find('[data-testid="cms-up-2"]').trigger('click')
      await vi.waitFor(() => expect((api as any).reorderItems).toHaveBeenCalledTimes(1))

      const [table, rows] = reorderCalls()[0]
      expect(table).toBe(tab.key)
      expect(rows).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 13, order_index: 2 }),
        expect.objectContaining({ id: 12, order_index: 3 })
      ]))
      expect((api as any)[tab.save]).not.toHaveBeenCalled()
    })

    it('순서: 맨 위 행의 위로, 맨 아래 행의 아래로 버튼은 눌러도 저장하지 않는다', async () => {
      const wrapper = await openTab(tab)
      const up = wrapper.find('[data-testid="cms-up-0"]')
      const down = wrapper.find('[data-testid="cms-down-2"]')
      expect(up.exists()).toBe(true)
      expect(down.exists()).toBe(true)
      expect(up.attributes('disabled')).toBeDefined()
      expect(down.attributes('disabled')).toBeDefined()
      await up.trigger('click')
      await down.trigger('click')
      expect((api as any).reorderItems).not.toHaveBeenCalled()
      expect((api as any)[tab.save]).not.toHaveBeenCalled()
    })

    it('순서: 저장이 실패하면 오류 문구를 보이고 행별 저장을 따로 시도하지 않는다 — 일부만 반영될 수 없다', async () => {
      ;(api as any).reorderItems.mockResolvedValueOnce({ success: false, error: { message: '저장 거부됨' } })
      const wrapper = await openTab(tab)
      await wrapper.find('[data-testid="cms-down-0"]').trigger('click')
      await vi.waitFor(() => expect(wrapper.text()).toContain('저장 거부됨'))

      expect((api as any).reorderItems).toHaveBeenCalledTimes(1)
      expect((api as any)[tab.save]).not.toHaveBeenCalled()
      // 실패 뒤에도 버튼이 다시 눌린다(busy 해제)
      await vi.waitFor(() => expect(wrapper.find('[data-testid="cms-down-0"]').attributes('disabled')).toBeUndefined())
    })

    // 이전 CMS 추가분은 order_index 가 모두 0 이다. 옮기지 않은 행까지 포함해 조회 순서가 의도대로여야 한다.
    it.each(ORDER_CASES)('순서: $name — 이동 후 목록 전체 순서가 의도대로이고 옮기지 않은 행이 튀지 않는다', async ({ values }) => {
      const open = async () => {
        const data = buildData(tab) as any
        const list = tab.key === 'skill' ? data.skill.categories : tab.key === 'etc' ? data.etc.certifications : data[tab.key].list
        list.forEach((row: any, i: number) => { row.order_index = values[i] })
        const wrapper = mount(CmsModal, { props: { isOpen: true, initialData: data } })
        await wrapper.findAll('button').find((b) => b.text() === tab.label)!.trigger('click')
        return wrapper
      }
      // 저장 결과를 원래 값 위에 덮어 조회(order_index 오름차순, 동점은 원래 위치) 순서를 재현한다
      const resultingIds = () => {
        const current = new Map<number, number>([[11, values[0] ?? -1], [12, values[1] ?? -1], [13, values[2] ?? -1]])
        reorderedRows().forEach((row: any) => current.set(row.id, row.order_index))
        // 동점이면 DB 조회 순서가 보장되지 않으므로 최종 값은 모두 달라야 한다
        expect(new Set(current.values()).size).toBe(3)
        return [11, 12, 13].sort((x, y) => current.get(x)! - current.get(y)! || x - y)
      }

      let wrapper = await open()
      await wrapper.find('[data-testid="cms-down-0"]').trigger('click')
      await vi.waitFor(() => expect(reorderCalls().length).toBe(1))
      await vi.waitFor(() => expect(wrapper.find('[data-testid="cms-down-0"]').attributes('disabled')).toBeUndefined())
      expect(resultingIds()).toEqual([12, 11, 13])

      ;(api as any).reorderItems.mockClear()
      wrapper = await open()
      await wrapper.find('[data-testid="cms-up-2"]').trigger('click')
      await vi.waitFor(() => expect(reorderCalls().length).toBe(1))
      await vi.waitFor(() => expect(wrapper.find('[data-testid="cms-up-2"]').attributes('disabled')).toBeUndefined())
      expect(resultingIds()).toEqual([11, 13, 12])
      // 어느 경우든 한 번의 요청이다
      expect(reorderCalls()).toHaveLength(1)
    })

    it('추가: 새 행의 order_index 는 현재 목록 최대값 + 1 이다', async () => {
      const wrapper = await openTab(tab)
      for (const [placeholder, value] of Object.entries(tab.add)) {
        await wrapper.find(`input[placeholder="${placeholder}"]`).setValue(value)
      }
      const addBtn = wrapper.findAll('button').find((b) => b.text() === tab.addLabel)
      expect(addBtn, tab.addLabel).toBeTruthy()
      await addBtn!.trigger('click')

      const saveFn = (api as any)[tab.save]
      expect(saveFn).toHaveBeenCalledTimes(1)
      expect(saveFn).toHaveBeenCalledWith(expect.objectContaining({ ...tab.addExpect, order_index: 4 }))
    })
  })

  it('삭제: 기존 삭제 동작은 그대로 id 로 호출된다', async () => {
    const wrapper = await openTab(TABS[1])
    await wrapper.find('[data-testid="cms-delete-1"]').trigger('click')
    expect(api.deleteSkill).toHaveBeenCalledWith(12)
  })
})
