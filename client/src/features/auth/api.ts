const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const ACCESS_TOKEN_KEY = 'onelingo_access_token'

export type AuthUser = {
  id: string
  email: string
  name?: string | null
  created_at?: string
}

export type AuthResponse = {
  user: AuthUser
  accessToken: string
}

export type LoginInput = {
  email: string
  password: string
}

export type SignupInput = LoginInput & {
  name?: string
}

type ApiErrorBody = {
  error?: {
    message?: string
    details?: unknown
  }
}

export class ApiRequestError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.details = details
  }
}

export function getAccessToken() {
  return window.localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
}

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const body = data as ApiErrorBody | null
    throw new ApiRequestError(
      body?.error?.message ?? 'Something went wrong. Please try again.',
      response.status,
      body?.error?.details,
    )
  }

  return data as T
}

async function refreshSession() {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  const data = await parseResponse<AuthResponse>(response)
  setAccessToken(data.accessToken)
  return data
}

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  shouldRetry = true,
): Promise<T> {
  const token = getAccessToken()
  const headers = new Headers(options.headers)

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (response.status === 401 && shouldRetry) {
    try {
      await refreshSession()
      return apiRequest<T>(path, options, false)
    } catch (error) {
      clearAccessToken()
      throw error
    }
  }

  return parseResponse<T>(response)
}

export async function login(input: LoginInput) {
  const data = await apiRequest<AuthResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    false,
  )
  setAccessToken(data.accessToken)
  return data
}

export async function signup(input: SignupInput) {
  const data = await apiRequest<AuthResponse>(
    '/auth/signup',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    false,
  )
  setAccessToken(data.accessToken)
  return data
}

export async function getCurrentUser() {
  if (!getAccessToken()) {
    const session = await refreshSession()
    return session.user
  }

  const data = await apiRequest<{ user: AuthUser }>('/auth/me')
  return data.user
}

export async function logout() {
  await apiRequest<{ ok: boolean }>('/auth/logout', { method: 'POST' }, false)
  clearAccessToken()
}
