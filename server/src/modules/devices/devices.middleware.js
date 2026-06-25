import { env } from '../../config/env.js'
import * as devicesService from './devices.service.js'

function clientIp(req) {
  return (req.headers['x-forwarded-for']?.split(',')[0]?.trim()) || req.socket?.remoteAddress || 'unknown'
}

// Reads a device attestation from the request (header or body) and attaches
// a normalized device context to req.device. Does NOT block on its own —
// callers (signup, session start) use it to register/evaluate the device.
//
// We hash rawSignals SERVER-SIDE with our secret salt so a client cannot
// forge a fingerprintHash that collides with another device.
export async function deviceContext(req, _res, next) {
  const header = req.headers['x-easylips-attestation']
  let att = null

  if (header) {
    try {
      att = JSON.parse(Buffer.from(header, 'base64').toString('utf8'))
    } catch {
      att = null
    }
  }
  if (!att && req.body && req.body.installId) {
    att = req.body
  }

  req.device = null

  if (att?.installId) {
    const ip = clientIp(req)
    const rawSignals = String(att.rawSignals || '').toLowerCase()
    const fingerprintHash = devicesService.hashFingerprint(rawSignals || att.installId)
    const ipHash = devicesService.hashIp(ip)

    // If the client also sent a fingerprintHash, sanity-check it against the
    // server-derived one. Mismatch is suspicious but not fatal (clock/signal
    // differences can cause drift); we just log it.
    if (att.fingerprintHash && att.fingerprintHash !== fingerprintHash) {
      console.warn('[device] client fingerprintHash mismatch for install', att.installId)
    }

    req.device = {
      installId: att.installId,
      fingerprintHash,
      ipHash,
      rawSignals,
      clientFingerprintHash: att.fingerprintHash || null,
    }
  }

  next()
}

// Re-exported so routes can use device registration as an explicit step after
// auth (signup) rather than relying on a global side effect.
export async function registerDeviceForUser(req, userId) {
  if (!req.device) return { registered: false }
  return devicesService.registerOrTouch({
    installId: req.device.installId,
    fingerprintHash: req.device.fingerprintHash,
    ipHash: req.device.ipHash,
    userId,
    rawSignals: req.device.rawSignals,
  })
}

export { env }
