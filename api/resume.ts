import type { IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/database.types'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Content-Type', 'application/json')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  if (req.method !== 'GET') {
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

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  try {
    const queryTable = async (table: string, isSingle: boolean) => {
      const query = (supabase as any).from(table).select('*')
      if (isSingle) {
        return typeof query?.maybeSingle === 'function' ? query.maybeSingle() : query
      }
      return typeof query?.order === 'function' ? query.order('order_index', { ascending: true }) : query
    }

    const [
      profileRes,
      introduceRes,
      highlightRes,
      skillRes,
      experienceRes,
      projectRes,
      educationRes,
      etcRes,
      footerRes
    ] = await Promise.all([
      queryTable('profile', true),
      queryTable('introduce', true),
      queryTable('highlight', false),
      queryTable('skill', false),
      queryTable('experience', false),
      queryTable('project', false),
      queryTable('education', false),
      queryTable('etc', false),
      queryTable('footer', true)
    ])

    const anyError = [
      profileRes?.error,
      introduceRes?.error,
      highlightRes?.error,
      skillRes?.error,
      experienceRes?.error,
      projectRes?.error,
      educationRes?.error,
      etcRes?.error,
      footerRes?.error
    ].find(Boolean)

    if (anyError) {
      res.statusCode = 500
      res.end(JSON.stringify({ success: false, error: anyError.message || String(anyError) }))
      return
    }

    const payloadData: any = {}

    if (profileRes?.data) {
      payloadData.profile = profileRes.data
    }
    if (introduceRes?.data?.contents) {
      payloadData.introduce = { contents: introduceRes.data.contents }
    }
    if (highlightRes?.data && highlightRes.data.length > 0) {
      payloadData.highlight = {
        list: highlightRes.data.map((row: any) => ({
          id: row.id,
          order_index: row.order_index,
          title: row.title,
          description: row.description,
          keywords: row.keywords || []
        }))
      }
    }
    if (skillRes?.data && skillRes.data.length > 0) {
      payloadData.skill = {
        categories: skillRes.data.map((row: any) => ({
          id: row.id,
          order_index: row.order_index,
          category: row.category,
          items: row.items || []
        }))
      }
    }
    if (experienceRes?.data && experienceRes.data.length > 0) {
      payloadData.experience = {
        list: experienceRes.data.map((row: any) => ({
          id: row.id,
          order_index: row.order_index,
          company: row.company,
          position: row.position,
          period: row.period,
          description: row.description || undefined,
          projects: row.projects || undefined
        }))
      }
    }
    if (projectRes?.data && projectRes.data.length > 0) {
      payloadData.project = {
        list: projectRes.data.map((row: any) => ({
          id: row.id,
          order_index: row.order_index,
          title: row.title,
          period: row.period,
          where: row.where || undefined,
          description: row.description || undefined,
          achievements: row.achievements || undefined,
          skills: row.skills || undefined,
          link: row.link || undefined
        }))
      }
    }
    if (educationRes?.data && educationRes.data.length > 0) {
      payloadData.education = {
        list: educationRes.data.map((row: any) => ({
          id: row.id,
          order_index: row.order_index,
          institution: row.institution,
          course: row.course,
          period: row.period
        }))
      }
    }
    if (etcRes?.data && etcRes.data.length > 0) {
      payloadData.etc = {
        certifications: etcRes.data.map((row: any) => ({
          id: row.id,
          order_index: row.order_index,
          name: row.name,
          issuer: row.issuer,
          date: row.date
        }))
      }
    }
    if (footerRes?.data) {
      payloadData.footer = {
        sign: footerRes.data.sign,
        since: footerRes.data.since,
        github: footerRes.data.github,
        originalRepo: footerRes.data.originalRepo || undefined
      }
    }

    res.statusCode = 200
    res.end(JSON.stringify({ success: true, data: payloadData, source: 'supabase' }))
  } catch (err: any) {
    res.statusCode = 500
    res.end(JSON.stringify({ success: false, error: err.message || String(err) }))
  }
}
