import { z } from 'zod'

export const startSessionSchema = z.object({
  targetLang: z.string().trim().min(2).max(32),
  sourceLang: z.string().trim().min(1).max(32).default('auto'),
})

export const heartbeatSchema = z.object({
  elapsedSeconds: z.number().int().min(0).max(120).default(0),
})

export const sessionIdParam = z.object({
  id: z.string().uuid(),
})
