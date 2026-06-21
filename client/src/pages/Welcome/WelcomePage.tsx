import { Button } from '@/components/ui/button'
import { useCurrentUser, useLogout } from '@/features/auth/queries'

export function WelcomePage() {
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            {user?.name || user?.email}
          </h1>
        </div>
        <Button disabled={logout.isPending} onClick={() => logout.mutate()} variant="outline">
          {logout.isPending ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>

      <section className="mx-auto mt-16 w-full max-w-5xl border-t border-white/10 pt-10">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
          EasyLips
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-tight text-white">
          Welcome to your translation workspace.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
          Your account is ready. Continue setting up the live translation experience.
        </p>
      </section>
    </main>
  )
}
