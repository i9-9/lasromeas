import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

if (!accessToken) {
  console.warn(
    '[MercadoPago] MERCADOPAGO_ACCESS_TOKEN no está configurado. Los pagos con Mercado Pago no funcionarán.',
  )
}

const client = new MercadoPagoConfig({
  accessToken: accessToken ?? '',
})

export const preferenceClient = new Preference(client)
export const paymentClient = new Payment(client)

export interface MercadoPagoItem {
  id: string
  title: string
  description?: string
  picture_url?: string
  quantity: number
  unit_price: number
  currency_id?: string
}

export interface CreatePreferenceInput {
  items: MercadoPagoItem[]
  payer?: {
    name?: string
    surname?: string
    email: string
    phone?: { area_code?: string; number?: string }
    address?: { street_name?: string; street_number?: number; zip_code?: string }
  }
  external_reference?: string
  notification_url?: string
}

export async function createPreference(input: CreatePreferenceInput) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const preference = await preferenceClient.create({
    body: {
      items: input.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        picture_url: item.picture_url,
        quantity: item.quantity,
        unit_price: item.unit_price,
        currency_id: item.currency_id || 'ARS',
      })),
      payer: input.payer,
      back_urls: {
        success: `${siteUrl}/shop?payment=success`,
        failure: `${siteUrl}/shop?payment=failure`,
        pending: `${siteUrl}/shop?payment=pending`,
      },
      auto_return: 'approved',
      external_reference: input.external_reference,
      notification_url:
        input.notification_url || `${siteUrl}/api/mercadopago/webhook`,
    },
  })

  return preference
}

export async function getPayment(paymentId: string) {
  const payment = await paymentClient.get({ id: paymentId })
  return payment
}
