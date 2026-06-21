import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ApiRequestError } from './api'
import { useLogin, useSignup } from './queries'

type AuthFormProps = {
  mode: 'login' | 'signup'
}

type FieldName = 'name' | 'email' | 'password'
type FormValues = Record<FieldName, string>
type FieldErrors = Partial<Record<FieldName, string>>

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
}

export function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === 'signup'
  const loginMutation = useLogin()
  const signupMutation = useSignup()
  const mutation = isSignup ? signupMutation : loginMutation
  const [values, setValues] = useState<FormValues>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateForm(values, isSignup)
    setTouched({ email: true, name: true, password: true })
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      mutation.reset()
      return
    }

    const email = values.email.trim().toLowerCase()
    const password = values.password
    const name = values.name.trim()

    if (isSignup) {
      signupMutation.mutate(
        { email, password, ...(name ? { name } : {}) },
        { onError: (error) => setFieldErrors(getServerFieldErrors(error, isSignup)) },
      )
      return
    }

    loginMutation.mutate(
      { email, password },
      { onError: (error) => setFieldErrors(getServerFieldErrors(error, isSignup)) },
    )
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target
    const field = name as FieldName
    const nextValues = { ...values, [field]: value }
    setValues(nextValues)

    if (mutation.error) {
      mutation.reset()
    }

    if (touched[field] || fieldErrors[field]) {
      setFieldErrors((current) => ({
        ...current,
        [field]: validateField(field, nextValues[field], isSignup),
      }))
    }
  }

  function handleBlur(field: FieldName) {
    setTouched((current) => ({ ...current, [field]: true }))
    setFieldErrors((current) => ({
      ...current,
      [field]: validateField(field, values[field], isSignup),
    }))
  }

  const errorMessage =
    mutation.error instanceof ApiRequestError
      ? getFormErrorMessage(mutation.error, isSignup)
      : mutation.error
        ? 'Something went wrong. Please try again.'
        : null
  const hasFieldErrors = useMemo(
    () => Object.values(fieldErrors).some(Boolean),
    [fieldErrors],
  )
  const submitDisabled = mutation.isPending || hasFieldErrors

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 lg:grid-cols-[minmax(0,1fr)_440px]">
        <section className="hidden min-h-screen flex-col justify-between border-r border-white/10 px-10 py-10 lg:flex xl:px-12">
          <Link to="/" className="flex w-fit items-center gap-3 no-underline">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-black text-background">
              EL
            </span>
            <span className="text-base font-semibold text-white">BetterLips</span>
          </Link>

          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.22em] text-primary">
              Real-time translation
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-white xl:text-5xl">
              Keep your voice ready across every language.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Sign in to continue setting up your EasyLips workspace and manage your
              translation experience.
            </p>
          </div>

          <p className="text-sm text-muted-foreground">Your workspace stays ready when you return.</p>
        </section>

        <main className="flex min-h-screen items-center justify-center px-5 py-8 sm:px-8 sm:py-10">
          <div className="w-full max-w-[420px]">
            <Link to="/" className="mb-10 flex w-fit items-center gap-3 no-underline lg:hidden">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-black text-background">
                EL
              </span>
              <span className="text-base font-semibold text-white">BetterLips</span>
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-white">
                {isSignup ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {isSignup
                  ? 'Use your email and password to start your account.'
                  : 'Use your email and password to continue.'}
              </p>
            </div>

            <form className="space-y-4" noValidate onSubmit={handleSubmit}>
              {isSignup ? (
                <Field
                  autoComplete="name"
                  error={fieldErrors.name}
                  label="Name"
                  name="name"
                  onBlur={() => handleBlur('name')}
                  onChange={handleChange}
                  placeholder="Furqan"
                  type="text"
                  value={values.name}
                />
              ) : null}

              <Field
                autoComplete="email"
                error={fieldErrors.email}
                label="Email"
                name="email"
                onBlur={() => handleBlur('email')}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                type="email"
                value={values.email}
              />

              <Field
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                error={fieldErrors.password}
                hint={isSignup ? 'Use at least 8 characters.' : undefined}
                label="Password"
                name="password"
                onBlur={() => handleBlur('password')}
                onChange={handleChange}
                placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
                required
                type="password"
                value={values.password}
              />

              {errorMessage ? (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              ) : null}

              <Button className="h-11 w-full text-sm font-semibold" disabled={submitDisabled} type="submit">
                {mutation.isPending
                  ? isSignup
                    ? 'Creating account...'
                    : 'Signing in...'
                  : isSignup
                    ? 'Create account'
                    : 'Sign in'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
              <Link className="font-medium text-primary hover:underline" to={isSignup ? '/login' : '/signup'}>
                {isSignup ? 'Sign in' : 'Sign up'}
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

type FieldProps = {
  autoComplete: string
  error?: string
  hint?: string
  label: string
  name: FieldName
  onBlur: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  required?: boolean
  type: string
  value: string
}

function Field({
  autoComplete,
  error,
  hint,
  label,
  name,
  onBlur,
  onChange,
  placeholder,
  required,
  type,
  value,
}: FieldProps) {
  const messageId = `${name}-message`

  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-white">
        {label}
        {required ? <span className="text-xs text-muted-foreground">Required</span> : null}
      </span>
      <input
        aria-describedby={error || hint ? messageId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className={cn(
          'h-11 w-full rounded-lg border bg-white/[0.04] px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:ring-3',
          error
            ? 'border-destructive/60 focus:border-destructive focus:ring-destructive/20'
            : 'border-white/10 focus:border-primary focus:ring-primary/20',
        )}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? (
        <p className="mt-2 text-sm leading-5 text-destructive" id={messageId}>
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-sm leading-5 text-muted-foreground" id={messageId}>
          {hint}
        </p>
      ) : null}
    </label>
  )
}

function validateForm(values: FormValues, isSignup: boolean) {
  const errors: FieldErrors = {}

  ;(['name', 'email', 'password'] as FieldName[]).forEach((field) => {
    const error = validateField(field, values[field], isSignup)
    if (error) {
      errors[field] = error
    }
  })

  return errors
}

function validateField(field: FieldName, value: string, isSignup: boolean) {
  const trimmed = value.trim()

  if (field === 'name') {
    if (!isSignup || !trimmed) return undefined
    if (trimmed.length > 120) return 'Name must be 120 characters or less.'
    return undefined
  }

  if (field === 'email') {
    if (!trimmed) return 'Email is required.'
    if (trimmed.length > 254) return 'Email must be 254 characters or less.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Enter a valid email address.'
    }
    return undefined
  }

  if (!value) return 'Password is required.'
  if (isSignup && value.length < 8) return 'Password must be at least 8 characters.'
  if (value.length > 128) return 'Password must be 128 characters or less.'
  return undefined
}

function getFormErrorMessage(error: ApiRequestError, isSignup: boolean) {
  if (!isSignup && error.status === 401) {
    return 'No matching account was found. Check your email and password.'
  }
  return error.message
}

function getServerFieldErrors(error: unknown, isSignup: boolean) {
  if (!(error instanceof ApiRequestError)) return {}

  if (!isSignup && error.status === 401) {
    return {
      email: 'Account must exist before you can sign in.',
      password: 'Check the password for this account.',
    }
  }

  if (isSignup && error.status === 409) {
    return { email: 'An account with this email already exists.' }
  }

  const fieldErrors = extractFieldErrors(error.details)
  return fieldErrors
}

function extractFieldErrors(details: unknown) {
  const errors: FieldErrors = {}

  if (!details || typeof details !== 'object' || !('fieldErrors' in details)) {
    return errors
  }

  const fieldErrors = (details as { fieldErrors?: Partial<Record<FieldName, string[]>> })
    .fieldErrors
  if (!fieldErrors) return errors

  ;(['name', 'email', 'password'] as FieldName[]).forEach((field) => {
    const messages = fieldErrors[field]
    if (messages?.[0]) {
      errors[field] = messages[0]
    }
  })

  return errors
}
