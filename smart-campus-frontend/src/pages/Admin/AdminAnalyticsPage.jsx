import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Building2,
    CalendarCheck,
    Ticket,
    Users,
    BarChart3,
    LogOut,
    Sparkles,
    ChevronRight,
    GraduationCap,
    Download,
    TrendingUp,
    Calendar,
    Activity,
    XCircle,
    Trophy,
    PieChart as PieChartIcon,
    PercentSquare,
} from 'lucide-react'
import { clearToken } from '../../services/auth'

const menuItems = [
    { label: 'Resources', icon: Building2 },
    { label: 'Bookings', icon: CalendarCheck },
    { label: 'Tickets', icon: Ticket },
    { label: 'Users', icon: Users },
    { label: 'Analytics', icon: BarChart3 },
]

const statCards = [
    { label: 'Total Bookings', value: '892', subtext: '↑18% vs last semester', accent: 'border-blue-200' },
    { label: 'Avg Daily Bookings', value: '22.3', subtext: '↑4.1 from last month', accent: 'border-emerald-200' },
    { label: 'Peak Utilization', value: '94%', subtext: 'Tuesdays 10–12 PM', accent: 'border-amber-200' },
    { label: 'Cancellation Rate', value: '5.5%', subtext: '↑0.8% vs last month', accent: 'border-violet-200' },
]

const STAT_META = [
    { icon: CalendarCheck, iconBg: 'bg-blue-50', iconText: 'text-blue-600', ring: 'ring-blue-100', bar: 'from-blue-500 to-indigo-500' },
    { icon: Activity, iconBg: 'bg-emerald-50', iconText: 'text-emerald-600', ring: 'ring-emerald-100', bar: 'from-emerald-500 to-teal-500' },
    { icon: TrendingUp, iconBg: 'bg-amber-50', iconText: 'text-amber-600', ring: 'ring-amber-100', bar: 'from-amber-500 to-orange-500' },
    { icon: XCircle, iconBg: 'bg-violet-50', iconText: 'text-violet-600', ring: 'ring-violet-100', bar: 'from-violet-500 to-fuchsia-500' },
]

const weeklyBars = [
    { day: 'Mon', value: 36 },
    { day: 'Tue', value: 50 },
    { day: 'Wed', value: 43 },
    { day: 'Thu', value: 52 },
    { day: 'Fri', value: 33 },
    { day: 'Sat', value: 14 },
    { day: 'Sun', value: 5 },
]

const monthlyBars = [
    { month: 'Jan', value: 220 },
    { month: 'Feb', value: 260 },
    { month: 'Mar', value: 305 },
    { month: 'Apr', value: 240 },
]

const topResources = [
    { label: 'Computer Lab B-204', value: 48 },
    { label: 'Lecture Hall A-101', value: 41 },
    { label: 'Meeting Room C-305', value: 36 },
    { label: 'Media Studio E-202', value: 27 },
    { label: 'Lab D-110', value: 19 },
]

const RANK_STYLES = [
    'from-amber-400 to-orange-500 shadow-amber-500/30',
    'from-slate-300 to-slate-500 shadow-slate-400/30',
    'from-orange-300 to-amber-600 shadow-orange-500/30',
    'from-blue-500 to-indigo-500 shadow-blue-500/30',
    'from-violet-500 to-fuchsia-500 shadow-violet-500/30',
]

const resourcesByType = [
    { label: 'Computer Labs', value: '35%', color: 'bg-blue-500' },
    { label: 'Lecture Halls', value: '25%', color: 'bg-emerald-500' },
    { label: 'Meeting Rooms', value: '18%', color: 'bg-violet-500' },
    { label: 'Equipment', value: '14%', color: 'bg-amber-500' },
    { label: 'Studios & Other', value: '8%', color: 'bg-rose-500' },
]

const TYPE_GRADIENTS = {
    'bg-blue-500': 'from-blue-500 to-indigo-500',
    'bg-emerald-500': 'from-emerald-500 to-teal-500',
    'bg-violet-500': 'from-violet-500 to-fuchsia-500',
    'bg-amber-500': 'from-amber-500 to-orange-500',
    'bg-rose-500': 'from-rose-500 to-pink-500',
}

const bookingSplit = [
    { label: 'Approved', value: '76%', color: 'bg-emerald-500', width: 'w-[76%]' },
    { label: 'Pending', value: '18%', color: 'bg-amber-500', width: 'w-[18%]' },
    { label: 'Cancelled', value: '6%', color: 'bg-rose-500', width: 'w-[6%]' },
]

const SPLIT_GRADIENTS = {
    'bg-emerald-500': 'from-emerald-500 to-teal-500',
    'bg-amber-500': 'from-amber-500 to-orange-500',
    'bg-rose-500': 'from-rose-500 to-pink-500',
}

function AdminAnalyticsPage() {
    const navigate = useNavigate()

    const logout = () => {
        clearToken()
        navigate('/auth')
    }

    const handleMenuClick = (item) => {
        if (item === 'Users') {
            navigate('/dashboard/admin/users')
            return
        }

        if (item === 'Analytics') {
            navigate('/dashboard/admin/analytics')
            return
        }

        navigate('/dashboard/admin')
    }

    const maxWeekly = Math.max(...weeklyBars.map((b) => b.value))
    const maxMonthly = Math.max(...monthlyBars.map((b) => b.value))

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                {/* ── Sidebar ─────────────────────────────────────────── */}
                <aside className="relative flex flex-col bg-gradient-to-b from-[#0b1a3a] via-[#0c1f44] to-[#0a1730] text-slate-200">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_60%)]" />

                    <div className="relative border-b border-white/10 px-5 py-6">
                        <div className="flex items-center gap-3">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-900/40">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-lg font-bold tracking-tight text-white">SmartCampus</p>
                                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/80">Admin Portal</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative px-3 py-5">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Main Menu</p>
                        <button
                            onClick={() => navigate('/dashboard/admin')}
                            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </button>
                    </div>

                    <div className="relative px-3 py-2">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Other Modules</p>
                        <div className="mt-2 space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = item.label === 'Analytics'
                                return (
                                    <button
                                        key={item.label}
                                        onClick={() => handleMenuClick(item.label)}
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                                            isActive
                                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 font-semibold text-white shadow-lg shadow-cyan-900/30'
                                                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span className="flex-1">{item.label}</span>
                                        {!isActive && <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="relative mt-auto border-t border-white/10 px-4 py-4">
                        <button
                            type="button"
                            onClick={logout}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-500/20"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </aside>

                {/* ── Main content ────────────────────────────────────── */}
                <main className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-700">
                                <Sparkles className="h-3 w-3" />
                                Insights
                            </div>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h1>
                            <p className="mt-1 text-sm text-slate-500">Utilization and booking trends for the current semester.</p>
                        </div>
                        <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-900/20 transition hover:from-cyan-700 hover:to-blue-700">
                            <Download className="h-4 w-4" />
                            Export Report
                        </button>
                    </div>

                    {/* Stat cards */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {statCards.map((card, idx) => {
                            const meta = STAT_META[idx]
                            const Icon = meta.icon
                            return (
                                <article
                                    key={card.label}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${meta.bar} opacity-[0.08] blur-2xl transition group-hover:opacity-[0.2]`} />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                                            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{card.value}</p>
                                            <p className="mt-2 text-xs text-slate-500">{card.subtext}</p>
                                        </div>
                                        <div className={`grid h-11 w-11 place-items-center rounded-xl ${meta.iconBg} ring-4 ${meta.ring}`}>
                                            <Icon className={`h-5 w-5 ${meta.iconText}`} />
                                        </div>
                                    </div>
                                    <div className={`mt-4 h-1 w-full rounded-full bg-gradient-to-r ${meta.bar} opacity-80`} />
                                </article>
                            )
                        })}
                    </section>

                    {/* Weekly + Monthly charts */}
                    <section className="mt-6 grid gap-5 xl:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                        <BarChart3 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Bookings — This Week</h3>
                                        <p className="text-xs text-slate-500">Daily breakdown</p>
                                    </div>
                                </div>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    7 days
                                </span>
                            </div>
                            <div className="mt-6 flex h-52 items-end gap-3">
                                {weeklyBars.map((item) => (
                                    <div key={item.day} className="group/bar flex flex-1 flex-col items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 opacity-0 transition group-hover/bar:opacity-100">{item.value}</span>
                                        <div
                                            className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-400 shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-500"
                                            style={{ height: `${(item.value / maxWeekly) * 160}px` }}
                                        />
                                        <span className="text-[11px] font-semibold text-slate-500">{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Monthly Booking Trend</h3>
                                        <p className="text-xs text-slate-500">Jan – Apr 2026</p>
                                    </div>
                                </div>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Q1 + Apr
                                </span>
                            </div>
                            <div className="mt-6 flex h-52 items-end gap-4">
                                {monthlyBars.map((item) => (
                                    <div key={item.month} className="group/bar flex flex-1 flex-col items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-600 opacity-0 transition group-hover/bar:opacity-100">{item.value}</span>
                                        <div
                                            className="w-full rounded-t-xl bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-900/20 transition hover:from-emerald-700 hover:to-teal-500"
                                            style={{ height: `${(item.value / maxMonthly) * 160}px` }}
                                        />
                                        <span className="text-[11px] font-semibold text-slate-500">{item.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Top Resources + By Type + Booking Status */}
                    <section className="mt-6 grid gap-5 xl:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                                    <Trophy className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Top Resources</h3>
                                    <p className="text-xs text-slate-500">By booking count</p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-3 text-sm">
                                {topResources.map((item, index) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <div className={`grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br ${RANK_STYLES[index]} text-xs font-bold text-white shadow-md`}>
                                            {index + 1}
                                        </div>
                                        <span className="flex-1 truncate font-medium text-slate-700">{item.label}</span>
                                        <div className="h-2.5 w-1/3 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm transition-all duration-700"
                                                style={{ width: `${Math.min(item.value, 50) * 2}%` }}
                                            />
                                        </div>
                                        <span className="w-8 text-right text-base font-bold text-slate-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                                    <PieChartIcon className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">By Resource Type</h3>
                                    <p className="text-xs text-slate-500">Distribution share</p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-4 text-sm">
                                {resourcesByType.map((item) => {
                                    const gradient = TYPE_GRADIENTS[item.color] || 'from-slate-500 to-slate-600'
                                    return (
                                        <div key={item.label} className="flex items-center gap-3">
                                            <span className={`h-3 w-3 flex-shrink-0 rounded-md bg-gradient-to-r ${gradient} ring-2 ring-white shadow-sm`} />
                                            <span className="flex-1 font-medium text-slate-700">{item.label}</span>
                                            <div className="h-2.5 w-1/3 overflow-hidden rounded-full bg-slate-100">
                                                <div className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-sm transition-all duration-700`} style={{ width: item.value }} />
                                            </div>
                                            <span className="w-12 rounded-full bg-slate-100 px-2 py-0.5 text-center text-xs font-bold text-slate-700">
                                                {item.value}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2.5">
                                <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
                                    <PercentSquare className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">Booking Status Split</h3>
                                    <p className="text-xs text-slate-500">Across all bookings</p>
                                </div>
                            </div>
                            <div className="mt-5 space-y-5 text-sm">
                                {bookingSplit.map((item) => {
                                    const gradient = SPLIT_GRADIENTS[item.color] || 'from-slate-500 to-slate-600'
                                    return (
                                        <div key={item.label}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="flex items-center gap-2 font-medium text-slate-700">
                                                    <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient}`} />
                                                    {item.label}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                                                    {item.value}
                                                </span>
                                            </div>
                                            <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                                                <div className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-sm transition-all duration-700 ${item.width}`} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default AdminAnalyticsPage
