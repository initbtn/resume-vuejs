import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAdminCms } from '../src/composables/useAdminCms'

// 테이블별로 reorder 에 실려 가야 하는 열(정확한 집합)
const COLUMNS = {
  highlight: ['id', 'title', 'description', 'keywords', 'order_index', 'updated_at'],
  skill: ['id', 'category', 'items', 'order_index', 'updated_at'],
  experience: ['id', 'company', 'position', 'period', 'description', 'projects', 'order_index', 'updated_at'],
  project: ['id', 'title', 'period', 'where', 'description', 'achievements', 'skills', 'link', 'order_index', 'updated_at'],
  education: ['id', 'institution', 'course', 'period', 'order_index', 'updated_at'],
  etc: ['id', 'name', 'issuer', 'date', 'order_index', 'updated_at']
} as const

describe('useAdminCms.reorderItems — 순서 이동을 한 번의 요청으로 저장 (Issue #40)', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear()
    }
  })

  it.each(Object.entries(COLUMNS))('%s: 바뀌는 행 전체를 한 번의 reorder(배열)로 보내고 열 집합이 정확하다', async (table, columns) => {
    let requestBody: any = null
    global.fetch = vi.fn().mockImplementation(async (_url, init) => {
      requestBody = JSON.parse(init.body)
      return {
        ok: true,
        json: async () => ({ success: true, data: requestBody.payload })
      }
    })

    const onSuccess = vi.fn()
    const { reorderItems } = useAdminCms({ onSuccess })

    const rows = [
      { id: 11, order_index: 2, title: 'A', category: 'A', company: 'A', name: 'A', institution: 'A' },
      { id: 12, order_index: 1, title: 'B', category: 'B', company: 'B', name: 'B', institution: 'B' }
    ]
    const res = await reorderItems(table as keyof typeof COLUMNS, rows)

    expect(res.success).toBe(true)
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(requestBody.table).toBe(table)
    expect(requestBody.action).toBe('reorder')
    const sent = requestBody.payload
    expect(Array.isArray(sent)).toBe(true)
    expect(sent).toHaveLength(2)
    sent.forEach((row: any) => expect(Object.keys(row).sort()).toEqual([...columns].sort()))
    expect(sent.map((r: any) => [r.id, r.order_index])).toEqual([[11, 2], [12, 1]])
    expect(onSuccess).toHaveBeenCalledTimes(1)
  })

  it('기존 행의 값을 그대로 싣고, 없는 값은 null/[] 로 채운다(폼에 없는 필드가 지워지지 않는다)', async () => {
    let requestBody: any = null
    global.fetch = vi.fn().mockImplementation(async (_url, init) => {
      requestBody = JSON.parse(init.body)
      return {
        ok: true,
        json: async () => ({ success: true, data: requestBody.payload })
      }
    })

    const { reorderItems } = useAdminCms()

    await reorderItems('project', [
      {
        id: 5, order_index: 3, title: 'P', period: '2026', where: 'W', description: '설명',
        achievements: ['성과'], skills: ['Vue'], link: 'https://x'
      },
      { id: 6, order_index: 2, title: 'Q', period: '2025' }
    ])

    const [full, sparse] = requestBody.payload
    expect(full).toMatchObject({
      id: 5, order_index: 3, title: 'P', period: '2026', where: 'W', description: '설명',
      achievements: ['성과'], skills: ['Vue'], link: 'https://x'
    })
    expect(sparse).toMatchObject({
      id: 6, order_index: 2, title: 'Q', period: '2025', where: null, description: null,
      achievements: [], skills: [], link: null
    })
    expect(typeof full.updated_at).toBe('string')
  })

  it('경력의 중첩 프로젝트(JSON)도 그대로 보존한다', async () => {
    let requestBody: any = null
    global.fetch = vi.fn().mockImplementation(async (_url, init) => {
      requestBody = JSON.parse(init.body)
      return {
        ok: true,
        json: async () => ({ success: true, data: requestBody.payload })
      }
    })

    const { reorderItems } = useAdminCms()
    const projects = [{ title: 'x', period: 'y', achievements: ['z'] }]

    await reorderItems('experience', [{ id: 1, order_index: 2, company: 'C', position: 'P', period: '2020', projects }])

    expect(requestBody.payload[0].projects).toEqual(projects)
    expect(requestBody.payload[0].description).toBeNull()
  })

  it('저장 실패: 요청은 정확히 1번, 실패를 돌려주고 새로고침(onSuccess)은 부르지 않는다 — 일부만 반영될 수 없다', async () => {
    global.fetch = vi.fn().mockImplementation(async () => {
      return {
        ok: false,
        status: 403,
        json: async () => ({ success: false, error: 'permission denied' })
      }
    })

    const onSuccess = vi.fn()
    const { reorderItems, error } = useAdminCms({ onSuccess })

    const res = await reorderItems('skill', [
      { id: 1, order_index: 2, category: 'A', items: [] },
      { id: 2, order_index: 1, category: 'B', items: [] }
    ])

    expect(res.success).toBe(false)
    expect(res.error?.message).toContain('permission denied')
    expect(error.value?.message).toContain('permission denied')
    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('요청 자체가 던지면(네트워크 오류) 실패를 돌려주고 loading 이 false 로 돌아온다', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network down'))
    const { reorderItems, loading } = useAdminCms()

    const res = await reorderItems('etc', [{ id: 1, order_index: 1, name: 'N', issuer: 'I', date: 'D' }])

    expect(res.success).toBe(false)
    expect(res.error?.message).toContain('network down')
    expect(loading.value).toBe(false)
  })

  it('빈 배열이면 요청 없이 성공한다', async () => {
    global.fetch = vi.fn()
    const { reorderItems } = useAdminCms()

    const res = await reorderItems('highlight', [])

    expect(res.success).toBe(true)
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('WAS 게이트웨이(fetch)가 없으면 실패한다', async () => {
    const originalFetch = global.fetch
    // @ts-expect-error test undefined fetch
    delete global.fetch
    try {
      const { reorderItems } = useAdminCms()
      const res = await reorderItems('highlight', [{ id: 1, order_index: 1, title: 'T', description: 'D', keywords: [] }])
      expect(res.success).toBe(false)
      expect(res.error?.message).toContain('WAS 게이트웨이')
    } finally {
      global.fetch = originalFetch
    }
  })

  it('id 가 없는 행은 거부한다(upsert 가 새 행을 만들면 순서 이동이 아니라 추가가 된다)', async () => {
    global.fetch = vi.fn()
    const { reorderItems } = useAdminCms()

    const res = await reorderItems('highlight', [{ order_index: 1, title: 'T', description: 'D', keywords: [] }])

    expect(res.success).toBe(false)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
