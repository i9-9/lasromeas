import { NextRequest, NextResponse } from 'next/server'
import { createPreference } from '@/lib/mercadopago'
import { createPaymentToken, executePayment } from '@/lib/payway'

const PAYLOAD_API = 'http://localhost:3000/api'

function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LR-${date}-${rand}`
}

interface OrderItem {
  productId: string
  productName: string
  variantLabel?: string
  quantity: number
  unitPrice: number
  image?: string
}

interface CardData {
  number: string
  expMonth: string
  expYear: string
  cvv: string
  holderName: string
  dni: string
  brand: string
}

interface CreateOrderBody {
  customer: {
    name: string
    email: string
    phone: string
    dni?: string
  }
  shippingMethod: 'pickup' | 'delivery'
  shippingAddress?: {
    street: string
    city: string
    province: string
    zipCode: string
  }
  notes?: string
  paymentMethod?: 'mercadopago' | 'card'
  items: OrderItem[]
  card?: CardData
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderBody = await request.json()
    const paymentMethod = body.paymentMethod ?? 'mercadopago'

    // Validate required fields
    if (!body.customer?.name || !body.customer?.email || !body.customer?.phone) {
      return NextResponse.json(
        { error: 'Nombre, email y teléfono son obligatorios' },
        { status: 400 },
      )
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 },
      )
    }

    if (body.shippingMethod === 'delivery') {
      const addr = body.shippingAddress
      if (!addr?.street || !addr?.city || !addr?.province || !addr?.zipCode) {
        return NextResponse.json(
          { error: 'Dirección de envío incompleta' },
          { status: 400 },
        )
      }
    }

    if (paymentMethod === 'card' && !body.card) {
      return NextResponse.json(
        { error: 'Datos de tarjeta requeridos' },
        { status: 400 },
      )
    }

    // Calculate totals
    const subtotal = body.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const shippingCost = 0
    const total = subtotal + shippingCost
    const orderNumber = generateOrderNumber()

    // Create order in Payload CMS
    const orderPayload: Record<string, unknown> = {
      orderNumber,
      customerName: body.customer.name,
      customerEmail: body.customer.email,
      customerPhone: body.customer.phone,
      customerDni: body.customer.dni || '',
      shippingMethod: body.shippingMethod,
      notes: body.notes || '',
      items: body.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        variantLabel: item.variantLabel || '',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        image: item.image || '',
      })),
      subtotal,
      shippingCost,
      total,
      paymentStatus: 'pending',
      paymentMethod: paymentMethod === 'card' ? 'payway' : 'mercadopago',
      fulfillmentStatus: 'pending',
    }

    if (body.shippingMethod === 'delivery' && body.shippingAddress) {
      orderPayload.shippingAddress = body.shippingAddress
    }

    const orderRes = await fetch(`${PAYLOAD_API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })

    if (!orderRes.ok) {
      const errData = await orderRes.json().catch(() => ({}))
      console.error('[Orders] Failed to create order:', errData)
      return NextResponse.json(
        { error: 'Error al crear el pedido' },
        { status: 500 },
      )
    }

    const orderDoc = await orderRes.json()
    const orderId = orderDoc.doc?.id

    /* ─── MercadoPago flow ────────────────────── */
    if (paymentMethod === 'mercadopago') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const mpItems = body.items.map((item, idx) => ({
        id: `${item.productId}-${idx}`,
        title: item.productName + (item.variantLabel ? ` (${item.variantLabel})` : ''),
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: 'ARS' as const,
      }))

      const preference = await createPreference({
        items: mpItems,
        payer: {
          name: body.customer.name.split(' ')[0],
          surname: body.customer.name.split(' ').slice(1).join(' ') || '',
          email: body.customer.email,
          phone: { number: body.customer.phone },
        },
        external_reference: orderNumber,
        notification_url: `${siteUrl}/api/mercadopago/webhook`,
      })

      if (preference.id) {
        await fetch(`${PAYLOAD_API}/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mpPreferenceId: preference.id }),
        })
      }

      return NextResponse.json({
        orderId,
        orderNumber,
        total,
        init_point: preference.init_point,
        sandbox_init_point: preference.sandbox_init_point,
      })
    }

    /* ─── Payway (card) flow ──────────────────── */
    if (paymentMethod === 'card' && body.card) {
      try {
        // Step 1: Tokenize card
        const tokenRes = await createPaymentToken({
          card_number: body.card.number,
          card_expiration_month: body.card.expMonth,
          card_expiration_year: body.card.expYear,
          security_code: body.card.cvv,
          card_holder_name: body.card.holderName,
          card_holder_identification: {
            type: 'dni',
            number: body.card.dni,
          },
        })

        // Step 2: Execute payment
        const brandMap: Record<string, number> = {
          Visa: 1, Mastercard: 15, Amex: 65, Diners: 8, Discover: 22,
        }

        const paymentRes = await executePayment({
          site_transaction_id: orderNumber,
          token: tokenRes.id,
          payment_method_id: brandMap[body.card.brand] ?? 1,
          bin: tokenRes.bin,
          amount: total,
          currency: 'ARS',
          installments: 1,
          description: `Pedido ${orderNumber} - Las Romeas`,
          payment_type: 'single',
        })

        // Step 3: Update order with payment result
        let paymentStatus = 'pending'
        if (paymentRes.status === 'approved' || paymentRes.status === 'pre_approved') {
          paymentStatus = 'paid'
        } else if (paymentRes.status === 'rejected') {
          paymentStatus = 'failed'
        }

        await fetch(`${PAYLOAD_API}/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentStatus,
            paymentId: String(paymentRes.id),
          }),
        })

        if (paymentStatus === 'failed') {
          return NextResponse.json({
            orderId,
            orderNumber,
            total,
            paymentStatus: 'failed',
            error: 'El pago fue rechazado. Verificá los datos de tu tarjeta e intentá nuevamente.',
          }, { status: 402 })
        }

        return NextResponse.json({
          orderId,
          orderNumber,
          total,
          paymentStatus,
        })
      } catch (payError) {
        console.error('[Orders] Payway payment error:', payError)

        // Update order as failed
        await fetch(`${PAYLOAD_API}/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentStatus: 'failed' }),
        })

        const msg = payError instanceof Error ? payError.message : 'Error al procesar el pago con tarjeta'
        return NextResponse.json({
          orderId,
          orderNumber,
          total,
          paymentStatus: 'failed',
          error: msg,
        }, { status: 402 })
      }
    }

    return NextResponse.json({ orderId, orderNumber, total })
  } catch (error) {
    console.error('[Orders] Error:', error)
    return NextResponse.json(
      { error: 'Error interno al procesar el pedido' },
      { status: 500 },
    )
  }
}
