import { z } from 'zod'

// The client sends a device attestation. We accept hashes only — never raw
// machine signals as "truth". Raw signals (lowercased, concatenated) are used
// only to re-derive the fingerprint hash server-side so a client can't lie
// about the hash without also sending consistent signals.
export const deviceAttestationSchema = z.object({
  installId: z.string().uuid().max(64),
  // SHA-256 hex of the client's salted machine signals. Informational; the
  // server re-hashes rawSignals with its own salt to verify.
  fingerprintHash: z.string().length(64).optional(),
  // Lowercased concatenated machine signals (platform, cpu, mac hash, ...).
  // The server hashes THESE with its secret salt; it never stores them raw.
  rawSignals: z.string().max(512).optional(),
})
