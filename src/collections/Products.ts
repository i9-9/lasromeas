import type { CollectionConfig } from 'payload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Productos' },
  versions: { drafts: true },
  admin: {
    useAsTitle: 'shortName',
    group: 'Tienda',
    defaultColumns: ['shortName', 'badge', 'category', 'price', 'availability', 'isFeatured', 'updatedAt'],
    listSearchableFields: ['name', 'shortName', 'slug', 'description', 'badge'],
    description: 'Catálogo de productos de la tienda',
    livePreview: {
      url: ({ data }) =>
        `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/shop/${data.slug ?? ''}`,
    },
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (data?.name && !data.slug) {
          data.slug = slugify(data.name)
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ═══════════ TAB: General ═══════════ */
        {
          label: 'General',
          description: 'Información principal del producto',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Nombre completo (SEO)',
                  admin: {
                    width: '60%',
                    description: 'Título completo para SEO y metadatos',
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  required: true,
                  unique: true,
                  label: 'Slug',
                  admin: {
                    width: '40%',
                    description: 'Se genera automáticamente. Podés editarlo.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'shortName',
                  type: 'text',
                  label: 'Nombre corto (UI)',
                  admin: {
                    width: '40%',
                    description: 'Ej: "70% Bagua Grande" — % primero, luego origen',
                  },
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtítulo',
                  admin: {
                    width: '35%',
                    description: 'Variedad, notas de cata, o descriptor',
                  },
                },
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Badge / Línea',
                  admin: {
                    width: '25%',
                    description: 'AMANTHEO, LAS ROMEAS, TURRÓN, etc.',
                  },
                },
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
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  label: 'Precio (ARS)',
                  min: 0,
                  admin: { width: '30%' },
                },
                {
                  name: 'currency',
                  type: 'text',
                  defaultValue: 'ARS',
                  label: 'Moneda',
                  admin: {
                    width: '30%',
                    readOnly: true,
                  },
                },
              ],
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Imagen principal',
            },
            {
              name: 'description',
              type: 'richText',
              label: 'Descripción',
              admin: {
                description: 'Descripción detallada del producto con formato enriquecido',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'availability',
                  type: 'select',
                  label: 'Disponibilidad',
                  defaultValue: 'in_stock',
                  admin: { width: '40%' },
                  options: [
                    { label: 'En stock', value: 'in_stock' },
                    { label: 'Sin stock', value: 'out_of_stock' },
                    { label: 'Pre-order', value: 'preorder' },
                  ],
                },
                {
                  name: 'isFeatured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Destacado en home',
                  admin: {
                    width: '30%',
                    description: 'Aparece en la sección de productos destacados',
                  },
                },
                {
                  name: 'isLimited',
                  type: 'checkbox',
                  label: 'Edición Limitada',
                  defaultValue: false,
                  admin: { width: '30%' },
                },
              ],
            },
          ],
        },

        /* ═══════════ TAB: Variantes ═══════════ */
        {
          label: 'Variantes',
          description: 'Diferentes presentaciones del producto (peso, unidades)',
          fields: [
            {
              name: 'variants',
              type: 'array',
              label: 'Variantes (peso/presentación)',
              labels: { singular: 'Variante', plural: 'Variantes' },
              admin: {
                description:
                  'Agregá variantes si el producto tiene distintas presentaciones. Si no, dejá vacío y se usará el precio principal.',
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      label: 'Etiqueta',
                      admin: {
                        width: '40%',
                        description: 'Ej: 100g, 250g, x 8 unidades',
                      },
                    },
                    {
                      name: 'price',
                      type: 'number',
                      required: true,
                      label: 'Precio (ARS)',
                      min: 0,
                      admin: { width: '30%' },
                    },
                    {
                      name: 'availability',
                      type: 'select',
                      label: 'Disponibilidad',
                      defaultValue: 'in_stock',
                      admin: { width: '30%' },
                      options: [
                        { label: 'En stock', value: 'in_stock' },
                        { label: 'Sin stock', value: 'out_of_stock' },
                        { label: 'Pre-order', value: 'preorder' },
                      ],
                    },
                  ],
                },
                {
                  name: 'sku',
                  type: 'text',
                  label: 'SKU',
                  admin: {
                    description: 'Código interno de referencia (opcional)',
                  },
                },
              ],
            },
          ],
        },

        /* ═══════════ TAB: Filtros ═══════════ */
        {
          label: 'Filtros',
          description: 'Clasificación para los filtros de búsqueda de la tienda',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'grainTypes',
                  type: 'select',
                  hasMany: true,
                  label: 'Granos de cacao',
                  admin: {
                    width: '50%',
                    description: 'Seleccioná una o más variedades de grano',
                    isSortable: true,
                  },
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
                  admin: {
                    width: '50%',
                    description: 'Seleccioná uno o más países de origen',
                  },
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
                  admin: {
                    width: '50%',
                    description: 'Seleccioná los porcentajes de cacao',
                  },
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
                  admin: {
                    width: '50%',
                    description: 'Seleccioná el tipo de chocolate',
                  },
                  options: [
                    { label: 'Blancos', value: 'Blancos' },
                    { label: 'Oscuros', value: 'Oscuros' },
                    { label: 'Veganos', value: 'Veganos' },
                  ],
                },
              ],
            },
          ],
        },

        /* ═══════════ TAB: Ficha técnica ═══════════ */
        {
          label: 'Ficha técnica',
          description: 'Origen, proceso y perfil sensorial del cacao',
          fields: [
            {
              name: 'techSheet',
              type: 'group',
              label: '',
              admin: { hideGutter: true },
              fields: [
                {
                  name: 'origin',
                  type: 'group',
                  label: 'Origen del cacao',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'country', type: 'text', label: 'País', admin: { width: '25%' } },
                        { name: 'region', type: 'text', label: 'Región', admin: { width: '25%' } },
                        { name: 'farm', type: 'text', label: 'Finca / Cooperativa', admin: { width: '25%' } },
                        {
                          name: 'countryCode',
                          type: 'text',
                          label: 'Código país',
                          admin: { width: '25%', description: 'PE, EC, NI, etc.' },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'cacaoPercent', type: 'number', label: '% cacao', min: 0, max: 100, admin: { width: '25%' } },
                    {
                      name: 'variety',
                      type: 'text',
                      label: 'Variedad',
                      admin: { width: '25%', description: 'Criollo, Trinitario, Forastero, etc.' },
                    },
                    { name: 'batch', type: 'text', label: 'Lote', admin: { width: '25%' } },
                    { name: 'harvest', type: 'text', label: 'Cosecha', admin: { width: '25%', description: 'Ej: Mayo 2024' } },
                  ],
                },
                {
                  name: 'sensoryProfile',
                  type: 'array',
                  label: 'Perfil sensorial',
                  labels: { singular: 'Nota', plural: 'Notas' },
                  admin: {
                    description: 'Etiquetas de sabor (ej: frutal, floral, ácido suave)',
                    initCollapsed: true,
                  },
                  fields: [
                    { name: 'tag', type: 'text', required: true, label: 'Nota de sabor' },
                  ],
                },
                {
                  name: 'processSteps',
                  type: 'array',
                  label: 'Proceso de elaboración',
                  labels: { singular: 'Paso', plural: 'Pasos' },
                  admin: {
                    description: 'Pasos del proceso (fermentación, secado, tostado, conchado)',
                    initCollapsed: true,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'title', type: 'text', required: true, label: 'Paso', admin: { width: '30%' } },
                        { name: 'detail', type: 'text', required: true, label: 'Detalle', admin: { width: '70%' } },
                      ],
                    },
                  ],
                },
                {
                  name: 'ingredients',
                  type: 'textarea',
                  label: 'Ingredientes',
                  admin: {
                    description: 'Lista de ingredientes completa',
                  },
                },
                {
                  name: 'allergens',
                  type: 'textarea',
                  label: 'Alérgenos',
                  admin: {
                    description: 'Información sobre alérgenos (leche, frutos secos, etc.)',
                  },
                },
              ],
            },
          ],
        },

        /* ═══════════ TAB: SEO ═══════════ */
        {
          label: 'SEO',
          description: 'Metadatos para buscadores y redes sociales',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: '',
              admin: { hideGutter: true },
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Meta título',
                  admin: {
                    description:
                      'Título para Google y redes sociales. Si está vacío, se usa el nombre del producto. Máximo ~60 caracteres.',
                  },
                  maxLength: 70,
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Meta descripción',
                  admin: {
                    description:
                      'Descripción para Google. Si está vacía, se toma del campo descripción. Máximo ~155 caracteres.',
                  },
                  maxLength: 170,
                },
                {
                  name: 'metaImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Imagen para redes sociales (OG)',
                  admin: {
                    description: 'Si está vacía, se usa la imagen principal del producto.',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
