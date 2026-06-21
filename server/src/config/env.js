import dotenv from 'dotenv'

dotenv.config()

const required = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET']
const missing = required.filter((k) => !process.env[k])
if (missing.length) {
  throw new Error(
    `Missing required env var(s): ${missing.join(', ')}. Check server/.env against server/.env.example`,
  )
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
}
