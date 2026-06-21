import { z } from 'zod'

export const signupSchema = z.object({
  email: z.string().email('Invalid email').max(254).toLowerCase().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  name: z.string().min(1).max(120).trim().optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email').max(254).toLowerCase().trim(),
  password: z.string().min(1, 'Password is required').max(128),
})

export const googleOAuthSchema = z.object({
  code: z.string().min(1, 'Google authorization code is required'),
  codeVerifier: z.string().min(43).max(128),
  redirectUri: z.string().url('Google redirect URI must be a URL'),
  nonce: z.string().min(16).max(128).optional(),
})
