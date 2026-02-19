import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configuración',
  admin: {
    group: 'Admin',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        /* ═══════════ TAB: General ═══════════ */
        {
          label: 'General',
          description: 'Información básica de la tienda',
          fields: [
            {
              name: 'storeName',
              type: 'text',
              label: 'Nombre de la tienda',
              defaultValue: 'Las Romeas',
            },
            {
              name: 'storeDescription',
              type: 'textarea',
              label: 'Descripción',
              admin: {
                description: 'Se usa en metadatos SEO del sitio',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo del sitio',
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
            },
            {
              name: 'announcement',
              type: 'group',
              label: 'Barra de anuncio',
              admin: {
                description: 'Mensaje que aparece en la parte superior del sitio',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Mostrar barra de anuncio',
                  defaultValue: false,
                },
                {
                  name: 'message',
                  type: 'text',
                  label: 'Mensaje',
                  admin: {
                    condition: (data: Record<string, unknown>) => {
                      const announcement = data.announcement as Record<string, unknown> | undefined
                      return Boolean(announcement?.enabled)
                    },
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link (opcional)',
                  admin: {
                    condition: (data: Record<string, unknown>) => {
                      const announcement = data.announcement as Record<string, unknown> | undefined
                      return Boolean(announcement?.enabled)
                    },
                  },
                },
              ],
            },
          ],
        },

        /* ═══════════ TAB: Contacto ═══════════ */
        {
          label: 'Contacto',
          description: 'Datos de contacto de la tienda',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'email',
                  label: 'Email de contacto',
                  admin: { width: '50%' },
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                  label: 'Teléfono',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'contactAddress',
              type: 'textarea',
              label: 'Dirección física',
            },
            {
              name: 'whatsapp',
              type: 'text',
              label: 'WhatsApp',
              admin: {
                description: 'Número completo con código de país (ej: +5491123456789)',
              },
            },
          ],
        },

        /* ═══════════ TAB: Redes sociales ═══════════ */
        {
          label: 'Redes sociales',
          description: 'Links a redes sociales',
          fields: [
            {
              name: 'instagram',
              type: 'text',
              label: 'Instagram',
              admin: { description: 'URL completa del perfil' },
            },
            {
              name: 'facebook',
              type: 'text',
              label: 'Facebook',
              admin: { description: 'URL completa del perfil o página' },
            },
            {
              name: 'tiktok',
              type: 'text',
              label: 'TikTok',
              admin: { description: 'URL completa del perfil' },
            },
          ],
        },

        /* ═══════════ TAB: Envíos ═══════════ */
        {
          label: 'Envíos',
          description: 'Configuración de envíos y retiros',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'shippingCostBase',
                  type: 'number',
                  label: 'Costo de envío base (ARS)',
                  defaultValue: 0,
                  admin: { width: '50%' },
                },
                {
                  name: 'freeShippingThreshold',
                  type: 'number',
                  label: 'Envío gratis desde (ARS)',
                  admin: {
                    width: '50%',
                    description: 'Dejá en 0 para desactivar envío gratis',
                  },
                },
              ],
            },
            {
              name: 'pickupAddress',
              type: 'textarea',
              label: 'Dirección de retiro',
              admin: {
                description: 'Dirección donde los clientes pueden retirar sus pedidos',
              },
            },
            {
              name: 'pickupInstructions',
              type: 'textarea',
              label: 'Instrucciones de retiro',
              admin: {
                description: 'Horarios, cómo llegar, etc.',
              },
            },
            {
              name: 'shippingNotes',
              type: 'textarea',
              label: 'Nota sobre envíos',
              admin: {
                description: 'Texto que se muestra en el checkout sobre envíos',
              },
            },
          ],
        },

        /* ═══════════ TAB: Legal ═══════════ */
        {
          label: 'Legal',
          description: 'Información legal y de facturación',
          fields: [
            {
              name: 'businessName',
              type: 'text',
              label: 'Razón social',
            },
            {
              name: 'cuit',
              type: 'text',
              label: 'CUIT',
            },
            {
              name: 'condicionIva',
              type: 'select',
              label: 'Condición ante IVA',
              options: [
                { label: 'Responsable Inscripto', value: 'ri' },
                { label: 'Monotributista', value: 'mono' },
                { label: 'Exento', value: 'exento' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
