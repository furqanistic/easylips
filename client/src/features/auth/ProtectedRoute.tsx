import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCurrentUser } from './queries'

export function ProtectedRoute() {
  const location = useLocation()
  const currentUser = useCurrentUser()

  if (currentUser.isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Checking your session...
      </main>
    )
  }

  if (currentUser.isError) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  return <Outlet />
}
