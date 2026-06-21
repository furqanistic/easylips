import * as service from './creem.service.js'

export async function createCheckout(req, res, next) {
  try {
    const checkout = await service.createCheckout(req.body)
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

export async function receiveWebhook(req, res) {
  const signature = req.get('creem-signature')
  const rawBody = req.rawBody || JSON.stringify(req.body || {})

  if (!service.verifyWebhookSignature(rawBody, signature)) {
    res.status(401).json({ error: { message: 'Invalid Creem webhook signature.' } })
    return
  }

  const event = req.body || {}
  console.log('[creem:webhook]', event.eventType || event.type || 'unknown', event.id || '')

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
