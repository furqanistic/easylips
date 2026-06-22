import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/pages/Auth/LoginPage'
import { DashboardLayout } from '@/pages/Dashboard/DashboardLayout'
import { DashboardOverview } from '@/pages/Dashboard/DashboardOverview'
import { UsersPage } from '@/pages/Dashboard/UsersPage'
import { SubscriptionsPage } from '@/pages/Dashboard/SubscriptionsPage'
import { LandingPage } from '@/pages/Landing/LandingPage'

const AUTH_EMAIL_KEY = 'easylips_mock_auth_email'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const email = window.localStorage.getItem(AUTH_EMAIL_KEY)
  if (!email) {
    return <Navigate replace to="/auth" />
  }
  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/login" element={<Navigate replace to="/auth" />} />
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
  )
}
