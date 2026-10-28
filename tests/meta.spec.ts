import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'

describe('index.html Meta Tags (SEO & Social Sharing)', () => {
  const htmlPath = path.resolve(__dirname, '../index.html')
  const html = fs.readFileSync(htmlPath, 'utf-8')
  const publicDir = path.resolve(__dirname, '../public')

  it('contains standard SEO meta tags and canonical link', () => {
    expect(html).toContain('<meta name="description"')
    expect(html).toContain('<meta name="keywords"')
    expect(html).toContain('<meta name="author" content="남성호"')
    expect(html).toContain('<link rel="canonical" href="https://initbtn.github.io/resume-vuejs/"')
  })

  it('contains Favicon and Apple Touch Icon links with theme-color', () => {
    expect(html).toContain('<link rel="icon" href="./favicon.ico" sizes="any"')
    expect(html).toContain('<link rel="icon" type="image/svg+xml" href="./favicon.svg"')
    expect(html).toContain('<link rel="apple-touch-icon" href="./apple-touch-icon.png"')
    expect(html).toContain('<meta name="theme-color" content="#0f172a"')
  })

  it('contains OpenGraph meta tags with absolute og:image URL', () => {
    expect(html).toContain('<meta property="og:type" content="website"')
    expect(html).toContain('<meta property="og:title"')
    expect(html).toContain('<meta property="og:description"')
    expect(html).toContain('<meta property="og:locale" content="ko_KR"')
    expect(html).toContain('<meta property="og:image" content="https://initbtn.github.io/resume-vuejs/og-image.png"')
    expect(html).toContain('<meta property="og:image:width" content="1200"')
    expect(html).toContain('<meta property="og:image:height" content="630"')
    expect(html).toContain('<meta property="og:image:alt"')
  })

  it('contains Twitter Card meta tags with twitter:image', () => {
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image"')
    expect(html).toContain('<meta name="twitter:title"')
    expect(html).toContain('<meta name="twitter:description"')
    expect(html).toContain('<meta name="twitter:image" content="https://initbtn.github.io/resume-vuejs/og-image.png"')
  })

  it('contains valid Schema.org Person JSON-LD structured data', () => {
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
    expect(jsonLdMatch).not.toBeNull()
    const jsonLdContent = jsonLdMatch![1].trim()
    const parsed = JSON.parse(jsonLdContent)
    expect(parsed['@context']).toBe('https://schema.org')
    expect(parsed['@type']).toBe('Person')
    expect(parsed.name).toBe('남성호')
    expect(parsed.jobTitle).toContain('Engineer')
    expect(parsed.url).toBe('https://initbtn.github.io/resume-vuejs/')
    expect(Array.isArray(parsed.knowsAbout)).toBe(true)
    expect(parsed.knowsAbout.length).toBeGreaterThan(0)
  })

  it('ensures all SEO public assets physically exist in public directory', () => {
    const expectedAssets = [
      'favicon.ico',
      'favicon.svg',
      'apple-touch-icon.png',
      'og-image.png',
      'robots.txt',
      'sitemap.xml'
    ]
    for (const asset of expectedAssets) {
      const assetPath = path.join(publicDir, asset)
      expect(fs.existsSync(assetPath)).toBe(true)
      const stats = fs.statSync(assetPath)
      expect(stats.size).toBeGreaterThan(0)
    }
  })
})
