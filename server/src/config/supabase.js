import { createClient } from '@supabase/supabase-js'
import { env } from './env.js'

// Placeholders from .env.example — treat as "not configured".
const PLACEHOLDER_URL = 'https://YOUR-PROJECT.supabase.co'
const PLACEHOLDER_KEY = 'your-service-role-key'

function isConfigured() {
  return (
    !!env.supabaseUrl &&
    !!env.supabaseServiceKey &&
    env.supabaseUrl !== PLACEHOLDER_URL &&
    !env.supabaseUrl.includes('YOUR-PROJECT') &&
    env.supabaseServiceKey !== PLACEHOLDER_KEY
  )
}

let supabase = null

if (isConfigured()) {
  supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
} else {
  console.warn(
    '[supabase] SUPABASE_URL / SUPABASE_SERVICE_KEY not set (or still placeholders) in server/.env ' +
      '— DB features disabled. Add real values (see server/.env.example) and the auth endpoints will come alive.',
  )
}

export { supabase }
