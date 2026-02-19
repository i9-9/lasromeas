import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { Categories } from './src/collections/Categories'
import { Products } from './src/collections/Products'
import { Orders } from './src/collections/Orders'
import { SiteSettings } from './src/globals/SiteSettings'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  /* ─── Editor de texto enriquecido ────────── */
  editor: lexicalEditor(),

  /* ─── Admin ──────────────────────────────── */
  admin: {
    meta: {
      titleSuffix: ' – Las Romeas',
      icons: [{ url: '/favicon.ico' }],
    },
    components: {
      graphics: {
        Logo: '/src/components/admin/Logo',
        Icon: '/src/components/admin/Icon',
      },
      beforeDashboard: ['/src/components/admin/BeforeDashboard'],
    },
    dateFormat: 'dd/MM/yyyy HH:mm',
  },

  /* ─── Collections ────────────────────────── */
  collections: [Users, Media, Categories, Products, Orders],

  /* ─── Globals ────────────────────────────── */
  globals: [SiteSettings],

  /* ─── Config general ─────────────────────── */
  secret: process.env.PAYLOAD_SECRET || 'cambiar-en-produccion',
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  typescript: {
    outputFile: path.join(__dirname, 'src', 'payload-types.ts'),
  },
})
