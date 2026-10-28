import type { PayloadType } from '../payload/types'

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

export async function fetchResumeFromGateway(apiUrl = '/api/resume'): Promise<Partial<PayloadType> | null> {
  if (typeof fetch === 'undefined') {
    return null
  }
  const res = await fetch(apiUrl)
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
    const res = await fetch('/api/cms', {
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
    const res = await fetch('/api/auth', {
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
