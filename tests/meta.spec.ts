import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('index.html Meta Tags (SEO & Social Sharing)', () => {
  const htmlPath = path.resolve(__dirname, '../index.html')
  const html = fs.readFileSync(htmlPath, 'utf-8')

  it('contains standard SEO meta tags', () => {
    expect(html).toContain('<meta name="description"')
    expect(html).toContain('<meta name="keywords"')
    expect(html).toContain('<meta name="author" content="남성호"')
  })

  it('contains OpenGraph meta tags', () => {
    expect(html).toContain('<meta property="og:type" content="website"')
    expect(html).toContain('<meta property="og:title"')
    expect(html).toContain('<meta property="og:description"')
    expect(html).toContain('<meta property="og:locale" content="ko_KR"')
  })

  it('contains Twitter Card meta tags', () => {
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"')
    expect(html).toContain('<meta name="twitter:title"')
    expect(html).toContain('<meta name="twitter:description"')
  })
})
