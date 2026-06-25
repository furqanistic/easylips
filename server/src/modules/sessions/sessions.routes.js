import { Router } from 'express'
import { protect } from '../../middleware/auth.js'
import { validateBody } from '../../middleware/validate.js'
import { userLimiter } from '../../middleware/rateLimit.js'
import { startSessionSchema, heartbeatSchema } from './sessions.schema.js'
import * as sessionsService from './sessions.service.js'

const router = Router()

router.post('/start', protect, userLimiter, validateBody(startSessionSchema), async (req, res, next) => {
  try {
    const result = await sessionsService.startSession({
      userId: req.user.id,
      installId: req.device?.installId || null,
      targetLang: req.body.targetLang,
      sourceLang: req.body.sourceLang,
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/heartbeat', protect, userLimiter, validateBody(heartbeatSchema), async (req, res, next) => {
  try {
    const result = await sessionsService.heartbeat({
      userId: req.user.id,
      sessionId: req.params.id,
      elapsedSeconds: req.body.elapsedSeconds,
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

router.post('/:id/stop', protect, userLimiter, async (req, res, next) => {
  try {
    const result = await sessionsService.stopSession({
      userId: req.user.id,
      sessionId: req.params.id,
    })
    res.status(200).json(result)
  } catch (err) {
    next(err)
  }
})

export default router
