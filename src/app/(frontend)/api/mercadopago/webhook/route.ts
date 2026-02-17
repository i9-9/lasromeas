import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/mercadopago'

const PAYLOAD_API = 'http://localhost:3000/api'

/**
 * Webhook de Mercado Pago — recibe notificaciones IPN.
 * Actualiza el estado de pago de la orden correspondiente.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type === 'payment') {
      const paymentId = body.data?.id

      if (!paymentId) {
        return NextResponse.json({ received: true }, { status: 200 })
      }

      const payment = await getPayment(String(paymentId))

      const status = payment.status
      const externalReference = payment.external_reference

      console.log(
        `[MercadoPago Webhook] Pago ${paymentId} — estado: ${status}, ref: ${externalReference}`,
      )

      if (externalReference) {
        // Find order by orderNumber (external_reference)
        const searchRes = await fetch(
          `${PAYLOAD_API}/orders?where[orderNumber][equals]=${encodeURIComponent(externalReference)}&limit=1`,
        )

        if (searchRes.ok) {
          const searchData = await searchRes.json()
          const order = searchData.docs?.[0]

          if (order) {
            // Map MP status to our paymentStatus
            let paymentStatus: string = order.paymentStatus
            if (status === 'approved') paymentStatus = 'paid'
            else if (status === 'rejected' || status === 'cancelled') paymentStatus = 'failed'
            else if (status === 'refunded') paymentStatus = 'refunded'

            // Update order
            await fetch(`${PAYLOAD_API}/orders/${order.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentStatus,
                paymentId: String(paymentId),
              }),
            })

            console.log(
              `[MercadoPago Webhook] Orden ${externalReference} actualizada → ${paymentStatus}`,
            )
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[MercadoPago Webhook] Error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
