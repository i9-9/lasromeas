/**
 * Cliente REST para Payway (Decidir) - Argentina
 *
 * Payway usa un flujo de 2 pasos:
 *   1. Front-end: se genera un token de pago con la public key (datos sensibles de tarjeta)
 *   2. Back-end: se ejecuta el pago con la private key usando el token generado
 *
 * Docs: https://decidir.api-docs.io/1.0/guia-de-inicio/
 */

type PaywayEnvironment = 'developer' | 'production'

const PAYWAY_URLS: Record<PaywayEnvironment, string> = {
  developer: 'https://developers.decidir.com/api/v2',
  production: 'https://live.decidir.com/api/v2',
}

function getConfig() {
  const publicKey = process.env.PAYWAY_PUBLIC_KEY ?? ''
  const privateKey = process.env.PAYWAY_PRIVATE_KEY ?? ''
  const environment: PaywayEnvironment =
    (process.env.PAYWAY_ENVIRONMENT as PaywayEnvironment) || 'developer'
  const baseUrl = PAYWAY_URLS[environment]

  if (!publicKey || !privateKey) {
    console.warn(
      '[Payway] PAYWAY_PUBLIC_KEY o PAYWAY_PRIVATE_KEY no están configurados. Los pagos con Payway no funcionarán.',
    )
  }

  return { publicKey, privateKey, environment, baseUrl }
}

async function paywayFetch<T>(
  endpoint: string,
  options: {
    method?: string
    body?: unknown
    apiKey: string
  },
): Promise<T> {
  const { baseUrl } = getConfig()
  const url = `${baseUrl}${endpoint}`

  const response = await fetch(url, {
    method: options.method || 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: options.apiKey,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(
      `Payway API error ${response.status}: ${errorBody}`,
    )
  }

  return response.json() as Promise<T>
}

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export interface PaywayTokenResponse {
  id: string
  status: string
  card_number_length: number
  date_created: string
  bin: string
  last_four_digits: string
  security_code_length: number
  expiration_month: number
  expiration_year: number
  date_due: string
  cardholder: {
    identification: { type: string; number: string }
    name: string
  }
}

export interface PaywayPaymentRequest {
  site_transaction_id: string
  token: string
  user_id?: string
  payment_method_id: number
  bin: string
  amount: number
  currency: string
  installments: number
  description?: string
  payment_type: 'single' | 'distributed'
  sub_payments?: Array<{
    site_id: string
    installments: number
    amount: number
  }>
  establishment_name?: string
}

export interface PaywayPaymentResponse {
  id: number
  site_transaction_id: string
  payment_method_id: number
  card_brand: string
  amount: number
  currency: string
  status: 'approved' | 'rejected' | 'review' | 'pre_approved'
  status_details: {
    ticket: string
    card_authorization_code: string
    address_validation_code: string | null
    error: unknown
  }
  date: string
  customer: unknown
  bin: string
  installments: number
  first_installment_expiration_date: string | null
  payment_type: string
  sub_payments: unknown[]
  site_id: string
  fraud_detection: unknown
  aggregate_data: unknown
  establishment_name: string | null
  spv: unknown
  confirmed: unknown
  pan: string | null
  customer_token: string | null
  card_data: string
  token: string
}

export interface PaywayRefundResponse {
  id: number
  amount: number
  sub_payments: unknown
  status: string
}

/* ------------------------------------------------------------------ */
/*  Funciones públicas                                                 */
/* ------------------------------------------------------------------ */

/**
 * Genera un token de pago (server-side, para pruebas).
 * En producción, el token se genera en el front-end con el SDK JS de Payway.
 */
export async function createPaymentToken(cardData: {
  card_number: string
  card_expiration_month: string
  card_expiration_year: string
  security_code: string
  card_holder_name: string
  card_holder_identification: {
    type: string
    number: string
  }
}): Promise<PaywayTokenResponse> {
  const { publicKey } = getConfig()

  return paywayFetch<PaywayTokenResponse>('/tokens', {
    method: 'POST',
    apiKey: publicKey,
    body: cardData,
  })
}

/**
 * Ejecuta un pago usando un token previamente generado.
 */
export async function executePayment(
  payment: PaywayPaymentRequest,
): Promise<PaywayPaymentResponse> {
  const { privateKey } = getConfig()

  return paywayFetch<PaywayPaymentResponse>('/payments', {
    method: 'POST',
    apiKey: privateKey,
    body: payment,
  })
}

/**
 * Obtiene la información de un pago.
 */
export async function getPaymentInfo(
  paymentId: number,
): Promise<PaywayPaymentResponse> {
  const { privateKey } = getConfig()

  return paywayFetch<PaywayPaymentResponse>(`/payments/${paymentId}`, {
    method: 'GET',
    apiKey: privateKey,
  })
}

/**
 * Lista todos los pagos (con paginación).
 */
export async function listPayments(params?: {
  offset?: number
  pageSize?: number
  siteOperationId?: string
  siteId?: string
}): Promise<{ results: PaywayPaymentResponse[]; paging: unknown }> {
  const { privateKey } = getConfig()
  const query = new URLSearchParams()

  if (params?.offset) query.set('offset', String(params.offset))
  if (params?.pageSize) query.set('pageSize', String(params.pageSize))
  if (params?.siteOperationId)
    query.set('siteOperationId', params.siteOperationId)
  if (params?.siteId) query.set('siteId', params.siteId)

  const qs = query.toString() ? `?${query.toString()}` : ''

  return paywayFetch(`/payments${qs}`, {
    method: 'GET',
    apiKey: privateKey,
  })
}

/**
 * Devolución total de un pago.
 */
export async function refundPayment(
  paymentId: number,
): Promise<PaywayRefundResponse> {
  const { privateKey } = getConfig()

  return paywayFetch<PaywayRefundResponse>(
    `/payments/${paymentId}/refunds`,
    {
      method: 'POST',
      apiKey: privateKey,
    },
  )
}

/**
 * Devolución parcial de un pago.
 */
export async function partialRefund(
  paymentId: number,
  amount: number,
): Promise<PaywayRefundResponse> {
  const { privateKey } = getConfig()

  return paywayFetch<PaywayRefundResponse>(
    `/payments/${paymentId}/refunds`,
    {
      method: 'POST',
      apiKey: privateKey,
      body: { amount },
    },
  )
}

/**
 * Health check de la API de Payway.
 */
export async function healthCheck(): Promise<{ status: string }> {
  const { privateKey } = getConfig()

  return paywayFetch<{ status: string }>('/healthcheck', {
    method: 'GET',
    apiKey: privateKey,
  })
}
