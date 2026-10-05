import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// CMS 의 수정·순서 이동은 기존 행의 id 를 담아 upsert 한다.
// id 가 GENERATED ALWAYS 면 id 를 직접 넣는 INSERT(ON CONFLICT 포함)가 거부되므로 BY DEFAULT 여야 한다. (Issue #40)
const TABLES = ['skill', 'experience', 'project', 'education', 'etc', 'highlight']

const migrationsDir = resolve(__dirname, '../supabase/migrations')

// 마이그레이션을 파일명 순서대로 따라가며 테이블별 id 식별 모드의 마지막 값을 구한다
const finalIdentityModes = () => {
  const modes = new Map<string, string>()
  const re =
    /CREATE TABLE IF NOT EXISTS public\.(\w+) \(\s*id bigint GENERATED (ALWAYS|BY DEFAULT) AS IDENTITY|ALTER TABLE public\.(\w+) ALTER COLUMN id SET GENERATED (ALWAYS|BY DEFAULT)/g
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
  for (const f of files) {
    const sql = readFileSync(resolve(migrationsDir, f), 'utf8')
    for (const m of sql.matchAll(re)) {
      modes.set(m[1] ?? m[3], m[2] ?? m[4])
    }
  }
  return modes
}

describe('CMS 테이블 id 식별 열 — upsert 로 id 를 넣을 수 있어야 한다 (Issue #40)', () => {
  it('마이그레이션 파서가 6개 테이블 모두의 식별 모드를 찾는다(정상값 칸: 파서가 비어 통과하지 않게)', () => {
    const modes = finalIdentityModes()
    for (const t of TABLES) {
      expect(modes.has(t), `${t} 의 id 정의를 마이그레이션에서 못 찾음`).toBe(true)
    }
  })

  it.each(TABLES)('%s: 마이그레이션을 모두 적용한 최종 id 모드가 BY DEFAULT 이다', (table) => {
    expect(finalIdentityModes().get(table)).toBe('BY DEFAULT')
  })

  it('생성 타입(database.types.ts)이 id 를 never 로 막지 않는다', () => {
    const types = readFileSync(resolve(__dirname, '../src/types/database.types.ts'), 'utf8')
    expect(types).not.toContain('id?: never')
  })

  it('저장 함수가 타입 오류를 가리는 `as never` 캐스트로 id 를 넣지 않는다', () => {
    const src = readFileSync(resolve(__dirname, '../src/composables/useAdminCms.ts'), 'utf8')
    expect(src).not.toMatch(/row\.id = .* as never/)
  })
})
