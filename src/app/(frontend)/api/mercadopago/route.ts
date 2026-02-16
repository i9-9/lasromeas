import { NextRequest, NextResponse } from 'next/server'
import { createPreference, type MercadoPagoItem } from '@/lib/mercadopago'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { items, payer, external_reference } = body as {
      items: MercadoPagoItem[]
      payer?: {
        name?: string
        surname?: string
        email: string
      }
      external_reference?: string
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere al menos un item' },
        { status: 400 },
      )
    }

    for (const item of items) {
      if (!item.title || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { error: 'Cada item requiere title, quantity y unit_price' },
          { status: 400 },
        )
      }
    }

    const preference = await createPreference({
      items,
      payer,
      external_reference,
    })

    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    })
  } catch (error) {
    console.error('[MercadoPago] Error al crear preferencia:', error)
    return NextResponse.json(
      { error: 'Error al crear la preferencia de pago' },
      { status: 500 },
    )
  }
}
