import crypto from 'node:crypto'
import { env } from '../../config/env.js'

const CREEM_API_BASE = env.creem.testMode
  ? 'https://test-api.creem.io'
  : 'https://api.creem.io'

function isPlaceholder(value, marker) {
  return !value || value.includes('REPLACE_ME') || value === marker
}

function getProductId(input = {}) {
  if (input.productId) return input.productId
  if (input.planId && env.creem.products[input.planId]) {
    return env.creem.products[input.planId]
  }
  return env.creem.productId
}

export function isCreemConfigured(productId = env.creem.productId) {
  return (
    !isPlaceholder(env.creem.apiKey, 'creem_test_REPLACE_ME') &&
    !isPlaceholder(productId, 'prod_REPLACE_ME')
  )
}

function toCheckoutPayload(input = {}) {
  const productId = getProductId(input)
  const payload = {
    product_id: productId,
    success_url: input.successUrl || env.creem.successUrl,
  }

  if (input.requestId) payload.request_id = input.requestId
  if (input.discountCode) payload.discount_code = input.discountCode
  if (input.units) payload.units = input.units
  if (input.customer?.email) payload.customer = { email: input.customer.email }
  if (input.metadata) payload.metadata = input.metadata

  return payload
}

export async function createCheckout(input = {}) {
  const payload = toCheckoutPayload(input)

  if (!isCreemConfigured(payload.product_id)) {
    return {
      id: 'ch_placeholder',
      checkout_url: env.creem.placeholderCheckoutUrl,
      product_id: payload.product_id,
      status: 'placeholder',
      placeholder: true,
      message: 'Replace CREEM_API_KEY and the selected CREEM_PRODUCT_*_ID in server/.env to create real checkouts.',
    }
  }

  const response = await fetch(`${CREEM_API_BASE}/v1/checkouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.creem.apiKey,
    },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const error = new Error(
      Array.isArray(data?.message)
        ? data.message.join(' ')
        : data?.message || 'Creem checkout creation failed.',
    )
    error.status = response.status >= 500 ? 502 : response.status
    error.details = {
      traceId: data?.trace_id,
      providerStatus: response.status,
    }
    throw error
  }

  return data
}

export function verifyWebhookSignature(rawBody, signature) {
  if (
    isPlaceholder(env.creem.webhookSecret, 'whsec_REPLACE_ME') ||
    !rawBody ||
    !signature
  ) {
    return false
  }

  const expected = crypto
    .createHmac('sha256', env.creem.webhookSecret)
    .update(rawBody)
    .digest('hex')

  const signatureBuffer = Buffer.from(signature, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')

  return (
    signatureBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  )
}
