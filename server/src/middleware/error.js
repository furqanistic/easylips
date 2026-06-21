import { env } from '../config/env.js'

export function notFound(req, res) {
  res.status(404).json({
    error: { message: `Route ${req.method} ${req.path} not found` },
  })
}

// Express identifies error middleware by its 4-arg signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  const status = err.status || 500
  const message = err.message || 'Internal server error'

  if (status >= 500) {
    console.error('[error]', err)
  }

  res.status(status).json({
    error: {
      message,
      ...(err.details ? { details: err.details } : {}),
      ...(env.nodeEnv !== 'production' && status >= 500 ? { stack: err.stack } : {}),
    },
  })
}
