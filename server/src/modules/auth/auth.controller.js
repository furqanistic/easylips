import { env } from '../../config/env.js'
import * as authService from './auth.service.js'
import { registerDeviceForUser } from '../devices/devices.middleware.js'

const REFRESH_COOKIE = 'el_refresh'
const REFRESH_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? 'none' : 'lax',
    path: '/auth',
    maxAge: REFRESH_MAX_AGE_MS,
  })
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, { path: '/auth' })
}

// After a new user is created: initialize their credit balance (which grants
// the first daily free allowance), and register the device they signed up
// from. The device check decides whether this device is still eligible for
// free minutes — strict policy limits free minutes to a small number of
// accounts per device.
async function onboardNewUser(req, userId) {
  await authService.initCredits(userId)
  if (req.device) {
    const deviceResult = await registerDeviceForUser(req, userId)
    // If the device is flagged (e.g. already had a free account), revoke this
    // account's free minutes. Paid minutes are still available.
    if (deviceResult.freeRevoked) {
      await authService.revokeUserFree(userId, 'device_abuse')
    }
  }
}

export async function signup(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(req.body)
    await onboardNewUser(req, user.id)
    setRefreshCookie(res, refreshToken)
    res.status(201).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body)
    // Re-evaluate the device on each login (cheap) so abuse on a shared device
    // is caught even for accounts created before device tracking existed.
    if (req.device) {
      await registerDeviceForUser(req, user.id)
    }
    setRefreshCookie(res, refreshToken)
    res.status(200).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function google(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.loginWithGoogle(req.body)
    // Google users may be brand-new (upsert path). Initialize credits if needed.
    await authService.initCredits(user.id)
    if (req.device) {
      const deviceResult = await registerDeviceForUser(req, user.id)
      if (deviceResult.freeRevoked) {
        await authService.revokeUserFree(user.id, 'device_abuse')
      }
    }
    setRefreshCookie(res, refreshToken)
    res.status(200).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function refresh(req, res, next) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken
    if (!token) {
      return res.status(401).json({ error: { message: 'No refresh token provided' } })
    }
    const { user, accessToken, refreshToken } = await authService.rotateRefreshToken(token)
    setRefreshCookie(res, refreshToken)
    res.status(200).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE] || req.body?.refreshToken
    await authService.revokeRefreshToken(token)
    clearRefreshCookie(res)
    res.status(200).json({ ok: true })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id)
    res.status(200).json({ user })
  } catch (err) {
    next(err)
  }
}
