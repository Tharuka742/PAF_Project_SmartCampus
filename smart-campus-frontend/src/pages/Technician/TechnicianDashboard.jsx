import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getMe } from '../../services/auth'
import {
    getAssignedTickets, getTechnicianTicketStats, updateTicketStatus,
    STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor
} from '../../services/ticket'

function Sidebar({ user, navigate }) {
    const logout = () => { clearToken(); navigate('/auth') }
    return (
        <aside className="flex flex-col border-r border-slate-800 bg-[#0c1f44] text-slate-200">
            <div className="border-b border-white/10 px-5 py-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Smart Campus</p>
                        <p className="text-xs text-slate-400">Incident Ticketing</p>
                    </div>
                </div>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="px-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Navigation</p>
                <button onClick={() => navigate('/technician/tickets')} className="flex w-full items-center gap-2 rounded-lg bg-blue-600/30 px-3 py-2 text-left text-sm font-semibold text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    My Assigned Tickets
                </button>
                <p className="px-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Updates</p>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    Notifications
                </button>
            </nav>
            <div className="mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                {user && <p className="text-xs text-slate-400 px-1">Signed in as <span className="text-white">{user.username}</span></p>}
                <button onClick={() => navigate('/select-role')} className="w-full rounded-lg border border-cyan-400/25 bg-cyan-500/10 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20 transition">Change Role</button>
                <button onClick={logout} className="w-full rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200">Logout</button>
            </div>
        </aside>
    )
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
        // Auto-refresh every 5 seconds to check for new assignments
        const interval = setInterval(loadData, 5000)
        return () => clearInterval(interval)
    }, [])

    const filters = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED']
    const filtered = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter)

    const statCards = [
        { label: 'Total Assigned', value: stats.total ?? 0, icon: '📋' },
        { label: 'Open', value: stats.open ?? 0, icon: '⏰' },
        { label: 'In Progress', value: stats.inProgress ?? 0, icon: '🔧' },
        { label: 'Resolved', value: stats.resolved ?? 0, icon: '✅' },
    ]

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <Sidebar user={user} navigate={navigate} />

                <main className="p-4 sm:p-8">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Technician Portal</p>
                            <h1 className="mt-1 text-3xl font-bold text-slate-900">My Assigned Tickets</h1>
                            <p className="mt-1 text-sm text-slate-500">Manage and resolve tickets assigned to you.</p>
                        </div>
                        <button
                            onClick={loadData}
                            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                        >
                            <svg className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

                    {/* Stats */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
                        {statCards.map(card => (
                            <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
                                    <span className="text-xl">{card.icon}</span>
                                </div>
                                <p className="mt-3 text-4xl font-bold text-slate-900">{loading ? '–' : card.value}</p>
                            </article>
                        ))}
                    </section>

                    {/* Filters */}
                    <div className="flex gap-2 flex-wrap mb-5">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:border-blue-400'}`}
                            >
                                {f === 'ALL' ? 'All' : STATUS_LABELS[f]}
                            </button>
                        ))}
                    </div>

                    {/* Ticket Table */}
                    {loading ? (
                        <div className="py-16 text-center text-sm text-slate-500">Loading your tickets...</div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                            <p className="text-4xl">🔧</p>
                            <p className="mt-3 text-sm font-semibold text-slate-700">No tickets assigned yet</p>
                            <p className="mt-1 text-xs text-slate-500">Tickets assigned to you by an admin will appear here.</p>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-slate-100 bg-slate-50">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Ticket</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Reporter</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map(ticket => (
                                            <tr key={ticket.id} className="hover:bg-slate-50 transition">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-900 max-w-xs truncate">{ticket.title}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">📍 {ticket.resourceLocation}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">📋 {ticket.description?.substring(0, 50)}...</p>
                                                </td>
                                                <td className="px-4 py-4 text-slate-600">{CATEGORY_LABELS[ticket.category]}</td>
                                                <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${priorityColor(ticket.priority)}`}>{PRIORITY_LABELS[ticket.priority]}</span></td>
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
                                                            className={`cursor-pointer appearance-none rounded-full px-3 py-1.5 pr-8 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${statusColor(ticket.status)}`}
                                                        >
                                                            <option value="OPEN">Open</option>
                                                            <option value="IN_PROGRESS">In Progress</option>
                                                            <option value="RESOLVED">Resolved</option>
                                                            <option value="CLOSED">Closed</option>
                                                            <option value="REJECTED">Rejected</option>
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <svg className="h-3 w-3 fill-current opacity-70" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="text-slate-600 font-medium">{ticket.reporterName}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">📞 {ticket.contactNumber}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <button
                                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                                        className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                                                    >View</button>
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
