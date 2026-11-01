import type { PayloadType } from '../types/payload.types'

export interface GatewayResumeResponse {
  success: boolean
  data?: Partial<PayloadType>
  error?: string
}

export interface GatewayCmsResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface GatewayAuthResponse {
  success: boolean
  user?: any
  session?: any
  error?: string
}

export function getGatewayBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Vercel 자체 호스팅 또는 로컬 환경이면 상대 경로 사용
    if (window.location.hostname === 'resume-vuejs.vercel.app' || window.location.hostname === 'localhost') {
      return ''
    }
    // GitHub Pages 등 외부 정적 호스팅에서는 Vercel WAS 게이트웨이를 호출
    return 'https://resume-vuejs.vercel.app'
  }
  return ''
}

export async function fetchResumeFromGateway(apiUrl?: string): Promise<Partial<PayloadType> | null> {
  if (typeof fetch === 'undefined') {
    return null
  }
  const endpoint = apiUrl || `${getGatewayBaseUrl()}/api/resume`
  const res = await fetch(endpoint)
  if (!res.ok) {
    throw new Error(`WAS Gateway HTTP ${res.status}`)
  }
  const json = (await res.json()) as GatewayResumeResponse
  if (!json.success || !json.data) {
    throw new Error(json.error || 'Failed to fetch resume from WAS Gateway')
  }
  return json.data
}

export async function sendCmsToGateway<T = any>(
  table: string,
  action: 'upsert' | 'delete' | 'reorder',
  payload: any,
  token?: string
): Promise<{ success: boolean; data?: T; error?: Error }> {
  try {
    if (typeof fetch === 'undefined') {
      throw new Error('fetch is not available')
    }
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    const endpoint = `${getGatewayBaseUrl()}/api/cms`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ table, action, payload })
    })
    const json = (await res.json()) as GatewayCmsResponse<T>
    if (!res.ok || !json.success) {
      throw new Error(json.error || `CMS Gateway error HTTP ${res.status}`)
    }
    return { success: true, data: json.data }
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err : new Error(String(err)) }
  }
}

export async function authGatewayRequest(
  action: 'login' | 'logout' | 'getUser',
  payload?: { email?: string; password?: string; token?: string }
): Promise<GatewayAuthResponse> {
  if (typeof fetch === 'undefined') {
    return { success: false, error: 'fetch is not available' }
  }
  try {
    const endpoint = `${getGatewayBaseUrl()}/api/auth`
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...payload })
    })
    const json = (await res.json()) as GatewayAuthResponse
    if (!res.ok || !json.success) {
      return { success: false, error: json.error || `Auth Gateway error HTTP ${res.status}` }
    }
    return json
  } catch (err: any) {
    return { success: false, error: err instanceof Error ? err.message : String(err) }
  }
}
