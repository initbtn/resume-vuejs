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
    deleteEtc: ok()
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

    it('순서: 아래로 이동하면 인접 두 행의 order_index 를 맞바꿔 저장한다', async () => {
      const wrapper = await openTab(tab)
      await wrapper.find('[data-testid="cms-down-0"]').trigger('click')
      await vi.waitFor(() => expect((api as any)[tab.save]).toHaveBeenCalledTimes(2))

      const saveFn = (api as any)[tab.save]
      expect(saveFn).toHaveBeenCalledWith(expect.objectContaining({ id: 11, order_index: 2 }))
      expect(saveFn).toHaveBeenCalledWith(expect.objectContaining({ id: 12, order_index: 1 }))
    })

    it('순서: 위로 이동하면 인접 두 행의 order_index 를 맞바꿔 저장한다', async () => {
      const wrapper = await openTab(tab)
      await wrapper.find('[data-testid="cms-up-2"]').trigger('click')
      await vi.waitFor(() => expect((api as any)[tab.save]).toHaveBeenCalledTimes(2))

      const saveFn = (api as any)[tab.save]
      expect(saveFn).toHaveBeenCalledWith(expect.objectContaining({ id: 13, order_index: 2 }))
      expect(saveFn).toHaveBeenCalledWith(expect.objectContaining({ id: 12, order_index: 3 }))
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
      expect((api as any)[tab.save]).not.toHaveBeenCalled()
    })

    it('순서: order_index 가 같은 두 행(이전 CMS 추가분)도 위치 기준으로 서로 다른 값을 받는다', async () => {
      const data = buildData(tab) as any
      const list = tab.key === 'skill' ? data.skill.categories : tab.key === 'etc' ? data.etc.certifications : data[tab.key].list
      list.forEach((row: any) => { row.order_index = 0 })
      const wrapper = mount(CmsModal, { props: { isOpen: true, initialData: data } })
      await wrapper.findAll('button').find((b) => b.text() === tab.label)!.trigger('click')
      await wrapper.find('[data-testid="cms-down-0"]').trigger('click')
      await vi.waitFor(() => expect((api as any)[tab.save]).toHaveBeenCalledTimes(2))

      const calls = (api as any)[tab.save].mock.calls.map((c: any[]) => c[0])
      const first = calls.find((c: any) => c.id === 11)
      const second = calls.find((c: any) => c.id === 12)
      expect(first.order_index).toBe(2)
      expect(second.order_index).toBe(1)
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
