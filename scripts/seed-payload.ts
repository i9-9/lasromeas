/**
 * Seed script: imports products & categories into Payload CMS via REST API.
 * Requires the dev server running on localhost:3000.
 * Run: npx tsx scripts/seed-payload.ts <email> <password>
 */

import path from 'path'
import fs from 'fs'
import { PRODUCTS } from '../src/data/products'
import { CATEGORIES } from '../src/data/categories'

const BASE = 'http://localhost:3000/api'
const ROOT = process.cwd()

/** Convert plain text to Lexical rich text JSON for Payload's richText field */
function textToLexical(text: string) {
  if (!text) return undefined
  const paragraphs = text.split(/\n\n|\n/).filter(Boolean)
  return {
    root: {
      children: paragraphs.map((p) => ({
        children: [{ text: p.trim(), type: 'text', version: 1 }],
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: npx tsx scripts/seed-payload.ts <email> <password>')
  process.exit(1)
}

async function api(
  endpoint: string,
  opts: { method?: string; body?: any; token?: string; formData?: FormData } = {}
) {
  const headers: Record<string, string> = {}
  if (opts.token) headers['Authorization'] = `JWT ${opts.token}`

  let fetchOpts: RequestInit
  if (opts.formData) {
    fetchOpts = {
      method: opts.method ?? 'POST',
      headers,
      body: opts.formData,
    }
  } else if (opts.body) {
    headers['Content-Type'] = 'application/json'
    fetchOpts = {
      method: opts.method ?? 'POST',
      headers,
      body: JSON.stringify(opts.body),
    }
  } else {
    fetchOpts = { method: opts.method ?? 'GET', headers }
  }

  const res = await fetch(`${BASE}${endpoint}`, fetchOpts)
  const json = await res.json()
  if (!res.ok && res.status !== 200) {
    throw new Error(`${res.status} ${endpoint}: ${JSON.stringify(json.errors ?? json.message ?? json)}`)
  }
  return json
}

async function uploadImage(filePath: string, alt: string, token: string): Promise<number | null> {
  const absPath = path.join(ROOT, 'public', filePath)
  if (!fs.existsSync(absPath)) return null

  const fileBuffer = fs.readFileSync(absPath)
  const ext = path.extname(absPath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
    '.gif': 'image/gif', '.webp': 'image/webp',
  }

  const formData = new FormData()
  const blob = new Blob([fileBuffer], { type: mimeTypes[ext] ?? 'image/jpeg' })
  formData.append('file', blob, path.basename(absPath))
  formData.append('_payload', JSON.stringify({ alt }))

  const res = await fetch(`${BASE}/media`, {
    method: 'POST',
    headers: { 'Authorization': `JWT ${token}` },
    body: formData,
  })
  const json = await res.json()
  if (!res.ok) {
    console.log(`    upload error ${res.status}: ${JSON.stringify(json.errors ?? json.message ?? '').substring(0, 100)}`)
    return null
  }
  return json.doc?.id ?? null
}

async function seed() {
  console.log('🌱 Payload CMS Seed\n')

  // ── 1. Login ─────────────────────────────────
  console.log('Logging in...')
  const loginRes = await api('/users/login', { body: { email, password } })
  const token = loginRes.token
  if (!token) throw new Error('Login failed - check credentials')
  console.log('✓ Authenticated\n')

  // ── 2. Clear existing data ───────────────────
  console.log('Clearing existing products...')
  const existingProducts = await api('/products?limit=500', { token })
  for (const p of existingProducts.docs ?? []) {
    await api(`/products/${p.id}`, { method: 'DELETE', token })
  }

  console.log('Clearing existing categories...')
  const existingCats = await api('/categories?limit=100', { token })
  for (const c of existingCats.docs ?? []) {
    await api(`/categories/${c.id}`, { method: 'DELETE', token })
  }

  console.log('Clearing existing media...')
  let mediaDocs = (await api('/media?limit=500', { token })).docs ?? []
  while (mediaDocs.length > 0) {
    for (const m of mediaDocs) {
      await api(`/media/${m.id}`, { method: 'DELETE', token })
    }
    mediaDocs = (await api('/media?limit=500', { token })).docs ?? []
  }
  console.log('✓ Cleared\n')

  // ── 3. Create categories ─────────────────────
  console.log('Creating categories...')
  const categoryMap: Record<string, number> = {}

  for (const cat of CATEGORIES) {
    let imageId: number | null = null
    if (cat.image && !cat.image.includes('placeholder')) {
      try {
        imageId = await uploadImage(cat.image, cat.name, token)
      } catch (e: any) {
        console.log(`  ⚠ Category image failed: ${cat.name} - ${e.message}`)
      }
    }

    const res = await api('/categories', {
      token,
      body: {
        name: cat.name,
        slug: cat.slug,
        ...(imageId ? { image: imageId } : {}),
      },
    })
    categoryMap[cat.id] = res.doc.id
    console.log(`  ✓ ${cat.name}`)
  }
  console.log(`✓ ${CATEGORIES.length} categories\n`)

  // ── 4. Create products ───────────────────────
  console.log('Creating products...')
  let created = 0
  let failed = 0

  for (const product of PRODUCTS) {
    try {
      // Upload image
      let imageId: number | null = null
      try {
        imageId = await uploadImage(product.image, product.name, token)
      } catch (e: any) {
        console.log(`  ⚠ Image failed: ${product.slug}`)
      }

      const mapAvail = (a?: string) => {
        if (a === 'out of stock') return 'out_of_stock'
        if (a === 'preorder') return 'preorder'
        return 'in_stock'
      }

      const catId = categoryMap[product.categoryId]
      if (!catId) {
        console.log(`  ⚠ No category for ${product.categoryId}, skipping ${product.slug}`)
        failed++
        continue
      }

      const variants = product.variants?.map((v) => ({
        label: v.label,
        price: v.price,
        availability: mapAvail(v.availability),
      }))

      await api('/products', {
        token,
        body: {
          name: product.name,
          shortName: product.shortName,
          subtitle: product.subtitle ?? '',
          badge: product.badge ?? '',
          slug: product.slug,
          category: catId,
          price: product.price,
          currency: product.currency,
          ...(imageId ? { image: imageId } : {}),
          ...(product.description ? { description: textToLexical(product.description) } : {}),
          isFeatured: product.isFeatured ?? false,
          availability: mapAvail(product.availability),
          ...(variants && variants.length > 0 ? { variants } : {}),
          grainTypes: product.grainTypes ?? [],
          originCountries: product.originCountries ?? [],
          cacaoPercents: (product.cacaoPercents ?? []).map(String),
          chocolateTypes: product.chocolateTypes ?? [],
          isLimited: product.isLimited ?? false,
        },
      })
      created++
      if (created % 10 === 0) console.log(`  ... ${created} productos`)
    } catch (e: any) {
      console.log(`  ✗ ${product.slug}: ${e.message?.substring(0, 120)}`)
      failed++
    }
  }

  console.log(`\n✓ Done: ${created} products, ${failed} failed`)
  process.exit(0)
}

seed().catch((e) => {
  console.error('Seed error:', e.message)
  process.exit(1)
})
