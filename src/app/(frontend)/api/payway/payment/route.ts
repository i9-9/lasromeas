import { NextRequest, NextResponse } from 'next/server'
import {
  executePayment,
  getPaymentInfo,
  type PaywayPaymentRequest,
} from '@/lib/payway'

/**
 * POST /api/payway/payment — Ejecuta un pago con Payway usando un token.
 *
 * El token se genera en el front-end con el SDK JS de Payway:
 *   https://github.com/payway-ar/sdk-javascript-ventaonline
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PaywayPaymentRequest

    if (!body.token) {
      return NextResponse.json(
        { error: 'Se requiere un token de pago' },
        { status: 400 },
      )
    }

    if (!body.site_transaction_id) {
      return NextResponse.json(
        { error: 'Se requiere site_transaction_id' },
        { status: 400 },
      )
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { error: 'Se requiere un monto válido' },
        { status: 400 },
      )
    }

    const paymentData: PaywayPaymentRequest = {
      site_transaction_id: body.site_transaction_id,
      token: body.token,
      user_id: body.user_id,
      payment_method_id: body.payment_method_id,
      bin: body.bin,
      amount: body.amount,
      currency: body.currency || 'ARS',
      installments: body.installments || 1,
      description: body.description,
      payment_type: body.payment_type || 'single',
      sub_payments: body.sub_payments || [],
    }

    const result = await executePayment(paymentData)

    return NextResponse.json(result)
  } catch (error) {
    console.error('[Payway] Error al ejecutar pago:', error)
    const message =
      error instanceof Error ? error.message : 'Error al procesar el pago'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

/**
 * GET /api/payway/payment?id=123 — Consulta el estado de un pago.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const paymentId = searchParams.get('id')

    if (!paymentId) {
      return NextResponse.json(
        { error: 'Se requiere el parámetro id' },
        { status: 400 },
      )
    }

    const payment = await getPaymentInfo(Number(paymentId))

    return NextResponse.json(payment)
  } catch (error) {
    console.error('[Payway] Error al consultar pago:', error)
    const message =
      error instanceof Error ? error.message : 'Error al consultar el pago'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
