import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: {
    group: 'Contenido',
    description: 'Biblioteca de imágenes del sitio',
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../public/media'),
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'tablet', width: 1024, height: undefined, position: 'centre' },
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
      required: true,
      admin: {
        description: 'Describe la imagen para accesibilidad y SEO. Es obligatorio.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Epígrafe',
      admin: {
        description: 'Texto opcional que se muestra debajo de la imagen',
      },
    },
  ],
}
