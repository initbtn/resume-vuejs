import type { IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database.types'

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
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    res.statusCode = 500
    res.end(JSON.stringify({ success: false, error: 'Server-side Supabase credentials not configured' }))
    return
  }

  try {
    const body = (req as any).body || (await parseBody(req))
    const { action, email, password, token } = body || {}

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    if (action === 'login') {
      if (!email || !password) {
        res.statusCode = 400
        res.end(JSON.stringify({ success: false, error: 'email and password are required' }))
        return
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      res.statusCode = 200
      res.end(JSON.stringify({ success: true, user: data.user, session: data.session }))
      return
    }

    if (action === 'getUser') {
      if (!token) {
        res.statusCode = 400
        res.end(JSON.stringify({ success: false, error: 'token is required' }))
        return
      }
      const { data, error } = await supabase.auth.getUser(token)
      if (error) throw error
      res.statusCode = 200
      res.end(JSON.stringify({ success: true, user: data.user }))
      return
    }

    if (action === 'logout') {
      res.statusCode = 200
      res.end(JSON.stringify({ success: true }))
      return
    }

    res.statusCode = 400
    res.end(JSON.stringify({ success: false, error: `Unsupported action: ${action}` }))
  } catch (err: any) {
    res.statusCode = 401
    res.end(JSON.stringify({ success: false, error: err.message || String(err) }))
  }
}
