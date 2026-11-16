import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// 관리자 CMS 는 로그인(authenticated) JWT 로 읽고 쓴다. 테이블 권한(GRANT)이 없으면 PostgREST 가 403 을 돌려주고,
// 쓰기 정책이 USING (true) 면 로그인한 모든 사용자(같은 프로젝트의 kakao 사용자 포함)가 쓸 수 있다. (Issue #44)
const TABLES = ['profile', 'introduce', 'skill', 'experience', 'project', 'education', 'etc', 'footer', 'highlight']
const WRITE_PRIVS = ['INSERT', 'UPDATE', 'DELETE']
const ADMIN_UID = 'f8ec1c94-8f3f-46e3-9be5-7f2f7c2d2e80'

const migrationsDir = resolve(__dirname, '../supabase/migrations')

interface Policy {
  name: string
  cmd: string
  roles: string[]
  using: string | null
  check: string | null
}

// 짝 맞는 괄호 안의 문자열을 꺼낸다(예: USING ((SELECT auth.uid()) = '...'))
const balanced = (text: string, openIdx: number): string => {
  let depth = 0
  for (let i = openIdx; i < text.length; i++) {
    if (text[i] === '(') depth++
    else if (text[i] === ')' && --depth === 0) return text.slice(openIdx + 1, i)
  }
  throw new Error('괄호가 닫히지 않음: ' + text.slice(openIdx, openIdx + 60))
}

const parsePolicyBody = (name: string, body: string): Policy => {
  const cmd = /\bFOR (ALL|SELECT|INSERT|UPDATE|DELETE)\b/.exec(body)?.[1] ?? 'ALL'
  const rolesRaw = /\bTO ([a-z_,\s]+?)(?=\s+USING|\s+WITH CHECK|\s*$)/.exec(body)?.[1] ?? 'public'
  const u = body.indexOf('USING (')
  const c = body.indexOf('WITH CHECK (')
  return {
    name,
    cmd,
    roles: rolesRaw.split(',').map((r) => r.trim()).filter(Boolean),
    using: u >= 0 ? balanced(body, u + 'USING '.length).trim() : null,
    check: c >= 0 ? balanced(body, c + 'WITH CHECK '.length).trim() : null
  }
}

// 마이그레이션을 파일명 순서로 따라가며 최종 권한·정책을 구한다
const finalState = () => {
  const policies = new Map<string, Map<string, Policy>>() // table -> name -> policy
  const grants = new Map<string, Map<string, Set<string>>>() // table -> role -> privileges
  const re =
    /DROP POLICY IF EXISTS "([^"]+)" ON public\.(\w+);|CREATE POLICY "([^"]+)" ON public\.(\w+)\s+([^;]*);|GRANT\s+([A-Z, ]+?)\s+ON\s+((?:public\.\w+\s*,?\s*)+)TO\s+([a-z_, ]+?);/g
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort()
  for (const f of files) {
    const sql = readFileSync(resolve(migrationsDir, f), 'utf8')
    for (const m of sql.matchAll(re)) {
      if (m[1]) {
        policies.get(m[2])?.delete(m[1])
      } else if (m[3]) {
        const t = m[4]
        if (!policies.has(t)) policies.set(t, new Map())
        policies.get(t)!.set(m[3], parsePolicyBody(m[3], m[5]))
      } else if (m[6]) {
        const privs = m[6].split(',').map((p) => p.trim()).filter(Boolean)
        const tables = [...m[7].matchAll(/public\.(\w+)/g)].map((x) => x[1])
        const roles = m[8].split(',').map((r) => r.trim()).filter(Boolean)
        for (const t of tables) {
          if (!grants.has(t)) grants.set(t, new Map())
          for (const r of roles) {
            if (!grants.get(t)!.has(r)) grants.get(t)!.set(r, new Set())
            privs.forEach((p) => grants.get(t)!.get(r)!.add(p))
          }
        }
      }
    }
  }
  return { policies, grants }
}

const appliesTo = (p: Policy, role: string) => p.roles.includes(role) || p.roles.includes('public')
const isWrite = (p: Policy) => p.cmd === 'ALL' || WRITE_PRIVS.includes(p.cmd)
const isTrue = (expr: string | null) => expr !== null && expr.replace(/\s/g, '').toLowerCase() === 'true'

describe('CMS 테이블 권한·정책 — 관리자만 쓰고 로그인 사용자는 읽는다 (Issue #44)', () => {
  it('파서가 9개 테이블의 현재 정책을 모두 읽는다(정상값 칸: 파서가 비어 통과하지 않게)', () => {
    const { policies } = finalState()
    for (const t of TABLES) {
      expect(policies.get(t)?.size ?? 0, `${t} 의 정책을 못 읽음`).toBeGreaterThan(0)
    }
  })

  it('파서가 괄호 중첩 조건을 읽는다(헬퍼 단독 검증)', () => {
    const p = parsePolicyBody('x', `FOR ALL TO authenticated USING ((SELECT auth.uid()) = 'a') WITH CHECK ((SELECT auth.uid()) = 'a')`)
    expect(p).toEqual({
      name: 'x', cmd: 'ALL', roles: ['authenticated'],
      using: "(SELECT auth.uid()) = 'a'", check: "(SELECT auth.uid()) = 'a'"
    })
  })

  it.each(TABLES)('%s: authenticated 가 SELECT·INSERT·UPDATE·DELETE 권한을 가진다', (table) => {
    const privs = finalState().grants.get(table)?.get('authenticated') ?? new Set<string>()
    for (const p of ['SELECT', ...WRITE_PRIVS]) {
      expect(privs.has(p), `${table}: authenticated 에 ${p} 없음`).toBe(true)
    }
  })

  it.each(TABLES)('%s: anon 에게 쓰기 권한을 주지 않는다', (table) => {
    const privs = finalState().grants.get(table)?.get('anon') ?? new Set<string>()
    for (const p of WRITE_PRIVS) expect(privs.has(p), `${table}: anon 에 ${p} 부여됨`).toBe(false)
  })

  it.each(TABLES)('%s: authenticated 의 쓰기 정책에 USING (true)·WITH CHECK (true) 가 남지 않는다', (table) => {
    const pols = [...(finalState().policies.get(table)?.values() ?? [])]
    const writes = pols.filter((p) => appliesTo(p, 'authenticated') && isWrite(p))
    expect(writes.length, `${table}: authenticated 쓰기 정책이 없음`).toBeGreaterThan(0)
    for (const p of writes) {
      expect(isTrue(p.using), `${table}/${p.name}: USING (true)`).toBe(false)
      expect(isTrue(p.check), `${table}/${p.name}: WITH CHECK (true)`).toBe(false)
    }
  })

  it.each(TABLES)('%s: 쓰기 정책의 조건이 관리자 uuid 로 제한된다', (table) => {
    const pols = [...(finalState().policies.get(table)?.values() ?? [])]
    const writes = pols.filter((p) => appliesTo(p, 'authenticated') && isWrite(p))
    for (const p of writes) {
      expect(p.using ?? '', `${table}/${p.name} USING`).toContain(ADMIN_UID)
      expect(p.check ?? '', `${table}/${p.name} WITH CHECK`).toContain(ADMIN_UID)
    }
  })

  it.each(TABLES)('%s: anon 과 authenticated 모두 읽을 수 있고 anon 쓰기 정책은 없다', (table) => {
    const pols = [...(finalState().policies.get(table)?.values() ?? [])]
    const reads = (role: string) => pols.some((p) => appliesTo(p, role) && (p.cmd === 'SELECT' || p.cmd === 'ALL') && isTrue(p.using))
    expect(reads('anon'), `${table}: anon 읽기 정책 없음`).toBe(true)
    expect(reads('authenticated'), `${table}: authenticated 읽기 정책 없음`).toBe(true)
    expect(pols.filter((p) => p.roles.includes('anon') && isWrite(p))).toEqual([])
  })

  it('관리자 uuid 는 정상적인 UUID 형식이다', () => {
    expect(ADMIN_UID).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  })
})
