/**
 * Migrates all data from the local SQLite (payload.db) to MongoDB Atlas.
 *
 * Run:  node scripts/migrate-sqlite-to-mongo.mjs
 *
 * Requires: better-sqlite3, mongodb (both already installed)
 */

import Database from 'better-sqlite3'
import { MongoClient, ObjectId } from 'mongodb'
import { readFileSync } from 'fs'

const envFile = readFileSync('.env', 'utf-8')
const MONGO_URI = envFile.match(/^DATABASE_URI=(.+)$/m)?.[1]?.trim()
if (!MONGO_URI) {
  console.error('Missing DATABASE_URI in .env')
  process.exit(1)
}

const db = new Database('./payload.db', { readonly: true })

// ── Helpers ────────────────────────────────────────────────────────

const idMap = { users: {}, media: {}, categories: {}, products: {} }

function newId(collection, oldId) {
  if (!oldId) return null
  if (!idMap[collection][oldId]) idMap[collection][oldId] = new ObjectId()
  return idMap[collection][oldId]
}

function parseJson(str) {
  if (!str) return null
  try { return JSON.parse(str) } catch { return str }
}

function getSubValues(table, parentIdCol, parentId, orderCol = 'order') {
  return db.prepare(`SELECT * FROM "${table}" WHERE "${parentIdCol}" = ? ORDER BY "${orderCol}" ASC`)
    .all(parentId)
}

// ── Media transform ────────────────────────────────────────────────

function transformMedia(row) {
  return {
    _id: newId('media', row.id),
    alt: row.alt,
    caption: row.caption || undefined,
    url: row.url,
    thumbnailURL: row.thumbnail_u_r_l || null,
    filename: row.filename,
    mimeType: row.mime_type,
    filesize: row.filesize,
    width: row.width,
    height: row.height,
    focalX: row.focal_x,
    focalY: row.focal_y,
    sizes: {
      thumbnail: {
        url: row.sizes_thumbnail_url || null,
        width: row.sizes_thumbnail_width,
        height: row.sizes_thumbnail_height,
        mimeType: row.sizes_thumbnail_mime_type,
        filesize: row.sizes_thumbnail_filesize,
        filename: row.sizes_thumbnail_filename,
      },
      card: {
        url: row.sizes_card_url || null,
        width: row.sizes_card_width,
        height: row.sizes_card_height,
        mimeType: row.sizes_card_mime_type,
        filesize: row.sizes_card_filesize,
        filename: row.sizes_card_filename,
      },
      tablet: {
        url: row.sizes_tablet_url || null,
        width: row.sizes_tablet_width,
        height: row.sizes_tablet_height,
        mimeType: row.sizes_tablet_mime_type,
        filesize: row.sizes_tablet_filesize,
        filename: row.sizes_tablet_filename,
      },
      hero: {
        url: row.sizes_hero_url || null,
        width: row.sizes_hero_width,
        height: row.sizes_hero_height,
        mimeType: row.sizes_hero_mime_type,
        filesize: row.sizes_hero_filesize,
        filename: row.sizes_hero_filename,
      },
    },
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  }
}

// ── Categories transform ───────────────────────────────────────────

function transformCategory(row) {
  return {
    _id: newId('categories', row.id),
    name: row.name,
    slug: row.slug,
    image: newId('media', row.image_id),
    description: row.description || undefined,
    sortOrder: row.sort_order ?? 0,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  }
}

// ── Products transform ─────────────────────────────────────────────

function transformProduct(row) {
  const grainTypes = getSubValues('products_grain_types', 'parent_id', row.id).map(r => r.value)
  const originCountries = getSubValues('products_origin_countries', 'parent_id', row.id).map(r => r.value)
  const cacaoPercents = getSubValues('products_cacao_percents', 'parent_id', row.id).map(r => r.value)
  const chocolateTypes = getSubValues('products_chocolate_types', 'parent_id', row.id).map(r => r.value)
  const variants = getSubValues('products_variants', '_parent_id', row.id, '_order').map(r => ({
    label: r.label,
    price: r.price,
    availability: r.availability || 'in_stock',
    sku: r.sku || undefined,
    id: r.id,
  }))
  const processSteps = getSubValues('products_tech_sheet_process_steps', '_parent_id', row.id, '_order').map(r => ({
    title: r.title,
    detail: r.detail || undefined,
    id: r.id,
  }))
  const sensoryProfile = getSubValues('products_tech_sheet_sensory_profile', '_parent_id', row.id, '_order').map(r => ({
    tag: r.tag,
    id: r.id,
  }))

  return {
    _id: newId('products', row.id),
    name: row.name,
    slug: row.slug,
    shortName: row.short_name || undefined,
    subtitle: row.subtitle || undefined,
    badge: row.badge || undefined,
    category: newId('categories', row.category_id),
    price: row.price,
    currency: row.currency || 'ARS',
    image: newId('media', row.image_id),
    description: parseJson(row.description),
    availability: row.availability || 'in_stock',
    isFeatured: Boolean(row.is_featured),
    isLimited: Boolean(row.is_limited),
    grainTypes,
    originCountries,
    cacaoPercents,
    chocolateTypes,
    variants,
    techSheet: {
      originCountry: row.tech_sheet_origin_country || undefined,
      originRegion: row.tech_sheet_origin_region || undefined,
      originFarm: row.tech_sheet_origin_farm || undefined,
      originCountryCode: row.tech_sheet_origin_country_code || undefined,
      cacaoPercent: row.tech_sheet_cacao_percent || undefined,
      variety: row.tech_sheet_variety || undefined,
      batch: row.tech_sheet_batch || undefined,
      harvest: row.tech_sheet_harvest || undefined,
      ingredients: row.tech_sheet_ingredients || undefined,
      allergens: row.tech_sheet_allergens || undefined,
      sensoryProfile,
      processSteps,
    },
    seo: {
      metaTitle: row.seo_meta_title || undefined,
      metaDescription: row.seo_meta_description || undefined,
      metaImage: newId('media', row.seo_meta_image_id),
    },
    _status: row._status || 'published',
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  }
}

// ── Product versions transform ─────────────────────────────────────

function transformProductVersion(row) {
  const grainTypes = getSubValues('_products_v_version_grain_types', 'parent_id', row.id).map(r => r.value)
  const originCountries = getSubValues('_products_v_version_origin_countries', 'parent_id', row.id).map(r => r.value)
  const cacaoPercents = getSubValues('_products_v_version_cacao_percents', 'parent_id', row.id).map(r => r.value)
  const chocolateTypes = getSubValues('_products_v_version_chocolate_types', 'parent_id', row.id).map(r => r.value)
  const variants = getSubValues('_products_v_version_variants', '_parent_id', row.id, '_order').map(r => ({
    label: r.label,
    price: r.price,
    availability: r.availability || 'in_stock',
    sku: r.sku || undefined,
    id: r._uuid || r.id,
  }))
  const processSteps = getSubValues('_products_v_version_tech_sheet_process_steps', '_parent_id', row.id, '_order').map(r => ({
    title: r.title,
    detail: r.detail || undefined,
    id: r._uuid || r.id,
  }))
  const sensoryProfile = getSubValues('_products_v_version_tech_sheet_sensory_profile', '_parent_id', row.id, '_order').map(r => ({
    tag: r.tag,
    id: r._uuid || r.id,
  }))

  return {
    _id: new ObjectId(),
    parent: newId('products', row.parent_id),
    version: {
      name: row.version_name,
      slug: row.version_slug,
      shortName: row.version_short_name || undefined,
      subtitle: row.version_subtitle || undefined,
      badge: row.version_badge || undefined,
      category: newId('categories', row.version_category_id),
      price: row.version_price,
      currency: row.version_currency || 'ARS',
      image: newId('media', row.version_image_id),
      description: parseJson(row.version_description),
      availability: row.version_availability || 'in_stock',
      isFeatured: Boolean(row.version_is_featured),
      isLimited: Boolean(row.version_is_limited),
      grainTypes,
      originCountries,
      cacaoPercents,
      chocolateTypes,
      variants,
      techSheet: {
        originCountry: row.version_tech_sheet_origin_country || undefined,
        originRegion: row.version_tech_sheet_origin_region || undefined,
        originFarm: row.version_tech_sheet_origin_farm || undefined,
        originCountryCode: row.version_tech_sheet_origin_country_code || undefined,
        cacaoPercent: row.version_tech_sheet_cacao_percent || undefined,
        variety: row.version_tech_sheet_variety || undefined,
        batch: row.version_tech_sheet_batch || undefined,
        harvest: row.version_tech_sheet_harvest || undefined,
        ingredients: row.version_tech_sheet_ingredients || undefined,
        allergens: row.version_tech_sheet_allergens || undefined,
        sensoryProfile,
        processSteps,
      },
      seo: {
        metaTitle: row.version_seo_meta_title || undefined,
        metaDescription: row.version_seo_meta_description || undefined,
        metaImage: newId('media', row.version_seo_meta_image_id),
      },
      _status: row.version__status || 'published',
      updatedAt: row.version_updated_at,
      createdAt: row.version_created_at,
    },
    latest: Boolean(row.latest),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// ── Users transform ────────────────────────────────────────────────

function transformUser(row) {
  const sessions = db.prepare('SELECT * FROM users_sessions WHERE _parent_id = ? ORDER BY _order ASC').all(row.id)
  return {
    _id: newId('users', row.id),
    role: row.role,
    displayName: row.display_name || undefined,
    email: row.email,
    salt: row.salt,
    hash: row.hash,
    resetPasswordToken: row.reset_password_token || undefined,
    resetPasswordExpiration: row.reset_password_expiration || undefined,
    loginAttempts: row.login_attempts ?? 0,
    lockUntil: row.lock_until || undefined,
    _verified: true,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  }
}

// ── Main ───────────────────────────────────────────────────────────

async function migrate() {
  console.log('🔄 Starting SQLite → MongoDB Atlas migration\n')

  const client = new MongoClient(MONGO_URI)
  await client.connect()
  console.log('✓ Connected to MongoDB Atlas')

  const dbName = new URL(MONGO_URI.replace('mongodb+srv://', 'https://')).searchParams.get('appName')?.toLowerCase()
    || 'payload'
  const mongo = client.db(dbName)

  // Drop existing collections to start clean
  const existing = await mongo.listCollections().toArray()
  for (const col of existing) {
    await mongo.dropCollection(col.name)
  }
  console.log(`✓ Cleaned ${existing.length} existing collections\n`)

  // ── 1. Users ──────────────────────
  const users = db.prepare('SELECT * FROM users').all()
  if (users.length) {
    const docs = users.map(transformUser)
    await mongo.collection('users').insertMany(docs)
    console.log(`✓ Users: ${docs.length} migrated`)
  }

  // ── 2. Media ──────────────────────
  const media = db.prepare('SELECT * FROM media').all()
  if (media.length) {
    const docs = media.map(transformMedia)
    await mongo.collection('media').insertMany(docs)
    console.log(`✓ Media: ${docs.length} migrated`)
  }

  // ── 3. Categories ─────────────────
  const categories = db.prepare('SELECT * FROM categories').all()
  if (categories.length) {
    const docs = categories.map(transformCategory)
    await mongo.collection('categories').insertMany(docs)
    console.log(`✓ Categories: ${docs.length} migrated`)
  }

  // ── 4. Products ───────────────────
  const products = db.prepare('SELECT * FROM products').all()
  if (products.length) {
    const docs = products.map(transformProduct)
    await mongo.collection('products').insertMany(docs)
    console.log(`✓ Products: ${docs.length} migrated`)
  }

  // ── 5. Product versions ───────────
  const versions = db.prepare('SELECT * FROM _products_v').all()
  if (versions.length) {
    const docs = versions.map(transformProductVersion)
    await mongo.collection('_products_v').insertMany(docs)
    console.log(`✓ Product versions: ${docs.length} migrated`)
  }

  // ── 6. Payload preferences ────────
  const prefs = db.prepare('SELECT * FROM payload_preferences').all()
  const prefRels = db.prepare('SELECT * FROM payload_preferences_rels').all()
  if (prefs.length) {
    const docs = prefs.map(p => {
      const rel = prefRels.find(r => r.parent_id === p.id)
      return {
        _id: new ObjectId(),
        key: p.key,
        value: parseJson(p.value),
        updatedAt: p.updated_at,
        createdAt: p.created_at,
        ...(rel?.users_id ? { user: newId('users', rel.users_id) } : {}),
      }
    })
    await mongo.collection('payload-preferences').insertMany(docs)
    console.log(`✓ Preferences: ${docs.length} migrated`)
  }

  // ── 7. Payload migrations marker ──
  await mongo.collection('payload-migrations').insertOne({
    _id: new ObjectId(),
    migrationName: 'sqlite-to-mongodb',
    batch: 1,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  })
  console.log(`✓ Migration marker created`)

  // ── Summary ───────────────────────
  console.log('\n────────────────────────────────')
  console.log('Migration complete!')
  console.log(`  Users:      ${users.length}`)
  console.log(`  Media:      ${media.length}`)
  console.log(`  Categories: ${categories.length}`)
  console.log(`  Products:   ${products.length}`)
  console.log(`  Versions:   ${versions.length}`)
  console.log('────────────────────────────────\n')

  await client.close()
  db.close()
}

migrate().catch(e => {
  console.error('Migration failed:', e)
  process.exit(1)
})
