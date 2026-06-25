import * as service from './creem.service.js'
import * as creditsService from '../credits/credits.service.js'

export async function createCheckout(req, res, next) {
  try {
    // Stamp the authenticated user into purchase metadata so the webhook can
    // grant minutes to the right account. The client cannot override this.
    const stampedMetadata = {
      ...(req.body.metadata || {}),
      userId: req.user.id,
    }
    const checkout = await service.createCheckout({ ...req.body, metadata: stampedMetadata })
    const checkoutUrl = checkout.checkout_url || checkout.checkoutUrl

    res.status(checkout.placeholder ? 202 : 201).json({
      checkout: {
        id: checkout.id,
        checkoutUrl,
        productId: checkout.product_id || checkout.productId,
        status: checkout.status,
        placeholder: checkout.placeholder === true,
      },
      ...(checkout.message ? { message: checkout.message } : {}),
    })
  } catch (error) {
    next(error)
  }
}

// Creem webhook. On a verified payment event we grant the purchased minutes
// server-side. The client is NEVER trusted to set its own balance.
//
// We use the Creem checkout/transaction id as the ledger ref_key so a replayed
// or redelivered webhook can never double-grant.
export async function receiveWebhook(req, res) {
  const signature = req.get('creem-signature')
  const rawBody = req.rawBody || JSON.stringify(req.body || {})

  if (!service.verifyWebhookSignature(rawBody, signature)) {
    res.status(401).json({ error: { message: 'Invalid Creem webhook signature.' } })
    return
  }

  const event = req.body || {}
  const eventType = event.eventType || event.type || event.event_name || 'unknown'
  const eventObjectId = event.id || event.object?.id || ''

  console.log('[creem:webhook]', eventType, eventObjectId)

  // Grant only on successful payment / activation events.
  const grantableTypes = new Set([
    'checkout.completed',
    'checkout.session-completed',
    'subscription.active',
    'subscription.paid',
    'payment.successful',
  ])
  if (!grantableTypes.has(String(eventType).toLowerCase())) {
    res.json({ ok: true })
    return
  }

  try {
    // The user id was embedded in checkout metadata (we set it client-side via
    // the createCheckout call). Extract it safely.
    const metadata =
      event.metadata ||
      event.object?.metadata ||
      event.data?.object?.metadata ||
      {}
    const userId = metadata.userId || metadata.user_id || metadata.sub || null

    const productId =
      event.product_id ||
      event.object?.product_id ||
      event.data?.object?.product_id ||
      metadata.productId ||
      null

    const minutes = service.minutesForProduct(productId)

    // Idempotency key: unique per Creem event object so redeliveries are safe.
    const refKey = eventObjectId ? `creem:${eventObjectId}` : `creem:${productId}:${userId}:${Date.now()}`

    if (userId && minutes > 0) {
      await creditsService.grant(userId, minutes * 60, 'paid', `creem_purchase:${productId || 'unknown'}`, refKey)
      console.log(`[creem:webhook] granted ${minutes} min to ${userId} (ref ${refKey})`)
    } else {
      console.warn(
        `[creem:webhook] could not grant: userId=${userId} minutes=${minutes} product=${productId}`,
      )
    }
  } catch (err) {
    // We already returned 200 to Creem in the happy path below? No — we haven't
    // responded yet. Log + still ack so Creem doesn't hammer us, but flag it.
    console.error('[creem:webhook] grant failed:', err.message)
  }

  res.json({ ok: true })
}

export function success(_req, res) {
  res
    .status(200)
    .type('html')
    .send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Payment complete</title>
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #080808; color: #fff; font-family: system-ui, sans-serif; }
      main { max-width: 420px; padding: 32px; text-align: center; }
      h1 { margin: 0 0 12px; font-size: 24px; }
      p { margin: 0; color: rgba(255,255,255,.68); line-height: 1.5; }
    </style>
  </head>
  <body>
    <main>
      <h1>Payment complete</h1>
      <p>You can close this tab and return to Easy Lips.</p>
    </main>
  </body>
</html>`)
}
