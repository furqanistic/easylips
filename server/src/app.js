import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import authRoutes from './modules/auth/auth.routes.js'
import creemRoutes from './modules/payments/creem.routes.js'
import creditsRoutes from './modules/credits/credits.routes.js'
import sessionsRoutes from './modules/sessions/sessions.routes.js'
import { deviceContext } from './modules/devices/devices.middleware.js'
import { genericIpLimiter } from './middleware/rateLimit.js'
import { errorHandler, notFound } from './middleware/error.js'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors({
    origin(origin, callback) {
      if (
        !origin ||
        origin === 'null' ||
        origin.startsWith('file://') ||
        origin === env.clientOrigin
      ) {
        callback(null, true)
        return
      }
      callback(null, false)
    },
    credentials: true,
  }))
  app.use(express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString('utf8')
    },
  }))
  app.use(cookieParser())
  if (env.nodeEnv !== 'production') app.use(morgan('dev'))

  // Generic per-IP flood protection on every route. Tighter limiters apply on
  // auth/credits/sessions specifically.
  app.use(genericIpLimiter)

  // Parse the device attestation header on every request and attach
  // req.device. Harmless on endpoints that don't use it.
  app.use(deviceContext)

  app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }))

  app.use('/auth', authRoutes)
  app.use('/payments/creem', creemRoutes)
  app.use('/credits', creditsRoutes)
  app.use('/sessions', sessionsRoutes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
