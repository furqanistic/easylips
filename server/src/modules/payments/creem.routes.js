import { Router } from 'express'
import { protect } from '../../middleware/auth.js'
import { userLimiter } from '../../middleware/rateLimit.js'
import { validateBody } from '../../middleware/validate.js'
import { createCheckoutSchema } from './creem.schema.js'
import * as ctrl from './creem.controller.js'

const router = Router()

// Checkout creation requires authentication so we can stamp the user id into
// the purchase metadata server-side (the client cannot forge it). The webhook
// later reads that metadata to grant the right number of minutes.
router.post('/checkouts', protect, userLimiter, validateBody(createCheckoutSchema), ctrl.createCheckout)
router.post('/webhooks', ctrl.receiveWebhook)
router.get('/success', ctrl.success)

export default router
