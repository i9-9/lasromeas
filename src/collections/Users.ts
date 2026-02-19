import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    description: 'Usuarios con acceso al panel de administración',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      label: 'Rol',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        description: 'Los administradores tienen acceso completo. Los editores solo pueden gestionar contenido.',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      label: 'Nombre para mostrar',
      admin: {
        description: 'Nombre que se muestra en el panel',
      },
    },
  ],
}
