import { NextRequest, NextResponse } from 'next/server'
import { createPaymentToken } from '@/lib/payway'

/**
 * POST /api/payway/token — Genera un token de pago (solo para testing).
 *
 * En producción, el token se genera en el front-end con el SDK JS de Payway
 * para evitar que los datos de tarjeta pasen por tu servidor.
 *
 * SDK front-end: https://github.com/payway-ar/sdk-javascript-ventaonline
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      card_number,
      card_expiration_month,
      card_expiration_year,
      security_code,
      card_holder_name,
      card_holder_identification,
    } = body as {
      card_number: string
      card_expiration_month: string
      card_expiration_year: string
      security_code: string
      card_holder_name: string
      card_holder_identification: {
        type: string
        number: string
      }
    }

    if (!card_number || !card_expiration_month || !card_expiration_year || !security_code) {
      return NextResponse.json(
        { error: 'Faltan datos de la tarjeta' },
        { status: 400 },
      )
    }

    const token = await createPaymentToken({
      card_number,
      card_expiration_month,
      card_expiration_year,
      security_code,
      card_holder_name,
      card_holder_identification,
    })

    return NextResponse.json({
      id: token.id,
      status: token.status,
      bin: token.bin,
      last_four_digits: token.last_four_digits,
      expiration_month: token.expiration_month,
      expiration_year: token.expiration_year,
    })
  } catch (error) {
    console.error('[Payway] Error al generar token:', error)
    const message =
      error instanceof Error ? error.message : 'Error al generar el token'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
