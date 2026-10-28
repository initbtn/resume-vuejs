import type { IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database.types'

const ALLOWED_TABLES = [
  'profile',
  'introduce',
  'highlight',
  'skill',
  'experience',
  'project',
  'education',
  'etc',
  'footer'
]

async function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (e) {
        reject(e)
      }
    })
    req.on('error', reject)
  })
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }))
    return
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    res.statusCode = 500
    res.end(JSON.stringify({ success: false, error: 'Server-side Supabase credentials not configured' }))
    return
  }

  // 1. Bearer Token Verification
  const authHeader = req.headers['authorization'] || (req as any).headers?.authorization
  const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null

  if (!token) {
    res.statusCode = 401
    res.end(JSON.stringify({ success: false, error: 'Unauthorized: Missing or invalid Bearer token' }))
    return
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  try {
    const { data: userData, error: authError } = await supabase.auth.getUser(token)
    if (authError || !userData?.user) {
      res.statusCode = 401
      res.end(JSON.stringify({ success: false, error: 'Unauthorized: Invalid token' }))
      return
    }

    const body = (req as any).body || (await parseBody(req))
    const { table, action, payload } = body || {}

    if (!table || !action) {
      res.statusCode = 400
      res.end(JSON.stringify({ success: false, error: 'table and action are required' }))
      return
    }

    // 2. Allowed Tables Whitelist
    if (!ALLOWED_TABLES.includes(table)) {
      res.statusCode = 400
      res.end(
        JSON.stringify({
          success: false,
          error: `Invalid table: ${table}. Allowed tables: ${ALLOWED_TABLES.join(', ')}`
        })
      )
      return
    }

    if (action === 'upsert') {
      const onConflict = ['profile', 'introduce', 'footer'].includes(table) ? 'id' : 'id'
      const { data, error } = await (supabase as any).from(table).upsert(payload, { onConflict }).select()
      if (error) throw error
      res.statusCode = 200
      res.end(JSON.stringify({ success: true, data }))
      return
    }

    if (action === 'delete') {
      if (!payload?.id) {
        res.statusCode = 400
        res.end(JSON.stringify({ success: false, error: 'payload.id is required for delete' }))
        return
      }
      const { data, error } = await (supabase as any).from(table).delete().eq('id', payload.id)
      if (error) throw error
      res.statusCode = 200
      res.end(JSON.stringify({ success: true, data }))
      return
    }

    if (action === 'reorder') {
      if (!Array.isArray(payload)) {
        res.statusCode = 400
        res.end(JSON.stringify({ success: false, error: 'payload must be an array for reorder' }))
        return
      }
      const results = await Promise.all(
        payload.map((item: { id: string | number; order_index: number }) =>
          (supabase as any).from(table).update({ order_index: item.order_index }).eq('id', item.id)
        )
      )
      const err = results.find((r: any) => r.error)
      if (err) throw err.error
      res.statusCode = 200
      res.end(JSON.stringify({ success: true, data: payload }))
      return
    }

    res.statusCode = 400
    res.end(JSON.stringify({ success: false, error: `Unsupported action: ${action}` }))
  } catch (err: any) {
    res.statusCode = 500
    res.end(JSON.stringify({ success: false, error: err.message || String(err) }))
  }
}
