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
            { name: 'name', type: 'text', required: true, label: 'Nombre completo (SEO)', admin: { width: '60%', description: 'Título completo para SEO y metadatos' } },
            { name: 'slug', type: 'text', required: true, unique: true, label: 'Slug', admin: { width: '40%', description: 'URL del producto' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'shortName', type: 'text', label: 'Nombre corto (UI)', admin: { width: '40%', description: 'Ej: "70% Bagua Grande" — % primero, luego origen' } },
            { name: 'subtitle', type: 'text', label: 'Subtítulo', admin: { width: '35%', description: 'Variedad, notas de cata, o descriptor' } },
            { name: 'badge', type: 'text', label: 'Badge / Línea', admin: { width: '25%', description: 'AMANTHEO, LAS ROMEAS, TURRÓN, etc.' } },
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
        {
          name: 'availability',
          type: 'select',
          label: 'Disponibilidad',
          defaultValue: 'in_stock',
          options: [
            { label: 'En stock', value: 'in_stock' },
            { label: 'Sin stock', value: 'out_of_stock' },
            { label: 'Pre-order', value: 'preorder' },
          ],
        },
        {
          name: 'variants',
          type: 'array',
          label: 'Variantes (peso/presentación)',
          admin: { description: 'Si el producto tiene distintas presentaciones (ej: 100g, 250g, 500g)' },
          fields: [
            { name: 'label', type: 'text', required: true, label: 'Etiqueta (ej: 100g, x 8u)' },
            { name: 'price', type: 'number', required: true, label: 'Precio (ARS)' },
            {
              name: 'availability',
              type: 'select',
              label: 'Disponibilidad',
              defaultValue: 'in_stock',
              options: [
                { label: 'En stock', value: 'in_stock' },
                { label: 'Sin stock', value: 'out_of_stock' },
                { label: 'Pre-order', value: 'preorder' },
              ],
            },
          ],
        },

        /* ── Filtros de búsqueda ── */
        {
          type: 'row',
          fields: [
            {
              name: 'grainTypes',
              type: 'select',
              hasMany: true,
              label: 'Granos de cacao',
              admin: { width: '50%', description: 'Seleccioná una o más variedades de grano' },
              options: [
                { label: 'Amelonado', value: 'Amelonado' },
                { label: 'Bellavista', value: 'Bellavista' },
                { label: 'Blanco de Piura', value: 'Blanco de Piura' },
                { label: 'CRA / Mix Aromático', value: 'CRA / Mix Aromático' },
                { label: 'Catongo', value: 'Catongo' },
                { label: 'CCN51', value: 'CCN51' },
                { label: 'Chuncho Cáscara de Huevo', value: 'Chuncho Cáscara de Huevo' },
                { label: 'Chuncho Punta de Lanza', value: 'Chuncho Punta de Lanza' },
                { label: 'Chuncho Señorita', value: 'Chuncho Señorita' },
                { label: 'Criollos Modernos', value: 'Criollos Modernos' },
                { label: 'Kriskawas', value: 'Kriskawas' },
                { label: 'Krislala', value: 'Krislala' },
                { label: 'Mix de Chunchos', value: 'Mix de Chunchos' },
                { label: 'Nacional', value: 'Nacional' },
                { label: 'Nacional del Marañón', value: 'Nacional del Marañón' },
                { label: 'Nativo Amazónico', value: 'Nativo Amazónico' },
                { label: 'Ocumare / Chuao', value: 'Ocumare / Chuao' },
                { label: 'Silvestre', value: 'Silvestre' },
                { label: 'Theobroma Bicolor', value: 'Theobroma Bicolor' },
                { label: 'Trinitario', value: 'Trinitario' },
              ],
            },
            {
              name: 'originCountries',
              type: 'select',
              hasMany: true,
              label: 'Países de origen',
              admin: { width: '50%', description: 'Seleccioná uno o más países de origen' },
              options: [
                { label: 'Bolivia', value: 'Bolivia' },
                { label: 'Brasil', value: 'Brasil' },
                { label: 'Colombia', value: 'Colombia' },
                { label: 'Ecuador', value: 'Ecuador' },
                { label: 'Guinea Ecuatorial', value: 'Guinea Ecuatorial' },
                { label: 'Honduras', value: 'Honduras' },
                { label: 'Nicaragua', value: 'Nicaragua' },
                { label: 'Perú', value: 'Perú' },
                { label: 'Venezuela', value: 'Venezuela' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'cacaoPercents',
              type: 'select',
              hasMany: true,
              label: '% de cacao',
              admin: { width: '33%', description: 'Seleccioná los porcentajes de cacao' },
              options: [
                { label: '40%', value: '40' },
                { label: '42%', value: '42' },
                { label: '47%', value: '47' },
                { label: '60%', value: '60' },
                { label: '70%', value: '70' },
                { label: '72%', value: '72' },
                { label: '75%', value: '75' },
                { label: '80%', value: '80' },
                { label: '90%', value: '90' },
                { label: '100%', value: '100' },
              ],
            },
            {
              name: 'chocolateTypes',
              type: 'select',
              hasMany: true,
              label: 'Tipo de chocolate',
              admin: { width: '34%', description: 'Seleccioná el tipo de chocolate' },
              options: [
                { label: 'Blancos', value: 'Blancos' },
                { label: 'Oscuros', value: 'Oscuros' },
                { label: 'Veganos', value: 'Veganos' },
              ],
            },
            {
              name: 'isLimited',
              type: 'checkbox',
              label: 'Edición Limitada',
              defaultValue: false,
              admin: { width: '33%' },
            },
          ],
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
    /* Pedidos */
    {
      slug: 'orders',
      labels: { singular: 'Pedido', plural: 'Pedidos' },
      admin: {
        useAsTitle: 'orderNumber',
        group: 'Tienda',
        defaultColumns: ['orderNumber', 'customerName', 'total', 'paymentStatus', 'createdAt'],
      },
      fields: [
        { name: 'orderNumber', type: 'text', required: true, unique: true, label: 'Nº de pedido', admin: { readOnly: true } },
        /* ── Cliente ── */
        {
          type: 'row',
          fields: [
            { name: 'customerName', type: 'text', required: true, label: 'Nombre completo', admin: { width: '50%' } },
            { name: 'customerEmail', type: 'email', required: true, label: 'Email', admin: { width: '50%' } },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'customerPhone', type: 'text', required: true, label: 'Teléfono', admin: { width: '40%' } },
            { name: 'customerDni', type: 'text', label: 'DNI / CUIT', admin: { width: '30%' } },
            { name: 'shippingMethod', type: 'select', label: 'Envío', defaultValue: 'pickup', admin: { width: '30%' }, options: [
              { label: 'Retiro en tienda', value: 'pickup' },
              { label: 'Envío a domicilio', value: 'delivery' },
            ] },
          ],
        },
        {
          name: 'shippingAddress',
          type: 'group',
          label: 'Dirección de envío',
          admin: { condition: (data: Record<string, unknown>) => data.shippingMethod === 'delivery' },
          fields: [
            { name: 'street', type: 'text', label: 'Dirección' },
            {
              type: 'row',
              fields: [
                { name: 'city', type: 'text', label: 'Localidad', admin: { width: '40%' } },
                { name: 'province', type: 'text', label: 'Provincia', admin: { width: '30%' } },
                { name: 'zipCode', type: 'text', label: 'CP', admin: { width: '30%' } },
              ],
            },
          ],
        },
        { name: 'notes', type: 'textarea', label: 'Notas del cliente' },
        /* ── Items ── */
        {
          name: 'items',
          type: 'array',
          required: true,
          label: 'Productos',
          fields: [
            { name: 'productId', type: 'text', required: true, label: 'Product ID' },
            { name: 'productName', type: 'text', required: true, label: 'Nombre' },
            { name: 'variantLabel', type: 'text', label: 'Variante' },
            { name: 'quantity', type: 'number', required: true, label: 'Cantidad' },
            { name: 'unitPrice', type: 'number', required: true, label: 'Precio unitario' },
            { name: 'image', type: 'text', label: 'Imagen URL' },
          ],
        },
        /* ── Totales ── */
        {
          type: 'row',
          fields: [
            { name: 'subtotal', type: 'number', required: true, label: 'Subtotal', admin: { width: '33%' } },
            { name: 'shippingCost', type: 'number', defaultValue: 0, label: 'Costo de envío', admin: { width: '33%' } },
            { name: 'total', type: 'number', required: true, label: 'Total', admin: { width: '34%' } },
          ],
        },
        /* ── Pago ── */
        {
          type: 'row',
          fields: [
            { name: 'paymentStatus', type: 'select', required: true, label: 'Estado de pago', defaultValue: 'pending', admin: { width: '33%' }, options: [
              { label: 'Pendiente', value: 'pending' },
              { label: 'Pagado', value: 'paid' },
              { label: 'Fallido', value: 'failed' },
              { label: 'Reembolsado', value: 'refunded' },
            ] },
            { name: 'paymentMethod', type: 'select', label: 'Medio de pago', admin: { width: '33%' }, options: [
              { label: 'Mercado Pago', value: 'mercadopago' },
              { label: 'Payway', value: 'payway' },
              { label: 'Transferencia', value: 'transfer' },
            ] },
            { name: 'paymentId', type: 'text', label: 'ID de pago externo', admin: { width: '34%', readOnly: true } },
          ],
        },
        { name: 'mpPreferenceId', type: 'text', label: 'MercadoPago Preference ID', admin: { readOnly: true } },
        /* ── Estado de fulfillment ── */
        {
          name: 'fulfillmentStatus',
          type: 'select',
          label: 'Estado de preparación',
          defaultValue: 'pending',
          options: [
            { label: 'Pendiente', value: 'pending' },
            { label: 'En preparación', value: 'processing' },
            { label: 'Listo', value: 'ready' },
            { label: 'Enviado', value: 'shipped' },
            { label: 'Entregado', value: 'delivered' },
            { label: 'Cancelado', value: 'cancelled' },
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
