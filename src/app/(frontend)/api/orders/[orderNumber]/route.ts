import { NextRequest, NextResponse } from 'next/server'

const PAYLOAD_API = 'http://localhost:3000/api'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> },
) {
  try {
    const { orderNumber } = await params

    const res = await fetch(
      `${PAYLOAD_API}/orders?where[orderNumber][equals]=${encodeURIComponent(orderNumber)}&limit=1`,
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Error al buscar pedido' }, { status: 500 })
    }

    const data = await res.json()
    const order = data.docs?.[0]

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('[Orders] Error fetching order:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
