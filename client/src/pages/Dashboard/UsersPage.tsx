import { useState, useEffect } from 'react'
import {
  Search,
  MoreHorizontal,
  Edit2,
  Key,
  CreditCard,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  plan: 'Free' | 'Starter' | 'Plus' | 'Pro'
  minutesUsed: number
  minutesTotal: number
  status: 'active' | 'inactive' | 'suspended'
  joined: string
  avatar: string
}

const mockUsers: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', plan: 'Pro', minutesUsed: 420, minutesTotal: 600, status: 'active', joined: '2025-12-15', avatar: 'S' },
  { id: '2', name: 'Mike Johnson', email: 'mike@company.io', plan: 'Starter', minutesUsed: 85, minutesTotal: 100, status: 'active', joined: '2026-01-08', avatar: 'M' },
  { id: '3', name: 'Alex Rivera', email: 'alex@gmail.com', plan: 'Plus', minutesUsed: 290, minutesTotal: 300, status: 'active', joined: '2025-11-22', avatar: 'A' },
  { id: '4', name: 'Jordan Lee', email: 'jordan@work.com', plan: 'Plus', minutesUsed: 180, minutesTotal: 300, status: 'active', joined: '2026-02-01', avatar: 'J' },
  { id: '5', name: 'Emma Wilson', email: 'emma@startup.io', plan: 'Free', minutesUsed: 12, minutesTotal: 30, status: 'active', joined: '2026-03-10', avatar: 'E' },
  { id: '6', name: 'David Park', email: 'david@tech.co', plan: 'Pro', minutesUsed: 550, minutesTotal: 600, status: 'active', joined: '2025-10-05', avatar: 'D' },
  { id: '7', name: 'Lisa Zhang', email: 'lisa@mail.com', plan: 'Starter', minutesUsed: 100, minutesTotal: 100, status: 'inactive', joined: '2026-01-20', avatar: 'L' },
  { id: '8', name: 'Tom Brown', email: 'tom@agency.com', plan: 'Free', minutesUsed: 30, minutesTotal: 30, status: 'suspended', joined: '2026-02-14', avatar: 'T' },
  { id: '9', name: 'Nina Patel', email: 'nina@corp.in', plan: 'Plus', minutesUsed: 145, minutesTotal: 300, status: 'active', joined: '2026-03-01', avatar: 'N' },
  { id: '10', name: 'Chris Adams', email: 'chris@dev.io', plan: 'Starter', minutesUsed: 67, minutesTotal: 100, status: 'active', joined: '2026-04-05', avatar: 'C' },
  { id: '11', name: 'Maria Garcia', email: 'maria@lang.org', plan: 'Pro', minutesUsed: 480, minutesTotal: 600, status: 'active', joined: '2025-09-18', avatar: 'M' },
  { id: '12', name: 'James Kim', email: 'james@nlp.co', plan: 'Free', minutesUsed: 5, minutesTotal: 30, status: 'active', joined: '2026-04-20', avatar: 'J' },
]

const plans = ['Free', 'Starter', 'Plus', 'Pro'] as const
const planColors: Record<string, string> = {
  Free: 'rgba(107,114,128,0.15)',
  Starter: 'rgba(59,130,246,0.15)',
  Plus: 'rgba(168,85,247,0.15)',
  Pro: 'rgba(220,38,38,0.15)',
}
const planTextColors: Record<string, string> = {
  Free: '#9CA3AF',
  Starter: '#3B82F6',
  Plus: '#A855F7',
  Pro: '#DC2626',
}
const statusColors: Record<string, string> = {
  active: '#22C55E',
  inactive: '#F59E0B',
  suspended: '#EF4444',
}

function EditUserModal({ user, onClose, onSave }: { user: User; onClose: () => void; onSave: (u: User) => void }) {
  const [form, setForm] = useState(user)
  const [newPassword, setNewPassword] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl p-6"
        style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit User</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <form autoComplete="off" onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Name</label>
            <input
              autoComplete="off"
              name="edit-user-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10 w-full rounded-lg border px-3 text-sm text-white outline-none"
              style={{ background: '#0B0B0F', borderColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
            <input
              autoComplete="off"
              name="edit-user-email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10 w-full rounded-lg border px-3 text-sm text-white outline-none"
              style={{ background: '#0B0B0F', borderColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Plan</label>
            <div className="flex gap-2">
              {plans.map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => setForm({ ...form, plan })}
                  className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  style={{
                    background: form.plan === plan ? planColors[plan] : 'rgba(255,255,255,0.03)',
                    color: form.plan === plan ? planTextColors[plan] : '#6B7280',
                    border: `1px solid ${form.plan === plan ? planTextColors[plan] + '30' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {plan}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Minutes Allowance</label>
            <input
              autoComplete="off"
              name="edit-user-minutes"
              type="number"
              value={form.minutesTotal}
              onChange={(e) => setForm({ ...form, minutesTotal: Number(e.target.value) })}
              className="h-10 w-full rounded-lg border px-3 text-sm text-white outline-none"
              style={{ background: '#0B0B0F', borderColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Status</label>
            <div className="flex gap-2">
              {(['active', 'inactive', 'suspended'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm({ ...form, status })}
                  className="flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-colors"
                  style={{
                    background: form.status === status ? statusColors[status] + '18' : 'rgba(255,255,255,0.03)',
                    color: form.status === status ? statusColors[status] : '#6B7280',
                    border: `1px solid ${form.status === status ? statusColors[status] + '30' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Reset Password</label>
            <input
              autoComplete="new-password"
              name="edit-user-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current"
              className="h-10 w-full rounded-lg border px-3 text-sm text-white outline-none placeholder:text-gray-600"
              style={{ background: '#0B0B0F', borderColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </form>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ background: '#DC2626' }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export function UsersPage() {
  const [users, setUsers] = useState(mockUsers)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (!target.closest('[data-action-menu]')) {
        setMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = planFilter === 'all' || u.plan === planFilter
    return matchSearch && matchPlan
  })

  function handleSave(updated: User) {
    setUsers(users.map((u) => (u.id === updated.id ? updated : u)))
    setEditingUser(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <p className="mt-1 text-sm text-gray-400">Manage your users, plans, and access.</p>
      </div>

      <div
        className="flex flex-col gap-4 rounded-xl p-4 sm:flex-row sm:items-center"
        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            autoComplete="off"
            name="search-users"
            className="h-10 w-full rounded-lg border pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-600"
            style={{ background: '#010104', borderColor: 'rgba(255,255,255,0.08)' }}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'Free', 'Starter', 'Plus', 'Pro'].map((plan) => (
            <button
              key={plan}
              onClick={() => setPlanFilter(plan)}
              className="rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors"
              style={{
                background: planFilter === plan ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.03)',
                color: planFilter === plan ? '#DC2626' : '#6B7280',
                border: `1px solid ${planFilter === plan ? 'rgba(220,38,38,0.25)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              {plan === 'all' ? 'All Plans' : plan}
            </button>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Minutes</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-9 items-center justify-center rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(220,38,38,0.12)', color: '#DC2626' }}
                      >
                        {user.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ background: planColors[user.plan], color: planTextColors[user.plan] }}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(user.minutesUsed / user.minutesTotal) * 100}%`,
                            background: user.minutesUsed >= user.minutesTotal ? '#EF4444' : '#DC2626',
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {user.minutesUsed}/{user.minutesTotal}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full" style={{ background: statusColors[user.status] }} />
                      <span className="text-xs capitalize text-gray-400">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{user.joined}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div data-action-menu className="relative inline-block">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === user.id ? null : user.id) }}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                      {menuOpen === user.id && (
                        <div
                          className="absolute right-0 z-50 mt-1 w-44 rounded-lg py-1.5"
                          style={{ background: '#1A1A1F', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingUser(user); setMenuOpen(null) }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            <Edit2 className="size-3.5" />
                            Edit Profile
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingUser(user); setMenuOpen(null) }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            <CreditCard className="size-3.5" />
                            Change Plan
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingUser(user); setMenuOpen(null) }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                          >
                            <Key className="size-3.5" />
                            Reset Password
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {users.length} users
        </p>
        <div className="flex items-center gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ChevronLeft className="size-4" />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className="flex size-8 items-center justify-center rounded-lg text-sm font-medium transition-colors"
              style={{
                background: p === 1 ? 'rgba(220,38,38,0.12)' : 'transparent',
                color: p === 1 ? '#DC2626' : '#6B7280',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {p}
            </button>
          ))}
          <button
            className="flex size-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {editingUser && (
        <EditUserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSave} />
      )}
    </div>
  )
}
