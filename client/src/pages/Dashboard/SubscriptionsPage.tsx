import { useState } from 'react'
import {
  TrendingUp,
  Users,
  CreditCard,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

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

const stats = [
  { label: 'Monthly Recurring Revenue', value: '$48,352', change: '+8.2%', trend: 'up', icon: DollarSign },
  { label: 'Active Plans', value: '3,421', change: '+5.7%', trend: 'up', icon: CreditCard },
  { label: 'Total Subscribers', value: '4,892', change: '+12.3%', trend: 'up', icon: Users },
  { label: 'Churn Rate', value: '2.1%', change: '-0.4%', trend: 'down', icon: TrendingUp },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    subscribers: 1471,
    revenue: 0,
    color: planColors.Free,
    textColor: planTextColors.Free,
    features: ['30 min/month', '1 language pair', 'Basic support'],
  },
  {
    name: 'Starter',
    price: '$4.99',
    subscribers: 892,
    revenue: 4451,
    color: planColors.Starter,
    textColor: planTextColors.Starter,
    features: ['100 min/month', '5 language pairs', 'Email support', 'Basic quality'],
  },
  {
    name: 'Plus',
    price: '$14.99',
    subscribers: 643,
    revenue: 9636,
    color: planColors.Plus,
    textColor: planTextColors.Plus,
    features: ['300 min/month', '20 language pairs', 'Priority support', 'HD quality', 'Custom voice'],
  },
  {
    name: 'Pro',
    price: '$39.99',
    subscribers: 415,
    revenue: 16596,
    color: planColors.Pro,
    textColor: planTextColors.Pro,
    features: ['600 min/month', 'All languages', '24/7 support', 'Studio quality', 'API access', 'Team seats'],
  },
]

const recentSubscriptions = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@example.com', plan: 'Pro', amount: 39.99, status: 'active', date: '2026-06-22', method: 'Visa ••4242' },
  { id: '2', name: 'Mike Johnson', email: 'mike@company.io', plan: 'Starter', amount: 4.99, status: 'active', date: '2026-06-21', method: 'Mastercard ••8888' },
  { id: '3', name: 'Alex Rivera', email: 'alex@gmail.com', plan: 'Plus', amount: 14.99, status: 'active', date: '2026-06-20', method: 'Amex ••3002' },
  { id: '4', name: 'Nina Patel', email: 'nina@corp.in', plan: 'Plus', amount: 14.99, status: 'active', date: '2026-06-19', method: 'Visa ••1234' },
  { id: '5', name: 'David Park', email: 'david@tech.co', plan: 'Pro', amount: 39.99, status: 'past_due', date: '2026-06-18', method: 'Visa ••5678' },
  { id: '6', name: 'Emma Wilson', email: 'emma@startup.io', plan: 'Free', amount: 0, status: 'active', date: '2026-06-17', method: '—' },
  { id: '7', name: 'Chris Adams', email: 'chris@dev.io', plan: 'Starter', amount: 4.99, status: 'active', date: '2026-06-16', method: 'Mastercard ••9999' },
  { id: '8', name: 'Lisa Zhang', email: 'lisa@mail.com', plan: 'Starter', amount: 4.99, status: 'canceled', date: '2026-06-15', method: 'Visa ••4321' },
]

const revenueData = [
  { month: 'Jan', revenue: 28400, subscribers: 2800 },
  { month: 'Feb', revenue: 31200, subscribers: 3100 },
  { month: 'Mar', revenue: 35800, subscribers: 3400 },
  { month: 'Apr', revenue: 38400, subscribers: 3700 },
  { month: 'May', revenue: 42100, subscribers: 4100 },
  { month: 'Jun', revenue: 45600, subscribers: 4400 },
  { month: 'Jul', revenue: 48352, subscribers: 4892 },
]

const planDistribution = [
  { plan: 'Free', count: 1471, fill: '#6B7280' },
  { plan: 'Starter', count: 892, fill: '#3B82F6' },
  { plan: 'Plus', count: 643, fill: '#A855F7' },
  { plan: 'Pro', count: 415, fill: '#DC2626' },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{ background: '#1A1A1F', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <p className="text-gray-400">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="font-medium text-white">
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  )
}

function SubscriptionDetailModal({ sub, onClose }: { sub: (typeof recentSubscriptions)[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl p-6"
        style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Subscription Details</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-white/5 hover:text-white">
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div
              className="flex size-10 items-center justify-center rounded-full text-sm font-semibold"
              style={{ background: 'rgba(220,38,38,0.12)', color: '#DC2626' }}
            >
              {sub.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{sub.name}</p>
              <p className="text-xs text-gray-500">{sub.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs text-gray-500">Plan</p>
              <span
                className="mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: planColors[sub.plan], color: planTextColors[sub.plan] }}
              >
                {sub.plan}
              </span>
            </div>
            <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="mt-1 text-sm font-medium text-white">{sub.amount === 0 ? 'Free' : `$${sub.amount}/mo`}</p>
            </div>
            <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs text-gray-500">Status</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className="size-1.5 rounded-full"
                  style={{
                    background: sub.status === 'active' ? '#22C55E' : sub.status === 'past_due' ? '#F59E0B' : '#EF4444',
                  }}
                />
                <span className="text-sm font-medium capitalize text-white">{sub.status.replace('_', ' ')}</span>
              </div>
            </div>
            <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="mt-1 text-sm font-medium text-white">{sub.method}</p>
            </div>
          </div>

          <div className="rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-xs text-gray-500">Started On</p>
            <p className="mt-1 text-sm font-medium text-white">{sub.date}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Close
          </button>
          <button
            className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
            style={{ background: '#DC2626' }}
          >
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  )
}

export function SubscriptionsPage() {
  const [search, setSearch] = useState('')
  const [selectedSub, setSelectedSub] = useState<(typeof recentSubscriptions)[0] | null>(null)

  const filtered = recentSubscriptions.filter((s) => {
    const q = search.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.plan.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-400">Manage plans, billing, and renewals.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-5"
            style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              <div
                className="flex size-9 items-center justify-center rounded-lg"
                style={{ background: 'rgba(220,38,38,0.1)' }}
              >
                <stat.icon className="size-4" style={{ color: '#DC2626' }} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-xs" style={{ color: stat.trend === 'up' ? '#22C55E' : '#EF4444' }}>
                {stat.change} vs last month
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div
          className="rounded-xl p-5 lg:col-span-4"
          style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-sm font-medium text-white">Revenue & Growth</h3>
          <p className="mt-1 text-xs text-gray-500">Monthly recurring revenue and subscriber count</p>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis
                  yAxisId="revenue"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="subs"
                  orientation="right"
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area yAxisId="revenue" type="monotone" dataKey="revenue" name="Revenue" stroke="#DC2626" strokeWidth={2} fill="url(#revGrad)" />
                <Area yAxisId="subs" type="monotone" dataKey="subscribers" name="Subscribers" stroke="#A855F7" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-xl p-5 lg:col-span-3"
          style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-sm font-medium text-white">Plan Distribution</h3>
          <p className="mt-1 text-xs text-gray-500">Subscribers per plan</p>
          <div className="mt-4 space-y-3">
            {planDistribution.map((p) => (
              <div key={p.plan} className="flex items-center gap-3">
                <span className="w-14 text-sm font-medium text-gray-300">{p.plan}</span>
                <div className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(p.count / 4892) * 100}%`, background: p.fill }}
                    />
                  </div>
                </div>
                <span className="w-14 text-right text-sm text-gray-400">{p.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="font-medium text-white">4,892</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-xl p-5 transition-all hover:translate-y-[-2px]"
            style={{
              background: '#0B0B0F',
              border: `1px solid ${
                plan.name === 'Pro' ? 'rgba(220,38,38,0.2)' : 'rgba(255,255,255,0.06)'
              }`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{ background: plan.color, color: plan.textColor }}
              >
                {plan.name}
              </span>
              <span className="text-xs text-gray-500">{plan.subscribers} users</span>
            </div>
            <p className="mt-4 text-2xl font-semibold text-white">
              {plan.price}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="size-1 rounded-full" style={{ background: plan.textColor }} />
                  {f}
                </li>
              ))}
            </ul>
            {plan.revenue > 0 && (
              <p className="mt-4 text-xs text-gray-500">
                Revenue:{' '}
                <span className="font-medium text-white">${plan.revenue.toLocaleString()}/mo</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-medium text-white">Recent Subscriptions</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subscriptions..."
              autoComplete="off"
              name="sub-search"
              className="h-9 w-full rounded-lg border pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-600"
              style={{ background: '#010104', borderColor: 'rgba(255,255,255,0.08)' }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Subscriber</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Plan</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className="transition-colors hover:bg-white/[0.02]"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-9 items-center justify-center rounded-full text-xs font-semibold"
                        style={{ background: 'rgba(220,38,38,0.12)', color: '#DC2626' }}
                      >
                        {sub.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{sub.name}</p>
                        <p className="text-xs text-gray-500">{sub.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ background: planColors[sub.plan], color: planTextColors[sub.plan] }}
                    >
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-white">
                    {sub.amount === 0 ? '—' : `$${sub.amount}`}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="size-1.5 rounded-full"
                        style={{
                          background: sub.status === 'active' ? '#22C55E' : sub.status === 'past_due' ? '#F59E0B' : '#EF4444',
                        }}
                      />
                      <span className="text-xs capitalize text-gray-400">{sub.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{sub.date}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedSub(sub)}
                      className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    No subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filtered.length} of {recentSubscriptions.length} subscriptions
        </p>
        <div className="flex items-center gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-lg text-gray-400"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ChevronLeft className="size-4" />
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              className="flex size-8 items-center justify-center rounded-lg text-sm font-medium"
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
            className="flex size-8 items-center justify-center rounded-lg text-gray-400"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {selectedSub && (
        <SubscriptionDetailModal sub={selectedSub} onClose={() => setSelectedSub(null)} />
      )}
    </div>
  )
}
