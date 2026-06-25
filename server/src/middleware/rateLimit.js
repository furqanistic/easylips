import { env } from '../config/env.js'
import { ApiError } from '../utils/errors.js'

// Phase 1: in-process sliding-window counters keyed by bucket.
// TODO (Phase 2): back this with Redis when we run more than one instance.
// Each limiter is a simple Map<key, number[]> of request timestamps within
// the window. Memory is bounded by evicting old entries on each lookup.

function makeLimiter({ windowMs, max, keyFn, message }) {
  const hits = new Map()

  return (req, res, next) => {
    const key = keyFn(req)
    if (!key) return next() // no key available -> can't limit, let it through

    const now = Date.now()
    const since = now - windowMs
    const arr = hits.get(key) || []
    while (arr.length && arr[0] <= since) arr.shift()

    if (arr.length >= max) {
      const retryAfter = Math.ceil(windowMs / 1000)
      res.set('Retry-After', String(retryAfter))
      return next(new ApiError(429, message || 'Too many requests. Please slow down.'))
    }

    arr.push(now)
    hits.set(key, arr)
    next()
  }
}

// Bucket keys. The client sends a device install id via header; fall back to IP.
function ipKey(req) {
  return (req.headers['x-forwarded-for']?.split(',')[0]?.trim()) || req.socket?.remoteAddress || 'unknown'
}
function deviceKey(req) {
  return req.headers['x-easylips-install-id'] || ''
}

export const signupIpLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: env.rateLimit.signupPerHourPerIp,
  keyFn: ipKey,
  message: 'Too many accounts created from this network. Try again later.',
})

export const signupDeviceLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: env.rateLimit.signupPerHourPerDevice,
  keyFn: (req) => deviceKey(req) || ipKey(req),
  message: 'Too many accounts created from this device. Try again later.',
})

export const loginIpLimiter = makeLimiter({
  windowMs: env.rateLimit.loginWindowMs,
  max: env.rateLimit.loginPerWindowPerIp,
  keyFn: ipKey,
  message: 'Too many login attempts. Please wait a few minutes and try again.',
})

export const googleIpLimiter = makeLimiter({
  windowMs: 60 * 60 * 1000,
  max: env.rateLimit.googlePerHourPerIp,
  keyFn: ipKey,
  message: 'Too many Google sign-in attempts from this network. Try again later.',
})

export const userLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: env.rateLimit.apiPerMinutePerUser,
  keyFn: (req) => req.user?.id || ipKey(req),
  message: 'Too many requests. Please slow down.',
})

export const genericIpLimiter = makeLimiter({
  windowMs: 60 * 1000,
  max: env.rateLimit.genericPerMinutePerIp,
  keyFn: ipKey,
  message: 'Too many requests from this network.',
})
