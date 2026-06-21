import { env } from '../../config/env.js'
import * as authService from './auth.service.js'

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

export async function signup(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.signup(req.body)
    setRefreshCookie(res, refreshToken)
    res.status(201).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body)
    setRefreshCookie(res, refreshToken)
    res.status(200).json({ user, accessToken })
  } catch (err) {
    next(err)
  }
}

export async function google(req, res, next) {
  try {
    const { user, accessToken, refreshToken } = await authService.loginWithGoogle(req.body)
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
