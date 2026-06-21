import { Router } from 'express'
import { validateBody } from '../../middleware/validate.js'
import { createCheckoutSchema } from './creem.schema.js'
import * as ctrl from './creem.controller.js'

const router = Router()

router.post('/checkouts', validateBody(createCheckoutSchema), ctrl.createCheckout)
router.post('/webhooks', ctrl.receiveWebhook)
router.get('/success', ctrl.success)

export default router
