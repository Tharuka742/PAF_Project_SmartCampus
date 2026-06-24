import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Bell,
    LogOut,
    UserCog,
    Wrench,
    GraduationCap,
    Sparkles,
    ChevronRight,
    RefreshCw,
    ClipboardList,
    Clock,
    CheckCircle2,
    Filter,
    MapPin,
    FileText,
    Phone,
    Eye,
    Inbox,
    AlertTriangle,
    Ticket as TicketIcon,
    User,
} from 'lucide-react'
import { clearToken, getMe } from '../../services/auth'
import {
    getAssignedTickets, getTechnicianTicketStats, updateTicketStatus,
    STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor
} from '../../services/ticket'

function Sidebar({ user, navigate }) {
    const logout = () => { clearToken(); navigate('/auth') }
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
                        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cyan-300/80">Technician Portal</p>
                    </div>
                </div>
            </div>

            <div className="relative px-3 py-5">
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Navigation</p>
                <div className="mt-2 space-y-1">
                    <button
                        onClick={() => navigate('/technician/tickets')}
                        className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-2.5 text-left text-sm font-semibold text-white shadow-lg shadow-cyan-900/30"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        My Assigned Tickets
                    </button>
                </div>

                <p className="mt-5 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Updates</p>
                <div className="mt-2">
                    <button className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white">
                        <Bell className="h-4 w-4" />
                        <span className="flex-1">Notifications</span>
                        <ChevronRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                    </button>
                </div>
            </div>

            <div className="relative mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                {user && (
                    <div className="mb-1 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-xs font-bold text-white">
                            {user.username?.charAt(0)?.toUpperCase() ?? 'T'}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-white">{user.username}</p>
                            <p className="text-[10px] text-slate-400">Technician</p>
                        </div>
                    </div>
                )}
                <button onClick={() => navigate('/select-role')} className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/20">
                    <UserCog className="h-4 w-4" />
                    Change Role
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
        label: 'Total Assigned',
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
}

export default function TechnicianDashboard() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 })
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('ALL')

    const loadData = () => {
        setLoading(true)
        setError('')
        Promise.all([getMe(), getTechnicianTicketStats(), getAssignedTickets()])
            .then(([me, s, t]) => { setUser(me); setStats(s); setTickets(t) })
            .catch(() => setError('Failed to load assigned tickets'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadData()
        const interval = setInterval(loadData, 5000)
        return () => clearInterval(interval)
    }, [])

    const filters = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED']
    const filtered = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter)

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                <Sidebar user={user} navigate={navigate} />

                <main className="p-4 sm:p-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-700">
                                <Sparkles className="h-3 w-3" />
                                Technician Portal
                            </div>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My Assigned Tickets</h1>
                            <p className="mt-1 text-sm text-slate-500">Manage and resolve tickets assigned to you.</p>
                        </div>
                        <button
                            onClick={loadData}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Stats */}
                    <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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

                    {/* Filters */}
                    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-500">
                                <Filter className="h-3.5 w-3.5" />
                                Filter
                            </div>
                            {filters.map((f) => {
                                const count = f === 'ALL' ? tickets.length : tickets.filter((t) => t.status === f).length
                                const isActive = filter === f
                                return (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                                            isActive
                                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {f === 'ALL' ? 'All' : STATUS_LABELS[f]}
                                        <span
                                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                                                isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Tickets table */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border-4 border-violet-100" />
                                    <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Loading your tickets...</p>
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 ring-4 ring-violet-50">
                                <Wrench className="h-8 w-8 text-violet-400" />
                            </div>
                            <p className="mt-4 text-lg font-bold text-slate-800">No tickets assigned yet</p>
                            <p className="mt-1 text-sm text-slate-500">Tickets assigned to you by an admin will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50/30">
                                        <tr>
                                            <th className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Ticket</th>
                                            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Category</th>
                                            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Priority</th>
                                            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Status</th>
                                            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Reporter</th>
                                            <th className="px-4 py-3.5 text-left text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map((ticket) => (
                                            <tr key={ticket.id} className="transition hover:bg-slate-50/70">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-50 to-fuchsia-50 text-violet-600 ring-1 ring-violet-100">
                                                            <TicketIcon className="h-5 w-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="max-w-xs truncate text-sm font-bold text-slate-900">{ticket.title}</p>
                                                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                                <MapPin className="h-3 w-3 text-slate-400" />
                                                                {ticket.resourceLocation}
                                                            </p>
                                                            <p className="mt-0.5 flex items-start gap-1 text-xs text-slate-500">
                                                                <FileText className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-400" />
                                                                <span className="max-w-xs truncate">{ticket.description?.substring(0, 50)}...</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-xs font-medium text-slate-600">{CATEGORY_LABELS[ticket.category]}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${priorityColor(ticket.priority)}`}>
                                                        {PRIORITY_LABELS[ticket.priority]}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="relative inline-block">
                                                        <select
                                                            value={ticket.status}
                                                            onChange={async (e) => {
                                                                try {
                                                                    const updated = await updateTicketStatus(ticket.id, e.target.value);
                                                                    setTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));
                                                                    getTechnicianTicketStats().then(setStats);
                                                                } catch (err) {
                                                                    setError('Failed to update status');
                                                                }
                                                            }}
                                                            className={`cursor-pointer appearance-none rounded-full border-0 px-3 py-1.5 pr-8 text-[10px] font-bold uppercase tracking-wider outline-none transition focus:ring-2 focus:ring-blue-500/30 ${statusColor(ticket.status)}`}
                                                        >
                                                            <option value="OPEN">Open</option>
                                                            <option value="IN_PROGRESS">In Progress</option>
                                                            <option value="RESOLVED">Resolved</option>
                                                            <option value="CLOSED">Closed</option>
                                                            <option value="REJECTED">Rejected</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <svg className="h-3 w-3 fill-current opacity-70" viewBox="0 0 20 20">
                                                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-start gap-2">
                                                        <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-xs font-bold text-white">
                                                            {ticket.reporterName?.charAt(0)?.toUpperCase() ?? <User className="h-3.5 w-3.5" />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-semibold text-slate-700">{ticket.reporterName}</p>
                                                            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-500">
                                                                <Phone className="h-2.5 w-2.5" />
                                                                {ticket.contactNumber}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                                        className="inline-flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                                                    >
                                                        <Eye className="h-3.5 w-3.5" />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
