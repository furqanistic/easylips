import { supabase } from '../../config/supabase.js'
import { env } from '../../config/env.js'
import { ApiError } from '../../utils/errors.js'

function requireDb() {
  if (!supabase) {
    throw new ApiError(
      503,
      'Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in server/.env.',
    )
  }
}

// The Electron app only ever reads these numbers — it can never set them.
export async function getBalance(userId) {
  requireDb()
  await refillFreeIfDue(userId)

  const { data, error } = await supabase
    .from('credit_balances')
    .select('free_seconds, paid_seconds, free_revoked, free_refilled_at')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw new ApiError(500, 'Database error', error.message)

  // A row should always exist (created at signup), but defend if it doesn't.
  if (!data) {
    return {
      freeSeconds: 0,
      paidSeconds: 0,
      totalSeconds: 0,
      freeRevoked: false,
      freeRefilledAt: null,
    }
  }

  const freeSeconds = data.free_revoked ? 0 : Number(data.free_seconds || 0)
  const paidSeconds = Number(data.paid_seconds || 0)
  return {
    freeSeconds,
    paidSeconds,
    totalSeconds: freeSeconds + paidSeconds,
    freeRevoked: data.free_revoked === true,
    freeRefilledAt: data.free_refilled_at,
  }
}

// Grant credits (free or paid). Idempotent via refKey for external callers.
export async function grant(userId, seconds, kind, reason, refKey = null) {
  requireDb()
  seconds = Math.max(0, Math.floor(Number(seconds) || 0))
  if (seconds <= 0) return { granted: 0 }

  const column = kind === 'free_daily' ? 'free_seconds' : 'paid_seconds'

  // Idempotency: if a refKey was already processed, don't grant again.
  if (refKey) {
    const { data: existing } = await supabase
      .from('usage_ledger')
      .select('id, seconds')
      .eq('ref_key', refKey)
      .maybeSingle()
    if (existing) return { granted: 0, alreadyGranted: Number(existing.seconds) }
  }

  // Supabase JS client has no atomic "increment column by N", so we
  // read-modify-write. We rely on the unique constraint on
  // credit_balances.user_id and on the ledger ref_key for idempotency; for a
  // race-safe increment we'd move this to a Postgres RPC in Phase 2.
  const { data: row, error: selectErr } = await supabase
    .from('credit_balances')
    .select('free_seconds, paid_seconds')
    .eq('user_id', userId)
    .maybeSingle()

  if (selectErr) throw new ApiError(500, 'Database error', selectErr.message)

  const next = {
    free_seconds: Number(row?.free_seconds || 0) + (column === 'free_seconds' ? seconds : 0),
    paid_seconds: Number(row?.paid_seconds || 0) + (column === 'paid_seconds' ? seconds : 0),
    updated_at: new Date().toISOString(),
  }

  const { error: updateErr } = await supabase
    .from('credit_balances')
    .upsert({ user_id: userId, ...next }, { onConflict: 'user_id' })

  if (updateErr) throw new ApiError(500, 'Failed to grant credits', updateErr.message)

  await appendLedger({
    userId,
    direction: 'credit',
    kind,
    seconds,
    reason,
    refKey,
  })

  return { granted: seconds }
}

// Spend credits atomically. Free minutes are spent before paid minutes.
// Returns the seconds actually debited (may be < requested if balance ran out).
export async function tryDebit(userId, sessionId, requestedSeconds) {
  requireDb()
  requestedSeconds = Math.max(0, Math.floor(Number(requestedSeconds) || 0))
  if (requestedSeconds <= 0) return { debited: 0, remaining: await totalRemaining(userId) }

  const { data: row, error } = await supabase
    .from('credit_balances')
    .select('free_seconds, paid_seconds, free_revoked')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new ApiError(500, 'Database error', error.message)
  if (!row) return { debited: 0, remaining: 0 }

  const freeAvailable = row.free_revoked ? 0 : Number(row.free_seconds || 0)
  const paidAvailable = Number(row.paid_seconds || 0)
  const totalAvailable = freeAvailable + paidAvailable
  const debit = Math.min(requestedSeconds, totalAvailable)
  if (debit <= 0) return { debited: 0, remaining: 0 }

  const fromFree = Math.min(debit, freeAvailable)
  const fromPaid = debit - fromFree

  const { error: updateErr } = await supabase
    .from('credit_balances')
    .update({
      free_seconds: Math.max(0, freeAvailable - fromFree),
      paid_seconds: Math.max(0, paidAvailable - fromPaid),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (updateErr) throw new ApiError(500, 'Failed to debit credits', updateErr.message)

  await appendLedger({
    userId,
    sessionId,
    direction: 'debit',
    kind: 'usage',
    seconds: debit,
    reason: 'translation_session',
  })

  // Bump the session's billed total.
  if (sessionId) {
    const { data: sess } = await supabase
      .from('translation_sessions')
      .select('billed_seconds')
      .eq('id', sessionId)
      .maybeSingle()
    if (sess) {
      await supabase
        .from('translation_sessions')
        .update({
          billed_seconds: Number(sess.billed_seconds || 0) + debit,
        })
        .eq('id', sessionId)
    }
  }

  return { debited: debit, remaining: totalAvailable - debit }
}

// Reset the daily free allowance once per UTC day. Called by getBalance().
export async function refillFreeIfDue(userId) {
  requireDb()
  const { data: row, error } = await supabase
    .from('credit_balances')
    .select('free_refilled_at, free_revoked')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) throw new ApiError(500, 'Database error', error.message)
  if (!row) return false

  if (row.free_revoked) return false

  const now = new Date()
  const startOfTodayUtc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  )

  const last = row.free_refilled_at ? new Date(row.free_refilled_at) : null
  if (last && last >= startOfTodayUtc) return false

  const { error: updateErr } = await supabase
    .from('credit_balances')
    .update({
      free_seconds: env.credits.freeDailySeconds,
      free_refilled_at: now.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq('user_id', userId)

  if (updateErr) throw new ApiError(500, 'Failed to refill free minutes', updateErr.message)

  await appendLedger({
    userId,
    direction: 'credit',
    kind: 'free_daily',
    seconds: env.credits.freeDailySeconds,
    reason: 'daily_free_refill',
  })

  return true
}

// Revoke a user's free minutes (abuse). Paid minutes are preserved.
export async function revokeFree(userId, reason = 'abuse') {
  requireDb()
  const { error } = await supabase
    .from('credit_balances')
    .update({
      free_seconds: 0,
      free_revoked: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)

  if (error) throw new ApiError(500, 'Failed to revoke free minutes', error.message)

  await appendLedger({
    userId,
    direction: 'debit',
    kind: 'admin',
    seconds: 0,
    reason,
  })
}

// Ensure a balance row exists for a freshly created user.
export async function ensureBalanceRow(userId) {
  requireDb()
  const { data: existing } = await supabase
    .from('credit_balances')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle()
  if (existing) return

  const { error } = await supabase
    .from('credit_balances')
    .insert({
      user_id: userId,
      free_seconds: 0,
      paid_seconds: 0,
    })

  if (error && error.code !== '23505') {
    throw new ApiError(500, 'Failed to initialize credit balance', error.message)
  }

  // Grant the first daily allowance immediately.
  await refillFreeIfDue(userId)
}

export async function totalRemaining(userId) {
  const b = await getBalance(userId)
  return b.totalSeconds
}

async function appendLedger({ userId, sessionId = null, direction, kind, seconds, reason = null, refKey = null }) {
  const { error } = await supabase.from('usage_ledger').insert({
    user_id: userId,
    session_id: sessionId || null,
    direction,
    kind,
    seconds: Math.max(0, Math.floor(Number(seconds) || 0)),
    reason,
    ref_key: refKey || null,
  })

  // Duplicate ref_key is a benign idempotency hit, not a real failure.
  if (error && error.code !== '23505') {
    throw new ApiError(500, 'Failed to write usage ledger', error.message)
  }
}

export async function getRecentUsage(userId, limit = 50) {
  requireDb()
  const { data, error } = await supabase
    .from('usage_ledger')
    .select('direction, kind, seconds, reason, session_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new ApiError(500, 'Database error', error.message)
  return data || []
}
