import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../../config/env.js'

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, type: 'access' },
    env.jwt.accessSecret,
    { expiresIn: env.jwt.accessTtl },
  )
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user.id, type: 'refresh' }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshTtl,
  })
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwt.refreshSecret)
}

// We store a SHA-256 hash of the refresh token so a DB leak
// can't be used to impersonate users.
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function refreshTokenExpiryMs(token) {
  const decoded = verifyRefreshToken(token)
  return decoded.exp * 1000
}
