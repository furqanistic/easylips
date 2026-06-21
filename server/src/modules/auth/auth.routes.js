import { Router } from 'express'
import { protect } from '../../middleware/auth.js'
import { validateBody } from '../../middleware/validate.js'
import { googleOAuthSchema, loginSchema, signupSchema } from './auth.schema.js'
import * as ctrl from './auth.controller.js'

const router = Router()

router.post('/signup', validateBody(signupSchema), ctrl.signup)
router.post('/login', validateBody(loginSchema), ctrl.login)
router.post('/google', validateBody(googleOAuthSchema), ctrl.google)
router.post('/refresh', ctrl.refresh)
router.post('/logout', ctrl.logout)
router.get('/me', protect, ctrl.me)

export default router
