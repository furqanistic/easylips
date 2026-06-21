import crypto from 'node:crypto'
import { env } from '../../config/env.js'
import { ApiError } from '../../utils/errors.js'

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_CERTS_URL = 'https://www.googleapis.com/oauth2/v3/certs'
const GOOGLE_ISSUERS = new Set(['https://accounts.google.com', 'accounts.google.com'])
const PLACEHOLDER_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
const PLACEHOLDER_CLIENT_SECRET = 'YOUR_GOOGLE_CLIENT_SECRET'

let keyCache = {
  expiresAt: 0,
  keys: [],
}

function isPlaceholder(value, placeholder) {
  return !value || value === placeholder
}

function requireGoogleConfig() {
  if (isPlaceholder(env.google.clientId, PLACEHOLDER_CLIENT_ID)) {
    throw new ApiError(
      503,
      'Google OAuth is not configured. Replace GOOGLE_CLIENT_ID in server/.env.',
    )
  }
}

function decodeBase64UrlJson(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'))
}

function parseCacheMaxAge(cacheControl = '') {
  const match = cacheControl.match(/max-age=(\d+)/)
  return match ? Number(match[1]) * 1000 : 60 * 60 * 1000
}

async function getGoogleKeys() {
  if (keyCache.keys.length && keyCache.expiresAt > Date.now()) {
    return keyCache.keys
  }

  const response = await fetch(GOOGLE_CERTS_URL)
  if (!response.ok) {
    throw new ApiError(502, 'Could not fetch Google signing keys')
  }

  const data = await response.json()
  keyCache = {
    expiresAt: Date.now() + parseCacheMaxAge(response.headers.get('cache-control') || ''),
    keys: data.keys || [],
  }

  return keyCache.keys
}

async function verifyGoogleIdToken(idToken, expectedNonce) {
  const parts = idToken?.split('.')
  if (parts?.length !== 3) {
    throw new ApiError(401, 'Invalid Google ID token')
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const header = decodeBase64UrlJson(encodedHeader)
  const payload = decodeBase64UrlJson(encodedPayload)

  if (header.alg !== 'RS256' || !header.kid) {
    throw new ApiError(401, 'Unsupported Google ID token signature')
  }

  const keys = await getGoogleKeys()
  const jwk = keys.find((key) => key.kid === header.kid)
  if (!jwk) {
    throw new ApiError(401, 'Google signing key was not found')
  }

  const verifier = crypto.createVerify('RSA-SHA256')
  verifier.update(`${encodedHeader}.${encodedPayload}`)
  verifier.end()

  const validSignature = verifier.verify(
    crypto.createPublicKey({ key: jwk, format: 'jwk' }),
    Buffer.from(encodedSignature, 'base64url'),
  )
  if (!validSignature) {
    throw new ApiError(401, 'Invalid Google ID token signature')
  }

  const nowSeconds = Math.floor(Date.now() / 1000)
  if (payload.aud !== env.google.clientId) {
    throw new ApiError(401, 'Google ID token audience does not match this app')
  }
  if (!GOOGLE_ISSUERS.has(payload.iss)) {
    throw new ApiError(401, 'Google ID token issuer is invalid')
  }
  if (!payload.exp || payload.exp <= nowSeconds) {
    throw new ApiError(401, 'Google ID token has expired')
  }
  if (expectedNonce && payload.nonce !== expectedNonce) {
    throw new ApiError(401, 'Google OAuth nonce mismatch')
  }
  if (!payload.sub || !payload.email) {
    throw new ApiError(401, 'Google account did not include an email')
  }
  if (payload.email_verified !== true && payload.email_verified !== 'true') {
    throw new ApiError(401, 'Google email is not verified')
  }

  return {
    googleSub: payload.sub,
    email: String(payload.email).toLowerCase(),
    name: payload.name || payload.given_name || null,
  }
}

export async function exchangeGoogleCode({ code, codeVerifier, redirectUri, nonce }) {
  requireGoogleConfig()

  const body = new URLSearchParams({
    code,
    client_id: env.google.clientId,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    code_verifier: codeVerifier,
  })

  if (!isPlaceholder(env.google.clientSecret, PLACEHOLDER_CLIENT_SECRET)) {
    body.set('client_secret', env.google.clientSecret)
  }

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.id_token) {
    throw new ApiError(
      401,
      data?.error_description || data?.error || 'Google authorization failed',
    )
  }

  return verifyGoogleIdToken(data.id_token, nonce)
}
