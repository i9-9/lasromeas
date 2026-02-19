import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

const currency = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
}

const fulfillmentLabel: Record<string, string> = {
  pending: 'Pendiente',
  processing: 'Preparando',
  ready: 'Listo',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

const BeforeDashboard = async () => {
  let productCount = 0
  let orderCount = 0
  let totalRevenue = 0
  let pendingCount = 0
  let recentOrders: Array<{
    id: string | number
    orderNumber?: string | null
    customerName?: string | null
    total?: number | null
    paymentStatus?: string | null
    fulfillmentStatus?: string | null
    createdAt: string
  }> = []

  try {
    const payload = await getPayload({ config: configPromise })

    const [products, orders, paidOrders, pending, recent] = await Promise.all([
      payload.count({ collection: 'products' }),
      payload.count({ collection: 'orders' }),
      payload.find({
        collection: 'orders',
        where: { paymentStatus: { equals: 'paid' } },
        limit: 0,
        depth: 0,
      }),
      payload.find({
        collection: 'orders',
        where: { paymentStatus: { equals: 'pending' } },
        limit: 0,
        depth: 0,
      }),
      payload.find({
        collection: 'orders',
        sort: '-createdAt',
        limit: 5,
        depth: 0,
      }),
    ])

    productCount = products.totalDocs
    orderCount = orders.totalDocs
    pendingCount = pending.totalDocs

    const paidDocs = await payload.find({
      collection: 'orders',
      where: { paymentStatus: { equals: 'paid' } },
      limit: 500,
      depth: 0,
    })
    totalRevenue = paidDocs.docs.reduce(
      (sum, o) => sum + (typeof o.total === 'number' ? o.total : 0),
      0,
    )

    recentOrders = recent.docs.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber as string | null,
      customerName: o.customerName as string | null,
      total: typeof o.total === 'number' ? o.total : null,
      paymentStatus: o.paymentStatus as string | null,
      fulfillmentStatus: o.fulfillmentStatus as string | null,
      createdAt: o.createdAt,
    }))
  } catch {
    /* DB may not be migrated yet on first run */
  }

  return (
    <div className="lr-dashboard">
      {/* ── Header ── */}
      <div className="lr-dashboard__header">
        <div className="lr-dashboard__brand">
          <img
            src="/logo/LOGOFINAL2-300x100.png"
            alt="Las Romeas"
            className="lr-dashboard__logo"
          />
          <span className="lr-dashboard__tagline">Panel de administración</span>
        </div>
        <div className="lr-dashboard__actions">
          <a href="/admin/collections/products/create" className="lr-btn lr-btn--primary">
            + Nuevo producto
          </a>
          <a href="/admin/collections/orders" className="lr-btn lr-btn--ghost">
            Ver pedidos
          </a>
          <a href="/admin/globals/site-settings" className="lr-btn lr-btn--ghost">
            Configuración
          </a>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="lr-stats">
        <div className="lr-stat">
          <span className="lr-stat__icon">📦</span>
          <div className="lr-stat__content">
            <span className="lr-stat__value">{productCount}</span>
            <span className="lr-stat__label">Productos</span>
          </div>
        </div>
        <div className="lr-stat">
          <span className="lr-stat__icon">🧾</span>
          <div className="lr-stat__content">
            <span className="lr-stat__value">{orderCount}</span>
            <span className="lr-stat__label">Pedidos totales</span>
          </div>
        </div>
        <div className="lr-stat lr-stat--success">
          <span className="lr-stat__icon">💰</span>
          <div className="lr-stat__content">
            <span className="lr-stat__value">{currency(totalRevenue)}</span>
            <span className="lr-stat__label">Facturación</span>
          </div>
        </div>
        <div className="lr-stat lr-stat--warning">
          <span className="lr-stat__icon">⏳</span>
          <div className="lr-stat__content">
            <span className="lr-stat__value">{pendingCount}</span>
            <span className="lr-stat__label">Pendientes de pago</span>
          </div>
        </div>
      </div>

      {/* ── Recent orders ── */}
      {recentOrders.length > 0 && (
        <div className="lr-recent">
          <h3 className="lr-recent__title">Últimos pedidos</h3>
          <div className="lr-recent__table-wrap">
            <table className="lr-recent__table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Pago</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <a href={`/admin/collections/orders/${o.id}`} className="lr-recent__link">
                        {o.orderNumber ?? '—'}
                      </a>
                    </td>
                    <td>{o.customerName ?? '—'}</td>
                    <td>{o.total != null ? currency(o.total) : '—'}</td>
                    <td>
                      <span className={`lr-badge lr-badge--${o.paymentStatus ?? 'pending'}`}>
                        {statusLabel[o.paymentStatus ?? 'pending'] ?? o.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`lr-badge lr-badge--${o.fulfillmentStatus ?? 'pending'}`}>
                        {fulfillmentLabel[o.fulfillmentStatus ?? 'pending'] ?? o.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="lr-recent__date">
                      {new Date(o.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {orderCount > 5 && (
            <a href="/admin/collections/orders" className="lr-recent__more">
              Ver todos los pedidos →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default BeforeDashboard
