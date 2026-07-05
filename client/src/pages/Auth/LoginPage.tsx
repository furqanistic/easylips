import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const AUTH_EMAIL_KEY = 'onelingo_mock_auth_email'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError('Enter a valid email address.')
      return
    }

    if (!password) {
      setError('Enter your password.')
      return
    }

    window.localStorage.setItem(AUTH_EMAIL_KEY, normalizedEmail)
    navigate('/dashboard', { replace: true })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-8 text-foreground">
      <section className="w-full max-w-[420px]">
        <Link to="/" className="mb-10 flex w-fit items-center no-underline">
          <img src="/assets/logoicon.png" alt="OneLingo" className="h-11 w-auto object-contain" />
        </Link>

        <div className="mb-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.22em] text-primary">
            Login
          </p>
          <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Enter any email and password to continue for now.
          </p>
        </div>

        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-white">
              Email
              <span className="text-xs text-muted-foreground">Required</span>
            </span>
            <input
              aria-describedby={error ? 'email-error' : undefined}
              aria-invalid={Boolean(error)}
              autoComplete="email"
              className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary focus:ring-3 focus:ring-primary/20"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value)
                if (error) setError('')
              }}
              placeholder="you@example.com"
              type="email"
              value={email}
            />
            {error ? (
              <p className="mt-2 text-sm leading-5 text-destructive" id="email-error">
                {error}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-2 flex items-center justify-between gap-3 text-sm font-medium text-white">
              Password
              <span className="text-xs text-muted-foreground">Required</span>
            </span>
            <input
              autoComplete="current-password"
              className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-primary focus:ring-3 focus:ring-primary/20"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value)
                if (error) setError('')
              }}
              placeholder="Your password"
              type="password"
              value={password}
            />
          </label>

          <Button className="h-11 w-full text-sm font-semibold" type="submit">
            Log in
          </Button>
        </form>
      </section>
    </main>
  )
}
