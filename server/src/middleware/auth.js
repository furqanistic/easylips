import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { ApiError } from '../utils/errors.js'

// Requires a valid access token: `Authorization: Bearer <token>`.
// On success, sets req.user = { id, email }.
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or malformed Authorization header')
    }

    const token = header.slice('Bearer '.length).trim()
    const payload = jwt.verify(token, env.jwt.accessSecret)

    if (payload.type !== 'access') {
      throw new ApiError(401, 'Wrong token type')
    }

    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid or expired access token'))
    }
    next(err)
  }
}
