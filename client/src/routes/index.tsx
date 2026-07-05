import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { DashboardLayout } from '@/pages/Dashboard/DashboardLayout'
import { DashboardOverview } from '@/pages/Dashboard/DashboardOverview'
import { UsersPage } from '@/pages/Dashboard/UsersPage'
import { SubscriptionsPage } from '@/pages/Dashboard/SubscriptionsPage'
import { LandingPage } from '@/pages/Landing/LandingPage'

// Tools pages pull in the RNNoise WASM bundles (~1.9 MB each), so keep them
// out of the initial chunk and load on demand.
const NoiseRemoverBlogPage = lazy(() =>
  import('@/pages/Tools/NoiseRemoverBlogPage').then((m) => ({ default: m.NoiseRemoverBlogPage })),
)
const NoiseRemoverPage = lazy(() =>
  import('@/pages/Tools/NoiseRemoverPage').then((m) => ({ default: m.NoiseRemoverPage })),
)
const ToolStubPage = lazy(() =>
  import('@/pages/Tools/ToolStubPage').then((m) => ({ default: m.ToolStubPage })),
)

const AUTH_EMAIL_KEY = 'onelingo_mock_auth_email'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const email = window.localStorage.getItem(AUTH_EMAIL_KEY)
  if (!email) {
    return <Navigate replace to="/auth" />
  }
  return <>{children}</>
}

function ToolFallback() {
  return (
    <main className="min-h-screen" style={{ background: '#030308' }}>
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
          <span
            className="animate-spin rounded-full"
            style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#ff1f2e' }}
          />
          Loading tool…
        </div>
      </div>
    </main>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<ToolFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/login" element={<Navigate replace to="/auth" />} />
        <Route path="/tools/noise-remover" element={<NoiseRemoverBlogPage />} />
        <Route path="/tools/noise-remover/app" element={<NoiseRemoverPage />} />
        <Route path="/tools/:toolId" element={<ToolStubPage />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="analytics" element={<div className="text-sm text-gray-400">Analytics coming soon</div>} />
          <Route path="settings" element={<div className="text-sm text-gray-400">Settings coming soon</div>} />
        </Route>
      </Routes>
    </Suspense>
  )
}
