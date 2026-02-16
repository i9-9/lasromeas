import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  /* ─── Admin ─────────────────────────────── */
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
  },

  /* ─── Collections ───────────────────────── */
  collections: [
    /* Usuarios (auth) */
    {
      slug: 'users',
      auth: true,
      labels: { singular: 'Usuario', plural: 'Usuarios' },
      admin: {
        useAsTitle: 'email',
        group: 'Admin',
      },
      fields: [],
    },

    /* Media (imágenes) */
    {
      slug: 'media',
      labels: { singular: 'Imagen', plural: 'Imágenes' },
      admin: {
        group: 'Contenido',
      },
      upload: {
        staticDir: path.join(__dirname, 'public', 'media'),
        imageSizes: [
          { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
          { name: 'card', width: 768, height: 1024, position: 'centre' },
          { name: 'hero', width: 1920, height: undefined, position: 'centre' },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
          label: 'Texto alternativo',
          admin: { description: 'Describe la imagen para accesibilidad y SEO' },
        },
      ],
    },

    /* Categorías */
    {
      slug: 'categories',
      labels: { singular: 'Categoría', plural: 'Categorías' },
      admin: {
        useAsTitle: 'name',
        group: 'Tienda',
        defaultColumns: ['name', 'slug'],
      },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Nombre' },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
          admin: { description: 'URL amigable (ej: alfajores-con-harina-de-cacao)' },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de portada',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción',
          admin: { description: 'Breve descripción para la página de la categoría' },
        },
      ],
    },

    /* Productos */
    {
      slug: 'products',
      labels: { singular: 'Producto', plural: 'Productos' },
      admin: {
        useAsTitle: 'name',
        group: 'Tienda',
        defaultColumns: ['name', 'category', 'price', 'isFeatured'],
        listSearchableFields: ['name', 'slug', 'description'],
      },
      fields: [
        /* ── Datos principales ── */
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Nombre', admin: { width: '60%' } },
            { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug', admin: { width: '40%', description: 'URL del producto' } },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
              label: 'Categoría',
              admin: { width: '40%' },
            },
            { name: 'price', type: 'number', required: true, label: 'Precio (ARS)', admin: { width: '30%' } },
            { name: 'currency', type: 'text', defaultValue: 'ARS', label: 'Moneda', admin: { width: '30%' } },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen principal',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descripción',
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Destacado en home',
          admin: { description: 'Aparece en la sección de productos destacados del home' },
        },

        /* ── Ficha técnica ── */
        {
          name: 'techSheet',
          type: 'group',
          label: 'Ficha técnica',
          admin: {
            description: 'Datos del origen, variedad y perfil sensorial del cacao',
          },
          fields: [
            {
              name: 'origin',
              type: 'group',
              label: 'Origen del cacao',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'country', type: 'text', label: 'País', admin: { width: '33%' } },
                    { name: 'region', type: 'text', label: 'Región', admin: { width: '33%' } },
                    { name: 'farm', type: 'text', label: 'Finca', admin: { width: '33%' } },
                  ],
                },
                { name: 'countryCode', type: 'text', label: 'Código país', admin: { description: 'PE, EC, NI, etc. (para mapa)' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'cacaoPercent', type: 'number', label: '% cacao', admin: { width: '33%' } },
                { name: 'variety', type: 'text', label: 'Variedad', admin: { width: '33%', description: 'Criollo, Trinitario, Forastero, etc.' } },
                { name: 'batch', type: 'text', label: 'Lote', admin: { width: '33%' } },
              ],
            },
            {
              name: 'sensoryProfile',
              type: 'array',
              label: 'Perfil sensorial',
              admin: { description: 'Etiquetas de sabor (ej: frutal, floral, ácido suave)' },
              fields: [
                { name: 'tag', type: 'text', required: true, label: 'Nota' },
              ],
            },
            {
              name: 'processSteps',
              type: 'array',
              label: 'Proceso',
              admin: { description: 'Pasos del proceso (fermentación, secado, tostado, conchado)' },
              fields: [
                { name: 'title', type: 'text', required: true, label: 'Paso' },
                { name: 'detail', type: 'text', required: true, label: 'Detalle' },
              ],
            },
          ],
        },
      ],
    },
  ],

  /* ─── Config general ────────────────────── */
  secret: process.env.PAYLOAD_SECRET || 'cambiar-en-produccion',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
    },
  }),
  sharp,
  typescript: {
    outputFile: path.join(__dirname, 'src', 'payload-types.ts'),
  },
})
