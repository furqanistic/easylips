import { Router } from 'express'
import { protect } from '../../middleware/auth.js'
import { validateBody } from '../../middleware/validate.js'
import {
  signupIpLimiter,
  signupDeviceLimiter,
  loginIpLimiter,
  googleIpLimiter,
} from '../../middleware/rateLimit.js'
import { googleOAuthSchema, loginSchema, signupSchema } from './auth.schema.js'
import * as ctrl from './auth.controller.js'

const router = Router()

router.post(
  '/signup',
  signupIpLimiter,
  signupDeviceLimiter,
  validateBody(signupSchema),
  ctrl.signup,
)
router.post('/login', loginIpLimiter, validateBody(loginSchema), ctrl.login)
router.post('/google', googleIpLimiter, validateBody(googleOAuthSchema), ctrl.google)
router.post('/refresh', ctrl.refresh)
router.post('/logout', ctrl.logout)
router.get('/me', protect, ctrl.me)

export default router
