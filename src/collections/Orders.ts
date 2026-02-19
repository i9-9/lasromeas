import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Pedido', plural: 'Pedidos' },
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Tienda',
    defaultColumns: [
      'orderNumber',
      'customerName',
      'total',
      'paymentStatus',
      'fulfillmentStatus',
      'createdAt',
    ],
    description: 'Pedidos realizados desde la tienda online',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data?.orderNumber) {
          const lastOrder = await req.payload.find({
            collection: 'orders',
            sort: '-createdAt',
            limit: 1,
            depth: 0,
          })
          const lastNum =
            lastOrder.docs[0]?.orderNumber
              ? parseInt(String(lastOrder.docs[0].orderNumber).replace('LR-', ''), 10) || 0
              : 0
          data!.orderNumber = `LR-${String(lastNum + 1).padStart(5, '0')}`
        }
        return data
      },
    ],
  },
  fields: [
    /* ── Encabezado del pedido ── */
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Nº de pedido',
      admin: {
        readOnly: true,
        description: 'Se genera automáticamente (LR-00001)',
      },
    },

    /* ── Estado (sección principal bien visible) ── */
    {
      type: 'row',
      fields: [
        {
          name: 'paymentStatus',
          type: 'select',
          required: true,
          label: 'Estado de pago',
          defaultValue: 'pending',
          admin: { width: '33%' },
          options: [
            { label: 'Pendiente', value: 'pending' },
            { label: 'Pagado', value: 'paid' },
            { label: 'Fallido', value: 'failed' },
            { label: 'Reembolsado', value: 'refunded' },
          ],
        },
        {
          name: 'fulfillmentStatus',
          type: 'select',
          label: 'Preparación',
          defaultValue: 'pending',
          admin: { width: '34%' },
          options: [
            { label: 'Pendiente', value: 'pending' },
            { label: 'En preparación', value: 'processing' },
            { label: 'Listo para retirar', value: 'ready' },
            { label: 'Enviado', value: 'shipped' },
            { label: 'Entregado', value: 'delivered' },
            { label: 'Cancelado', value: 'cancelled' },
          ],
        },
        {
          name: 'paymentMethod',
          type: 'select',
          label: 'Medio de pago',
          admin: { width: '33%' },
          options: [
            { label: 'Mercado Pago', value: 'mercadopago' },
            { label: 'Payway', value: 'payway' },
            { label: 'Transferencia', value: 'transfer' },
          ],
        },
      ],
    },

    /* ── Cliente ── */
    {
      type: 'collapsible',
      label: 'Datos del cliente',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'customerName',
              type: 'text',
              required: true,
              label: 'Nombre completo',
              admin: { width: '50%' },
            },
            {
              name: 'customerEmail',
              type: 'email',
              required: true,
              label: 'Email',
              admin: { width: '50%' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'customerPhone',
              type: 'text',
              required: true,
              label: 'Teléfono',
              admin: { width: '50%' },
            },
            {
              name: 'customerDni',
              type: 'text',
              label: 'DNI / CUIT',
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },

    /* ── Envío ── */
    {
      type: 'collapsible',
      label: 'Información de envío',
      admin: { initCollapsed: false },
      fields: [
        {
          name: 'shippingMethod',
          type: 'select',
          label: 'Método de envío',
          defaultValue: 'pickup',
          options: [
            { label: 'Retiro en tienda', value: 'pickup' },
            { label: 'Envío a domicilio', value: 'delivery' },
          ],
        },
        {
          name: 'shippingAddress',
          type: 'group',
          label: 'Dirección de envío',
          admin: {
            condition: (data: Record<string, unknown>) => data.shippingMethod === 'delivery',
          },
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
      ],
    },

    /* ── Items ── */
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Productos del pedido',
      labels: { singular: 'Producto', plural: 'Productos' },
      admin: {
        initCollapsed: false,
        description: 'Productos incluidos en este pedido',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'productName', type: 'text', required: true, label: 'Nombre', admin: { width: '35%' } },
            { name: 'variantLabel', type: 'text', label: 'Variante', admin: { width: '15%' } },
            { name: 'quantity', type: 'number', required: true, label: 'Cant.', admin: { width: '10%' } },
            { name: 'unitPrice', type: 'number', required: true, label: 'Precio unit.', admin: { width: '20%' } },
            { name: 'productId', type: 'text', required: true, label: 'ID Producto', admin: { width: '20%', readOnly: true } },
          ],
        },
        { name: 'image', type: 'text', label: 'Imagen URL', admin: { readOnly: true } },
      ],
    },

    /* ── Totales ── */
    {
      type: 'collapsible',
      label: 'Totales',
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'subtotal',
              type: 'number',
              required: true,
              label: 'Subtotal',
              admin: { width: '33%', readOnly: true },
            },
            {
              name: 'shippingCost',
              type: 'number',
              defaultValue: 0,
              label: 'Costo de envío',
              admin: { width: '33%', readOnly: true },
            },
            {
              name: 'total',
              type: 'number',
              required: true,
              label: 'Total',
              admin: { width: '34%', readOnly: true },
            },
          ],
        },
      ],
    },

    /* ── Datos de pago (técnicos) ── */
    {
      type: 'collapsible',
      label: 'Datos técnicos de pago',
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'paymentId',
              type: 'text',
              label: 'ID de pago externo',
              admin: { width: '50%', readOnly: true },
            },
            {
              name: 'mpPreferenceId',
              type: 'text',
              label: 'MercadoPago Preference ID',
              admin: { width: '50%', readOnly: true },
            },
          ],
        },
      ],
    },

    /* ── Notas internas ── */
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Notas internas',
      admin: {
        description: 'Notas visibles solo para el equipo (no se muestran al cliente)',
      },
    },
  ],
}
