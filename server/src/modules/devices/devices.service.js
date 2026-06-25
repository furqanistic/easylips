import crypto from 'node:crypto'
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

// Salted SHA-256. We never store raw IPs or raw machine signals.
export function hashFingerprint(signalString) {
  return crypto
    .createHash('sha256')
    .update(`${env.deviceSalt}::fp::${signalString}`)
    .digest('hex')
}

export function hashIp(ip) {
  return crypto.createHash('sha256').update(`${env.deviceSalt}::ip::${ip}`).digest('hex')
}

// Log an abuse signal. The credits/sessions services read these to decide
// whether to withhold free minutes.
export async function flagAbuse({ subject, subjectId, reason, severity = 'low' }) {
  requireDb()
  const { error } = await supabase.from('abuse_flags').insert({
    subject,
    subject_id: String(subjectId),
    reason,
    severity,
  })
  if (error && error.code !== '23505') {
    // Non-fatal: never block a legitimate flow because we couldn't log a flag.
    console.warn('[abuse] could not log flag:', error.message)
  }
}

// Is this subject currently flagged? Looks back N days.
export async function isFlagged({ subject, subjectId, withinDays = 30 }) {
  requireDb()
  const since = new Date(Date.now() - withinDays * 24 * 60 * 60 * 1000).toISOString()
  const { count, error } = await supabase
    .from('abuse_flags')
    .select('id', { count: 'exact', head: true })
    .eq('subject', subject)
    .eq('subject_id', String(subjectId))
    .gte('created_at', since)
  if (error) return false
  return (count || 0) > 0
}

// Register a device (or touch it) and run the strict abuse heuristics.
// Returns { installId, freeRevoked, flagged }.
//
// Strict policy:
//  - First account on a device gets free minutes; subsequent accounts do NOT
//    (free minutes are capped at maxAccountsPerDeviceFree, default 1).
//  - Too many accounts on one device/IP -> flag + revoke free minutes.
//  - Too many fresh install_ids from one fingerprint in 24h -> flag (reinstall
//    farming) + revoke.
//  - Known VM/emulator signals -> flag + revoke (strict).
export async function registerOrTouch({ installId, fingerprintHash, ipHash, userId, rawSignals = '' }) {
  requireDb()

  const isNewInstall = !(await deviceExists(installId))

  // Insert or update the device row.
  const { error: upsertErr } = await supabase.from('devices').upsert(
    {
      install_id: installId,
      fingerprint_hash: fingerprintHash,
      ip_hash: ipHash,
      first_user_id: isNewInstall && userId ? userId : undefined,
      last_seen: new Date().toISOString(),
      seen_count: isNewInstall ? 1 : undefined,
    },
    { onConflict: 'install_id' },
  )
  if (upsertErr) throw new ApiError(500, 'Failed to register device', upsertErr.message)

  // Bump seen_count / last_seen for an existing device.
  if (!isNewInstall) {
    const { data: dev } = await supabase
      .from('devices')
      .select('seen_count')
      .eq('install_id', installId)
      .maybeSingle()
    if (dev) {
      await supabase
        .from('devices')
        .update({
          last_seen: new Date().toISOString(),
          seen_count: Number(dev.seen_count || 1) + 1,
        })
        .eq('install_id', installId)
    }
  }

  // Link account <-> device.
  if (userId) {
    await supabase
      .from('device_accounts')
      .upsert({ install_id: installId, user_id: userId }, { onConflict: 'install_id,user_id' })
  }

  let deviceRevoked = false

  // Heuristic 1: VM / emulator (strict).
  if (looksLikeVmOrEmulator(rawSignals)) {
    await flagAbuse({ subject: 'device', subjectId: installId, reason: 'vm_or_emulator', severity: 'high' })
    deviceRevoked = true
  }

  // Heuristic 2: too many accounts on this device.
  const accountsOnDevice = await countAccountsOnDevice(installId)
  if (accountsOnDevice > env.rateLimit.maxAccountsPerDeviceFree) {
    await flagAbuse({
      subject: 'device',
      subjectId: installId,
      reason: 'multiple_accounts_device',
      severity: accountsOnDevice > env.rateLimit.maxAccountsPerDeviceTotal ? 'high' : 'medium',
    })
    deviceRevoked = true
  }

  // Heuristic 3: too many accounts from this IP.
  const accountsOnIp = await countAccountsOnIp(ipHash)
  if (accountsOnIp > env.rateLimit.maxAccountsPerIpTotal) {
    await flagAbuse({ subject: 'ip', subjectId: ipHash, reason: 'ip_farming', severity: 'high' })
    deviceRevoked = true
  }

  // Heuristic 4: reinstall farming — many install_ids from one fingerprint.
  const installsFromFingerprint24h = await countInstallIdsSince(fingerprintHash, 24 * 60 * 60 * 1000)
  if (installsFromFingerprint24h > env.rateLimit.maxInstallIdsPerFingerprint24h) {
    await flagAbuse({
      subject: 'device',
      subjectId: installId,
      reason: 'device_reset_farming',
      severity: 'high',
    })
    deviceRevoked = true
  }

  if (deviceRevoked) {
    await supabase
      .from('devices')
      .update({ free_revoked: true })
      .eq('install_id', installId)
  }

  return { installId, freeRevoked: deviceRevoked, flagged: deviceRevoked }
}

export async function deviceExists(installId) {
  const { data } = await supabase
    .from('devices')
    .select('install_id')
    .eq('install_id', installId)
    .maybeSingle()
  return !!data
}

export async function countAccountsOnDevice(installId) {
  const { count } = await supabase
    .from('device_accounts')
    .select('user_id', { count: 'exact', head: true })
    .eq('install_id', installId)
  return count || 0
}

export async function countAccountsOnIp(ipHash) {
  const { count } = await supabase
    .from('devices')
    .select('install_id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
  return count || 0
}

async function countInstallIdsSince(fingerprintHash, sinceMs) {
  const since = new Date(Date.now() - sinceMs).toISOString()
  const { count } = await supabase
    .from('devices')
    .select('install_id', { count: 'exact', head: true })
    .eq('fingerprint_hash', fingerprintHash)
    .gte('first_seen', since)
  return count || 0
}

// Crude VM/emulator detection on the raw signal blob. Strict mode blocks these.
function looksLikeVmOrEmulator(signals = '') {
  const s = String(signals || '').toLowerCase()
  if (!s) return false
  const markers = ['vmware', 'virtualbox', 'qemu', 'xen', 'kvm', 'parallels', 'hyper-v', 'emulator']
  return markers.some((m) => s.includes(m))
}
