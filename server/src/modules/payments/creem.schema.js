import { z } from 'zod'

const metadataSchema = z.record(z.string(), z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
])).optional()

export const createCheckoutSchema = z.object({
  planId: z.enum(['starter', 'plus', 'pro', 'enterprise', 'topup100']).optional(),
  productId: z.string().trim().min(1).optional(),
  requestId: z.string().trim().min(1).max(128).optional(),
  successUrl: z.string().url().optional(),
  discountCode: z.string().trim().min(1).max(64).optional(),
  units: z.number().int().positive().max(999).optional(),
  customer: z.object({
    email: z.string().email().optional(),
  }).optional(),
  metadata: metadataSchema,
})
