import { Router } from 'express'
import { protect } from '../../middleware/auth.js'
import { validateQuery } from '../../middleware/validate.js'
import { usageQuerySchema } from './credits.schema.js'
import { userLimiter } from '../../middleware/rateLimit.js'
import * as creditsService from './credits.service.js'

const router = Router()

// Read-only: the Electron app reads its authoritative balance here. It can
// never write to it.
router.get('/balance', protect, userLimiter, async (req, res, next) => {
  try {
    const balance = await creditsService.getBalance(req.user.id)
    res.status(200).json({ balance })
  } catch (err) {
    next(err)
  }
})

router.get(
  '/usage',
  protect,
  userLimiter,
  validateQuery(usageQuerySchema),
  async (req, res, next) => {
    try {
      const usage = await creditsService.getRecentUsage(req.user.id, req.body.limit)
      res.status(200).json({ usage })
    } catch (err) {
      next(err)
    }
  },
)

export default router
