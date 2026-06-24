import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Building2,
    CalendarCheck,
    Ticket,
    Users,
    BarChart3,
    LogOut,
    UserCog,
    Sparkles,
    ChevronRight,
    GraduationCap,
    ShieldCheck,
    Package,
    Activity,
    TrendingUp,
    MapPin,
    Trophy,
    PieChart as PieChartIcon,
    CalendarDays,
    Bell,
} from 'lucide-react'
import {
    clearToken,
    getDashboardByRole,
} from '../../services/auth'

const moduleLinks = [
    { label: 'Resources', to: '/resources', icon: Building2 },
    { label: 'Bookings', to: '/admin', icon: CalendarCheck },
    { label: 'Tickets', to: '/admin/tickets', icon: Ticket },
    { label: 'Users', to: '/dashboard/admin/users', icon: Users },
    { label: 'Analytics', to: '/dashboard/admin/analytics', icon: BarChart3 },
]

const summaryCards = [
    { label: 'Total Resources', value: '34', subtext: '+2 added this month', accent: 'border-blue-200' },
    { label: 'Active Resources', value: '28', subtext: '82% of total resources', accent: 'border-emerald-200' },
    { label: 'Total Bookings', value: '218', subtext: '+14 this week', accent: 'border-amber-200' },
    { label: 'Utilization Rate', value: '67%', subtext: '+4% vs last month', accent: 'border-violet-200' },
]

const SUMMARY_META = [
    {
        icon: Package,
        iconBg: 'bg-blue-50',
        iconText: 'text-blue-600',
        ring: 'ring-blue-100',
        bar: 'from-blue-500 to-indigo-500',
    },
    {
        icon: Activity,
        iconBg: 'bg-emerald-50',
        iconText: 'text-emerald-600',
        ring: 'ring-emerald-100',
        bar: 'from-emerald-500 to-teal-500',
    },
    {
        icon: CalendarCheck,
        iconBg: 'bg-amber-50',
        iconText: 'text-amber-600',
        ring: 'ring-amber-100',
        bar: 'from-amber-500 to-orange-500',
    },
    {
        icon: TrendingUp,
        iconBg: 'bg-violet-50',
        iconText: 'text-violet-600',
        ring: 'ring-violet-100',
        bar: 'from-violet-500 to-fuchsia-500',
    },
]

const quickStats = [
    { label: 'Lab Utilization', value: '78%', color: 'bg-blue-500', width: 'w-[78%]' },
    { label: 'Hall Utilization', value: '54%', color: 'bg-emerald-500', width: 'w-[54%]' },
    { label: 'Equipment', value: '42%', color: 'bg-amber-500', width: 'w-[42%]' },
    { label: 'Meeting Rooms', value: '91%', color: 'bg-violet-500', width: 'w-[91%]' },
]

const QUICK_STAT_GRADIENTS = [
    'from-blue-500 to-indigo-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-violet-500 to-fuchsia-500',
]

const mostUsedResources = [
    { label: 'Computer Lab B-204', value: 48 },
    { label: 'Lecture Hall A-101', value: 41 },
    { label: 'Meeting Room C-305', value: 36 },
    { label: 'Media Studio E-202', value: 27 },
    { label: 'Lab D-110', value: 19 },
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

const bookingsByLocation = [
    { label: 'Block A', value: 38 },
    { label: 'Block B', value: 29 },
    { label: 'Block C', value: 21 },
    { label: 'Block D', value: 16 },
    { label: 'Block E / F', value: 11 },
]

const RANK_STYLES = [
    'from-amber-400 to-orange-500 shadow-amber-500/30',
    'from-slate-300 to-slate-500 shadow-slate-400/30',
    'from-orange-300 to-amber-600 shadow-orange-500/30',
    'from-blue-500 to-indigo-500 shadow-blue-500/30',
    'from-violet-500 to-fuchsia-500 shadow-violet-500/30',
]

function AdminDashboard() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [dashboard, setDashboard] = useState(null)

    const logout = () => {
        clearToken()
        navigate('/auth')
    }

    const load = async () => {
        setLoading(true)
        setError('')
        try {
            const dashboardData = await getDashboardByRole('ADMIN')
            setDashboard(dashboardData)
        } catch (apiError) {
            setError(apiError?.response?.data?.message || 'Failed to load admin dashboard')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        load()
    }, [])

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
                            className="mt-2 flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-2.5 text-left text-sm font-semibold text-white shadow-lg shadow-cyan-900/30"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </button>
                    </div>

                    <div className="relative px-3 py-2">
                        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Other Modules</p>
                        <div className="mt-2 space-y-1">
                            {moduleLinks.map((item) => {
                                const Icon = item.icon
                                return (
                                    <NavLink
                                        key={item.label}
                                        to={item.to}
                                        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <Icon className="h-4 w-4 text-slate-400 transition group-hover:text-cyan-300" />
                                        <span className="flex-1">{item.label}</span>
                                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                                    </NavLink>
                                )
                            })}
                        </div>
                    </div>

                    <div className="relative mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                        <button
                            type="button"
                            onClick={() => navigate('/select-role')}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20"
                        >
                            <UserCog className="h-4 w-4" />
                            Change Role
                        </button>
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
                    {/* Top bar */}
                    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="font-medium text-slate-600">SmartCampus</span>
                                <ChevronRight className="h-3 w-3" />
                                <span>Admin Portal</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-700">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Admin Module
                            </span>
                            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                                <Bell className="h-4 w-4" />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                            </button>
                        </div>
                    </div>

                    {error ? (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <Activity className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : null}

                    {/* Welcome banner */}
                    <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-cyan-700 px-6 py-8 text-white shadow-xl shadow-blue-900/20 sm:px-8">
                        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)]" />

                        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-100 backdrop-blur">
                                    <Sparkles className="h-3 w-3" />
                                    All systems operational
                                </span>
                                <p className="mt-3 text-3xl font-bold sm:text-4xl">
                                    Good morning, Kavinda <span className="inline-block animate-pulse">👋</span>
                                </p>
                                <p className="mt-2 flex items-center gap-2 text-sm text-blue-100">
                                    <CalendarDays className="h-4 w-4" />
                                    Wednesday, 8 April 2026
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 self-start md:self-auto">
                                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100">Uptime</p>
                                    <p className="mt-0.5 text-lg font-bold">99.9%</p>
                                </div>
                                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-100">Active Now</p>
                                    <p className="mt-0.5 text-lg font-bold">124</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Summary cards */}
                    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {summaryCards.map((card, idx) => {
                            const meta = SUMMARY_META[idx]
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

                    {/* Analytics grid */}
                    <section className="mt-6 grid gap-5 xl:grid-cols-2">
                        {/* Quick Stats */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                        <Activity className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Today's Quick Stats</h3>
                                        <p className="text-xs text-slate-500">Live utilization rates</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 space-y-5">
                                {quickStats.map((item, idx) => {
                                    const gradient = QUICK_STAT_GRADIENTS[idx % QUICK_STAT_GRADIENTS.length]
                                    return (
                                        <div key={item.label}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                                    <span className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient}`} />
                                                    {item.label}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                                                    {item.value}
                                                </span>
                                            </div>
                                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-sm transition-all duration-700 ${item.width}`} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Bookings by Location */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Bookings by Location</h3>
                                        <p className="text-xs text-slate-500">Per campus block</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 space-y-4">
                                {bookingsByLocation.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3 text-sm">
                                        <span className="w-20 font-medium text-slate-700">{item.label}</span>
                                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-sm transition-all duration-700"
                                                style={{ width: `${Math.min(item.value, 40) * 2}%` }}
                                            />
                                        </div>
                                        <span className="w-10 rounded-full bg-slate-100 px-2 py-0.5 text-center text-xs font-bold text-slate-700">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Most Used Resources */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                                        <Trophy className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Most Used Resources</h3>
                                        <p className="text-xs text-slate-500">Top picks this semester</p>
                                    </div>
                                </div>
                                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                    Semester
                                </span>
                            </div>
                            <div className="mt-5 space-y-3">
                                {mostUsedResources.map((item, index) => (
                                    <div key={item.label} className="flex items-center gap-3 text-sm">
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

                        {/* Resources by Type */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <PieChartIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Resources by Type</h3>
                                        <p className="text-xs text-slate-500">Distribution across catalogue</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 space-y-4">
                                {resourcesByType.map((item) => {
                                    const gradient = TYPE_GRADIENTS[item.color] || 'from-slate-500 to-slate-600'
                                    return (
                                        <div key={item.label} className="flex items-center gap-3 text-sm">
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
                    </section>

                    {/* API status pill */}
                    <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/40 p-4 text-sm text-slate-600 shadow-sm">
                        <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-blue-600 ring-1 ring-slate-200">
                            <Sparkles className="h-3.5 w-3.5" />
                        </span>
                        <span>
                            <span className="font-semibold text-slate-700">Status:</span>{' '}
                            {loading ? 'Loading dashboard...' : dashboard?.message || 'All systems operational.'}
                        </span>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default AdminDashboard
