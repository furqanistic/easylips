import { supabase } from '../../config/supabase.js'
import { ApiError } from '../../utils/errors.js'
import * as creditsService from '../credits/credits.service.js'

function requireDb() {
  if (!supabase) {
    throw new ApiError(
      503,
      'Database is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in server/.env.',
    )
  }
}

// The Electron app asks the server to APPROVE a translation session. The
// server refuses if the user has no balance or is flagged. This is the gate
// that a modified client cannot bypass: no approved session -> no Gemini call
// in Phase 2 (relay), and in Phase 1 the heartbeat enforces the same count.
export async function startSession({ userId, installId, targetLang, sourceLang }) {
  requireDb()

  const balance = await creditsService.getBalance(userId)
  if (balance.totalSeconds <= 0) {
    throw new ApiError(402, 'You have no translation minutes left. Top up to continue.')
  }

  // Expire any stale active sessions for this user (e.g. previous crash).
  await supabase
    .from('translation_sessions')
    .update({ status: 'expired', ended_at: new Date().toISOString() })
    .eq('user_id', userId)
    .in('status', ['pending', 'active'])

  const { data, error } = await supabase
    .from('translation_sessions')
    .insert({
      user_id: userId,
      install_id: installId || null,
      status: 'active',
      target_lang: targetLang,
      source_lang: sourceLang,
    })
    .select('id, started_at')
    .single()

  if (error) throw new ApiError(500, 'Failed to start session', error.message)

  return {
    sessionId: data.id,
    startedAt: data.started_at,
    balance: balance,
  }
}

// Client pings with elapsed wall-clock seconds since last heartbeat / start.
// Server debits the REAL elapsed time from the ledger and returns the
// authoritative remaining balance. The client must obey { stop: true }.
export async function heartbeat({ userId, sessionId, elapsedSeconds }) {
  requireDb()

  const { data: session, error } = await supabase
    .from('translation_sessions')
    .select('id, user_id, status')
    .eq('id', sessionId)
    .maybeSingle()
  if (error) throw new ApiError(500, 'Database error', error.message)
  if (!session) throw new ApiError(404, 'Session not found')
  if (session.user_id !== userId) throw new ApiError(403, 'Session does not belong to this user')
  if (session.status === 'stopped' || session.status === 'expired') {
    const balance = await creditsService.getBalance(userId)
    return { stop: true, remainingSeconds: balance.totalSeconds, reason: 'session_already_ended' }
  }

  if (elapsedSeconds > 0) {
    await creditsService.tryDebit(userId, sessionId, elapsedSeconds)
  }

  const balance = await creditsService.getBalance(userId)
  const stop = balance.totalSeconds <= 0

  if (stop) {
    await supabase
      .from('translation_sessions')
      .update({ status: 'expired', ended_at: new Date().toISOString() })
      .eq('id', sessionId)
  }

  return { stop, remainingSeconds: balance.totalSeconds }
}

export async function stopSession({ userId, sessionId }) {
  requireDb()
  const { data: session, error } = await supabase
    .from('translation_sessions')
    .select('user_id, status')
    .eq('id', sessionId)
    .maybeSingle()
  if (error) throw new ApiError(500, 'Database error', error.message)
  if (!session) return { stopped: false }
  if (session.user_id !== userId) throw new ApiError(403, 'Session does not belong to this user')

  await supabase
    .from('translation_sessions')
    .update({ status: 'stopped', ended_at: new Date().toISOString() })
    .eq('id', sessionId)
    .in('status', ['pending', 'active'])

  return { stopped: true }
}
