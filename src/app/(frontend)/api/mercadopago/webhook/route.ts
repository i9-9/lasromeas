import { NextRequest, NextResponse } from 'next/server'
import { getPayment } from '@/lib/mercadopago'

/**
 * Webhook de Mercado Pago — recibe notificaciones IPN.
 *
 * Configurar la URL de notificación en el dashboard de MP o al crear la preferencia:
 *   https://tu-dominio.com/api/mercadopago/webhook
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

      // TODO: Actualizar el estado de la orden en la base de datos
      // Ejemplo:
      // if (status === 'approved') {
      //   await updateOrderStatus(externalReference, 'paid')
      // }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('[MercadoPago Webhook] Error:', error)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}
