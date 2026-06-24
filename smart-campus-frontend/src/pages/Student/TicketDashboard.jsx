import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Plus,
    Ticket as TicketIcon,
    Bell,
    LogOut,
    ArrowLeft,
    ClipboardList,
    Clock,
    Wrench,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    ChevronRight,
    GraduationCap,
    ArrowUpRight,
    Inbox,
} from 'lucide-react'
import { clearToken, getMe } from '../../services/auth'
import { getMyTickets, getMyTicketStats, STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor } from '../../services/ticket'

function Sidebar({ user, navigate, active }) {
    const logout = () => { clearToken(); navigate('/auth') }
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/tickets' },
        { id: 'create', label: 'Create Ticket', icon: Plus, to: '/tickets/create' },
        { id: 'my', label: 'My Tickets', icon: TicketIcon, to: '/tickets/my' },
    ]
    return (
        <aside className="relative flex flex-col bg-gradient-to-b from-[#0b1a3a] via-[#0c1f44] to-[#0a1730] text-slate-200">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.18),transparent_60%)]" />

            <div className="relative border-b border-white/10 px-5 py-6">
                <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-900/40">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-lg font-bold tracking-tight text-white">Smart Campus</p>
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/80">Incident Ticketing</p>
                    </div>
                </div>
            </div>

            <div className="relative px-3 py-5">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Navigation</p>
                <div className="mt-2 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = active === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigate(item.to)}
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

                <p className="mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Updates</p>
                <div className="mt-2">
                    <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                        <Bell className="h-4 w-4" />
                        <span className="flex-1">Notifications</span>
                    </button>
                </div>
            </div>

            <div className="relative mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                {user && (
                    <div className="mb-1 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-bold text-white">
                            {user.username?.charAt(0)?.toUpperCase() ?? 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-white">{user.username}</p>
                            <p className="text-[10px] text-slate-400">Student</p>
                        </div>
                    </div>
                )}
                <button onClick={() => navigate('/dashboard/student')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600/40 bg-slate-700/30 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700/50">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </button>
                <button onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:border-rose-400/50 hover:bg-rose-500/20">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </aside>
    )
}

const STAT_META = {
    total: {
        label: 'Total Tickets',
        icon: ClipboardList,
        iconBg: 'bg-blue-50',
        iconText: 'text-blue-600',
        ring: 'ring-blue-100',
        bar: 'from-blue-500 to-indigo-500',
    },
    open: {
        label: 'Open',
        icon: Clock,
        iconBg: 'bg-amber-50',
        iconText: 'text-amber-600',
        ring: 'ring-amber-100',
        bar: 'from-amber-500 to-orange-500',
    },
    inProgress: {
        label: 'In Progress',
        icon: Wrench,
        iconBg: 'bg-violet-50',
        iconText: 'text-violet-600',
        ring: 'ring-violet-100',
        bar: 'from-violet-500 to-fuchsia-500',
    },
    resolved: {
        label: 'Resolved',
        icon: CheckCircle2,
        iconBg: 'bg-emerald-50',
        iconText: 'text-emerald-600',
        ring: 'ring-emerald-100',
        bar: 'from-emerald-500 to-teal-500',
    },
    urgent: {
        label: 'Urgent',
        icon: AlertTriangle,
        iconBg: 'bg-rose-50',
        iconText: 'text-rose-600',
        ring: 'ring-rose-100',
        bar: 'from-rose-500 to-pink-500',
    },
}

export default function TicketDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0 })
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        Promise.all([getMe(), getMyTicketStats(), getMyTickets()])
            .then(([me, s, t]) => { setUser(me); setStats(s); setTickets(t) })
            .catch(() => setError('Failed to load data'))
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                <Sidebar user={user} navigate={navigate} active="dashboard" />

                <main className="p-4 sm:p-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                                <Sparkles className="h-3 w-3" />
                                Module C
                            </div>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Incident Ticketing</h1>
                            <p className="mt-1 text-sm text-slate-500">Overview of campus maintenance and incident tickets.</p>
                        </div>
                        <button
                            id="create-ticket-btn"
                            onClick={() => navigate('/tickets/create')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Ticket
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Stats */}
                    <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                        {Object.keys(STAT_META).map((key) => {
                            const meta = STAT_META[key]
                            const Icon = meta.icon
                            const value = stats[key] ?? 0
                            return (
                                <article
                                    key={key}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${meta.bar} opacity-[0.08] blur-2xl transition group-hover:opacity-[0.2]`} />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">{meta.label}</p>
                                            <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">{loading ? '–' : value}</p>
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

                    {/* Quick links */}
                    <section className="mb-6 grid gap-4 sm:grid-cols-3">
                        <QuickLink
                            onClick={() => navigate('/tickets/create')}
                            icon={Plus}
                            iconBg="from-blue-500 to-indigo-500"
                            title="Create New Ticket"
                            desc="Report a campus issue with location and priority."
                        />
                        <QuickLink
                            onClick={() => navigate('/tickets/my')}
                            icon={TicketIcon}
                            iconBg="from-emerald-500 to-teal-500"
                            title="My Tickets"
                            desc="View submitted tickets and their current status."
                        />
                        <QuickLink
                            onClick={() => navigate('/dashboard/student')}
                            icon={LayoutDashboard}
                            iconBg="from-violet-500 to-fuchsia-500"
                            title="Student Dashboard"
                            desc="Go back to the main student portal."
                        />
                    </section>

                    {/* Recent Tickets */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600">
                                    <Clock className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-slate-900">Recent Tickets</h2>
                                    <p className="text-xs text-slate-500">Your latest submissions</p>
                                </div>
                            </div>
                            <button onClick={() => navigate('/tickets/my')} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
                                View all
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-sm text-slate-500">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                                <span className="ml-3">Loading tickets...</span>
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white ring-4 ring-slate-100">
                                    <Inbox className="h-6 w-6 text-slate-300" />
                                </div>
                                <p className="mt-3 text-sm font-semibold text-slate-700">No tickets yet</p>
                                <p className="mt-1 text-xs text-slate-500">Create your first incident report to get started.</p>
                                <button onClick={() => navigate('/tickets/create')} className="mt-4 inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700">
                                    <Plus className="h-3.5 w-3.5" />
                                    Create Ticket
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {tickets.slice(0, 5).map((ticket) => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition hover:border-slate-200 hover:bg-slate-50"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100">
                                                <TicketIcon className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-slate-800">{ticket.title}</p>
                                                <p className="mt-0.5 text-xs text-slate-500">{ticket.resourceLocation} · {CATEGORY_LABELS[ticket.category]}</p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${priorityColor(ticket.priority)}`}>{PRIORITY_LABELS[ticket.priority]}</span>
                                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColor(ticket.status)}`}>{STATUS_LABELS[ticket.status]}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    )
}

function QuickLink({ onClick, icon: Icon, iconBg, title, desc }) {
    return (
        <button
            onClick={onClick}
            className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
        >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${iconBg} text-white shadow-md`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                </div>
                <p className="mt-1 text-xs text-slate-500">{desc}</p>
            </div>
        </button>
    )
}
