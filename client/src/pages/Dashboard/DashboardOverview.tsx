import {
  Users,
  CreditCard,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

const stats = [
  {
    label: 'Total Users',
    value: '12,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Active Subscriptions',
    value: '3,421',
    change: '+8.2%',
    trend: 'up',
    icon: CreditCard,
  },
  {
    label: 'Minutes Used',
    value: '1.2M',
    change: '+23.1%',
    trend: 'up',
    icon: Clock,
  },
  {
    label: 'Monthly Revenue',
    value: '$48,352',
    change: '-2.4%',
    trend: 'down',
    icon: TrendingUp,
  },
]

const userGrowthData = [
  { month: 'Jan', users: 4200, paid: 1800 },
  { month: 'Feb', users: 5100, paid: 2100 },
  { month: 'Mar', users: 6300, paid: 2400 },
  { month: 'Apr', users: 7800, paid: 2900 },
  { month: 'May', users: 9200, paid: 3100 },
  { month: 'Jun', users: 10800, paid: 3300 },
  { month: 'Jul', users: 12847, paid: 3421 },
]

const revenueData = [
  { month: 'Jan', revenue: 28400 },
  { month: 'Feb', revenue: 31200 },
  { month: 'Mar', revenue: 35800 },
  { month: 'Apr', revenue: 38400 },
  { month: 'May', revenue: 42100 },
  { month: 'Jun', revenue: 45600 },
  { month: 'Jul', revenue: 48352 },
]

const usageData = [
  { day: 'Mon', minutes: 42000 },
  { day: 'Tue', minutes: 38000 },
  { day: 'Wed', minutes: 51000 },
  { day: 'Thu', minutes: 47000 },
  { day: 'Fri', minutes: 58000 },
  { day: 'Sat', minutes: 34000 },
  { day: 'Sun', minutes: 29000 },
]

const recentActivity = [
  { user: 'sarah@example.com', action: 'Upgraded to Pro', time: '2 min ago', plan: 'Pro' },
  { user: 'mike@company.io', action: 'Signed up', time: '15 min ago', plan: 'Starter' },
  { user: 'alex@gmail.com', action: 'Used 45 min', time: '1 hr ago', plan: 'Plus' },
  { user: 'jordan@work.com', action: 'Upgraded to Plus', time: '2 hr ago', plan: 'Plus' },
  { user: 'emma@startup.io', action: 'Signed up', time: '3 hr ago', plan: 'Starter' },
]

function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  return (
    <div
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
        <div className="mt-1 flex items-center gap-1">
          {stat.trend === 'up' ? (
            <ArrowUpRight className="size-3.5" style={{ color: '#22C55E' }} />
          ) : (
            <ArrowDownRight className="size-3.5" style={{ color: '#EF4444' }} />
          )}
          <span
            className="text-xs font-medium"
            style={{ color: stat.trend === 'up' ? '#22C55E' : '#EF4444' }}
          >
            {stat.change}
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      </div>
    </div>
  )
}

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

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Overview</h1>
        <p className="mt-1 text-sm text-gray-400">Welcome back. Here&apos;s what&apos;s happening.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div
          className="rounded-xl p-5 lg:col-span-4"
          style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-sm font-medium text-white">User Growth</h3>
          <p className="mt-1 text-xs text-gray-500">Total vs paid users over time</p>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="users" name="Total" stroke="#DC2626" strokeWidth={2} fill="url(#userGradient)" />
                <Area type="monotone" dataKey="paid" name="Paid" stroke="#DC2626" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#paidGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-xl p-5 lg:col-span-3"
          style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-sm font-medium text-white">Recent Activity</h3>
          <p className="mt-1 text-xs text-gray-500">Latest user actions</p>
          <div className="mt-4 space-y-3">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg px-3 py-2.5"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{item.user}</p>
                  <p className="text-xs text-gray-500">{item.action}</p>
                </div>
                <div className="ml-3 flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: 'rgba(220,38,38,0.1)',
                      color: '#DC2626',
                    }}
                  >
                    {item.plan}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-xl p-5"
          style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-sm font-medium text-white">Revenue</h3>
          <p className="mt-1 text-xs text-gray-500">Monthly recurring revenue</p>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#DC2626" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ background: '#0B0B0F', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3 className="text-sm font-medium text-white">Usage This Week</h3>
          <p className="mt-1 text-xs text-gray-500">Minutes consumed per day</p>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="minutes" name="Minutes" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
