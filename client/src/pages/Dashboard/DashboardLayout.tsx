import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const AUTH_EMAIL_KEY = 'easylips_mock_auth_email'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Users', href: '/dashboard/users', icon: Users },
  { name: 'Subscriptions', href: '/dashboard/subscriptions', icon: CreditCard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const email = window.localStorage.getItem(AUTH_EMAIL_KEY) || 'admin@redlips.ai'

  function handleLogout() {
    window.localStorage.removeItem(AUTH_EMAIL_KEY)
    navigate('/auth', { replace: true })
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#010104' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r transition-transform duration-200 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{
          background: '#0B0B0F',
          borderColor: 'rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex h-16 items-center gap-3 border-b px-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <span className="flex size-8 items-center justify-center rounded-lg text-sm font-bold" style={{ background: '#DC2626', color: '#010104' }}>
            RL
          </span>
          <span className="text-base font-semibold text-white">RedLips</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/dashboard'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                )
              }
              style={({ isActive }) =>
                isActive
                  ? { background: 'rgba(220,38,38,0.1)', color: '#DC2626' }
                  : undefined
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="size-4 shrink-0" style={isActive ? { color: '#DC2626' } : undefined} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t px-3 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4 shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex h-16 items-center justify-between border-b px-6"
          style={{ background: '#0B0B0F', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <button className="relative rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white">
              <Bell className="size-5" />
              <span
                className="absolute right-1.5 top-1.5 size-2 rounded-full"
                style={{ background: '#DC2626' }}
              />
            </button>

            <button className="flex items-center gap-2 rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white">
              <div
                className="flex size-8 items-center justify-center rounded-full text-xs font-semibold"
                style={{ background: 'rgba(220,38,38,0.15)', color: '#DC2626' }}
              >
                {email.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-white sm:block">{email}</span>
              <ChevronDown className="hidden size-4 sm:block" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
