import bcrypt from 'bcryptjs'
import { supabase } from '../../config/supabase.js'
import { env } from '../../config/env.js'
import { ApiError } from '../../utils/errors.js'
import {
  hashToken,
  refreshTokenExpiryMs,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from './auth.tokens.js'
import { exchangeGoogleCode } from './auth.google.js'

function requireDb() {
  if (!supabase) {
    throw new ApiError(
      503,
      'Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in server/.env.',
    )
  }
}

const USER_PUBLIC_COLS = 'id, email, name, created_at'

export async function signup({ email, password, name }) {
  requireDb()

  const passwordHash = await bcrypt.hash(password, env.bcryptRounds)

  const { data, error } = await supabase
    .from('users')
    .insert({ email, password_hash: passwordHash, name: name || null })
    .select(USER_PUBLIC_COLS)
    .single()

  if (error) {
    // 23505 = unique_violation (email already taken)
    if (error.code === '23505') {
      throw new ApiError(409, 'An account with that email already exists')
    }
    throw new ApiError(500, 'Failed to create user', error.message)
  }

  const tokens = await issueTokens(data)
  return { user: data, ...tokens }
}

export async function login({ email, password }) {
  requireDb()

  const { data: user, error } = await supabase
    .from('users')
    .select('id, email, name, password_hash')
    .eq('email', email)
    .maybeSingle()

  if (error) throw new ApiError(500, 'Database error', error.message)
  // Intentionally generic — don't leak which of email/password was wrong.
  if (!user) throw new ApiError(401, 'Invalid email or password')
  if (!user.password_hash) throw new ApiError(401, 'Use Google to sign in to this account')

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) throw new ApiError(401, 'Invalid email or password')

  const safeUser = { id: user.id, email: user.email, name: user.name }
  const tokens = await issueTokens(safeUser)
  return { user: { ...safeUser, created_at: undefined }, ...tokens }
}

export async function loginWithGoogle(input) {
  requireDb()

  const googleUser = await exchangeGoogleCode(input)
  const user = await upsertGoogleUser(googleUser)
  const tokens = await issueTokens(user)
  return { user, ...tokens }
}

async function upsertGoogleUser({ email, googleSub, name }) {
  const { data: byGoogle, error: googleErr } = await supabase
    .from('users')
    .select(USER_PUBLIC_COLS)
    .eq('google_sub', googleSub)
    .maybeSingle()

  if (googleErr) throw new ApiError(500, 'Database error', googleErr.message)
  if (byGoogle) return byGoogle

  const { data: byEmail, error: emailErr } = await supabase
    .from('users')
    .select('id, email, name, created_at, google_sub')
    .eq('email', email)
    .maybeSingle()

  if (emailErr) throw new ApiError(500, 'Database error', emailErr.message)

  if (byEmail) {
    const { data, error } = await supabase
      .from('users')
      .update({
        google_sub: googleSub,
        auth_provider: 'google',
        name: byEmail.name || name || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', byEmail.id)
      .select(USER_PUBLIC_COLS)
      .single()

    if (error) throw new ApiError(500, 'Failed to link Google account', error.message)
    return data
  }

  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      name: name || null,
      google_sub: googleSub,
      auth_provider: 'google',
      password_hash: null,
    })
    .select(USER_PUBLIC_COLS)
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new ApiError(409, 'An account with that email already exists')
    }
    throw new ApiError(500, 'Failed to create Google user', error.message)
  }

  return data
}

export async function rotateRefreshToken(token) {
  requireDb()

  let decoded
  try {
    decoded = verifyRefreshToken(token)
  } catch {
    throw new ApiError(401, 'Invalid refresh token')
  }
  if (decoded.type !== 'refresh') {
    throw new ApiError(401, 'Invalid refresh token')
  }

  const tokenHash = hashToken(token)
  const { data: row, error } = await supabase
    .from('refresh_tokens')
    .select('id, user_id, revoked_at, expires_at')
    .eq('token_hash', tokenHash)
    .maybeSingle()

  if (error) throw new ApiError(500, 'Database error', error.message)
  if (!row) throw new ApiError(401, 'Invalid refresh token')

  // Reuse detection: a previously-revoked token being presented again
  // means it was stolen. Burn every session for this user.
  if (row.revoked_at) {
    await supabase
      .from('refresh_tokens')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', row.user_id)
      .is('revoked_at', null)
    throw new ApiError(401, 'Refresh token reuse detected; all sessions revoked')
  }

  if (new Date(row.expires_at).getTime() < Date.now()) {
    throw new ApiError(401, 'Refresh token expired')
  }

  const { data: user, error: uErr } = await supabase
    .from('users')
    .select(USER_PUBLIC_COLS)
    .eq('id', row.user_id)
    .maybeSingle()

  if (uErr) throw new ApiError(500, 'Database error', uErr.message)
  if (!user) throw new ApiError(401, 'User no longer exists')

  // Rotate: revoke the old token, mint a fresh one.
  await supabase
    .from('refresh_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', row.id)

  const tokens = await issueTokens(user)
  return { user, ...tokens }
}

export async function revokeRefreshToken(token) {
  requireDb()
  if (!token) return

  try {
    verifyRefreshToken(token)
  } catch {
    return // already invalid — nothing to revoke
  }

  await supabase
    .from('refresh_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token_hash', hashToken(token))
}

export async function getUserById(id) {
  requireDb()
  const { data, error } = await supabase
    .from('users')
    .select(USER_PUBLIC_COLS)
    .eq('id', id)
    .maybeSingle()
  if (error) throw new ApiError(500, 'Database error', error.message)
  if (!data) throw new ApiError(404, 'User not found')
  return data
}

async function issueTokens(user) {
  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)
  const expiresAt = new Date(refreshTokenExpiryMs(refreshToken)).toISOString()

  const { error } = await supabase.from('refresh_tokens').insert({
    user_id: user.id,
    token_hash: hashToken(refreshToken),
    expires_at: expiresAt,
  })

  if (error) throw new ApiError(500, 'Failed to persist session', error.message)

  return { accessToken, refreshToken }
}
