import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Plus,
    Ticket as TicketIcon,
    LogOut,
    ArrowLeft,
    Sparkles,
    ChevronRight,
    GraduationCap,
    Inbox,
    MapPin,
    UserCheck,
    Filter,
    Pencil,
    Trash2,
    AlertTriangle,
} from 'lucide-react'
import { clearToken, getMe } from '../../services/auth'
import { getMyTickets, deleteMyTicket, STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor } from '../../services/ticket'

function Sidebar({ user, navigate }) {
    const logout = () => { clearToken(); navigate('/auth') }
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/tickets' },
        { id: 'create', label: 'Create Ticket', icon: Plus, to: '/tickets/create' },
        { id: 'my', label: 'My Tickets', icon: TicketIcon, to: '/tickets/my' },
    ]
    const active = 'my'
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

export default function MyTicketsPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        Promise.all([getMe(), getMyTickets()])
            .then(([me, t]) => { setUser(me); setTickets(t) })
            .catch(() => setError('Failed to load tickets'))
            .finally(() => setLoading(false))
    }, [])

    const filters = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']
    const filtered = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter)

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if (!window.confirm('Are you sure you want to delete this ticket?')) return
        try {
            await deleteMyTicket(id)
            setTickets(prev => prev.filter(t => t.id !== id))
        } catch (err) {
            alert('Failed to delete ticket.')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                <Sidebar user={user} navigate={navigate} />

                <main className="p-4 sm:p-8">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700">
                                <Sparkles className="h-3 w-3" />
                                Module C
                            </div>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">My Tickets</h1>
                            <p className="mt-1 text-sm text-slate-500">All incident tickets you have submitted.</p>
                        </div>
                        <button
                            onClick={() => navigate('/tickets/create')}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700"
                        >
                            <Plus className="h-4 w-4" />
                            New Ticket
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Filter tabs */}
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
                                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
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

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border-4 border-blue-100" />
                                    <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                                </div>
                                <p className="text-sm font-medium text-slate-500">Loading tickets...</p>
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-50">
                                <Inbox className="h-8 w-8 text-blue-400" />
                            </div>
                            <p className="mt-4 text-lg font-bold text-slate-800">No tickets found</p>
                            <p className="mt-1 text-sm text-slate-500">{filter === 'ALL' ? 'You have not submitted any tickets yet.' : `No ${STATUS_LABELS[filter]} tickets.`}</p>
                            {filter === 'ALL' && (
                                <button onClick={() => navigate('/tickets/create')} className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-900/20 transition hover:from-blue-700 hover:to-indigo-700">
                                    <Plus className="h-4 w-4" />
                                    Create Ticket
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                                >
                                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-[0.05] blur-2xl transition group-hover:opacity-[0.12]" />

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100">
                                                <TicketIcon className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityColor(ticket.priority)}`}>{PRIORITY_LABELS[ticket.priority]}</span>
                                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{CATEGORY_LABELS[ticket.category]}</span>
                                                </div>
                                                <p className="mt-1.5 truncate text-sm font-bold text-slate-900">{ticket.title}</p>
                                                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-slate-400" />
                                                        {ticket.resourceLocation}
                                                    </span>
                                                    {ticket.assignedTechnicianName && (
                                                        <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                                                            <UserCheck className="h-3 w-3" />
                                                            {ticket.assignedTechnicianName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                            <div className="flex items-center gap-2">
                                                {ticket.status === 'OPEN' && !ticket.assignedTechnicianId && (
                                                    <div className="flex gap-1.5 border-r border-slate-200 pr-3 mr-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}/edit`); }}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(e, ticket.id)}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusColor(ticket.status)}`}>{STATUS_LABELS[ticket.status]}</span>
                                            </div>
                                            <span className="text-[10px] font-medium text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
