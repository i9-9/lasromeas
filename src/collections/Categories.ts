import type { CollectionConfig } from 'payload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  admin: {
    useAsTitle: 'name',
    group: 'Tienda',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    description: 'Categorías de productos de la tienda',
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
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nombre',
          admin: { width: '50%' },
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'Slug',
          admin: {
            width: '50%',
            description: 'Se genera automáticamente desde el nombre. Podés editarlo.',
          },
        },
      ],
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
      admin: {
        description: 'Breve descripción para la página de la categoría',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Orden',
      defaultValue: 0,
      admin: {
        description: 'Las categorías se ordenan de menor a mayor. Usá 0, 10, 20… para dejar espacio.',
      },
    },
  ],
}
