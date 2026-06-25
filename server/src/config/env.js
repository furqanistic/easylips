import dotenv from 'dotenv'

dotenv.config()

const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  throw new Error(
    `Missing required env var(s): ${missing.join(', ')}. Check server/.env against server/.env.example`,
  )
}

// A long random per-deploy secret used to salt device fingerprints/IP hashes
// before SHA-256. Generate with: openssl rand -hex 32. We must NOT ship a real
// default — but if the operator forgot to set it we derive one at boot so the
// app still runs (less safe than setting it explicitly).
function resolveDeviceSalt() {
  if (process.env.DEVICE_SALT && process.env.DEVICE_SALT.length >= 16) {
    return process.env.DEVICE_SALT
  }
  console.warn(
    '[env] DEVICE_SALT not set or too short — using a derived default. ' +
      'Set DEVICE_SALT (>=16 chars) in production so device/IP hashes are stable across restarts.',
  )
  // Derive from JWT secrets so it is at least stable per-deploy and not zero.
  return `derived::${process.env.JWT_ACCESS_SECRET || ''}::${process.env.JWT_REFRESH_SECRET || ''}`
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: parseInt(process.env.PORT || '8000', 10),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET',
  },

  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTtl: process.env.JWT_ACCESS_TTL || '15m',
    refreshTtl: process.env.JWT_REFRESH_TTL || '7d',
  },
  creem: {
    apiKey: process.env.CREEM_API_KEY || 'creem_test_REPLACE_ME',
    productId: process.env.CREEM_PRODUCT_ID || 'prod_REPLACE_ME',
    products: {
      starter: process.env.CREEM_PRODUCT_STARTER_ID || process.env.CREEM_PRODUCT_ID || 'prod_starter_REPLACE_ME',
      plus: process.env.CREEM_PRODUCT_PLUS_ID || 'prod_plus_REPLACE_ME',
      pro: process.env.CREEM_PRODUCT_PRO_ID || 'prod_pro_REPLACE_ME',
      enterprise: process.env.CREEM_PRODUCT_ENTERPRISE_ID || 'prod_enterprise_REPLACE_ME',
      topup100: process.env.CREEM_PRODUCT_TOPUP_100_ID || 'prod_topup_100_REPLACE_ME',
    },
    successUrl:
      process.env.CREEM_SUCCESS_URL ||
      `http://localhost:${process.env.PORT || '8000'}/payments/creem/success`,
    testMode: (process.env.CREEM_TEST_MODE || 'true') !== 'false',
    webhookSecret: process.env.CREEM_WEBHOOK_SECRET || 'whsec_REPLACE_ME',
    placeholderCheckoutUrl:
      process.env.CREEM_PLACEHOLDER_CHECKOUT_URL ||
      'https://www.creem.io/dashboard/home',
  },

  // ── Credits / minutes (server is the source of truth) ────────────────────
  credits: {
    // Free daily allowance in SECONDS. Server-controlled; the client never
    // decides this. Default ~15 minutes/day.
    freeDailySeconds: parseInt(process.env.FREE_DAILY_SECONDS || '900', 10),
    // How many minutes each paid plan/top-up grants. Keys match the client's
    // plan ids and Creem product ids. Edit in .env, not in the client.
    planMinutes: {
      starter: parseInt(process.env.PLAN_MINUTES_STARTER || '120', 10),
      plus: parseInt(process.env.PLAN_MINUTES_PLUS || '600', 10),
      pro: parseInt(process.env.PLAN_MINUTES_PRO || '2000', 10),
      enterprise: parseInt(process.env.PLAN_MINUTES_ENTERPRISE || '10000', 10),
      topup100: parseInt(process.env.PLAN_MINUTES_TOPUP100 || '100', 10),
    },
  },

  // ── Device fingerprinting ────────────────────────────────────────────────
  // Salt mixed into device fingerprint + IP hashes before SHA-256. Never store
  // raw machine signals or raw IPs.
  deviceSalt: resolveDeviceSalt(),

  // ── Rate limiting (Phase 1: in-process. TODO: Redis at scale) ────────────
  rateLimit: {
    // Signup is the main multi-account-abuse surface — keep it tight.
    signupPerHourPerIp: parseInt(process.env.RL_SIGNUP_IP_HOUR || '3', 10),
    signupPerHourPerDevice: parseInt(process.env.RL_SIGNUP_DEVICE_HOUR || '2', 10),
    loginPerWindowPerIp: parseInt(process.env.RL_LOGIN_IP_WINDOW || '10', 10),
    loginWindowMs: parseInt(process.env.RL_LOGIN_WINDOW_MS || String(15 * 60 * 1000), 10),
    googlePerHourPerIp: parseInt(process.env.RL_GOOGLE_IP_HOUR || '10', 10),
    apiPerMinutePerUser: parseInt(process.env.RL_API_USER_MIN || '60', 10),
    genericPerMinutePerIp: parseInt(process.env.RL_GENERIC_IP_MIN || '200', 10),
    // Hard caps for abuse heuristics.
    maxAccountsPerDeviceFree: parseInt(process.env.MAX_FREE_ACCOUNTS_DEVICE || '1', 10),
    maxAccountsPerDeviceTotal: parseInt(process.env.MAX_ACCOUNTS_DEVICE || '3', 10),
    maxAccountsPerIpTotal: parseInt(process.env.MAX_ACCOUNTS_IP || '5', 10),
    maxInstallIdsPerFingerprint24h: parseInt(process.env.MAX_INSTALLIDS_FP_24H || '2', 10),
  },
}
