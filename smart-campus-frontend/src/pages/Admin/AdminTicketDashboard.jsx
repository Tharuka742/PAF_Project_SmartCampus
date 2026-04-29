import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getMe } from '../../services/auth'
import {
    getAllTickets, getAllTicketStats, getTechnicians, assignTechnician,
    STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor
} from '../../services/ticket'

function Sidebar({ navigate }) {
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
                <button onClick={() => navigate('/tickets')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    Dashboard
                </button>
                <button onClick={() => navigate('/tickets/create')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Ticket
                </button>
                <button onClick={() => navigate('/tickets/my')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    My Tickets
                </button>
                <p className="px-2 pt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">Management</p>
                <button onClick={() => navigate('/admin/tickets')} className="flex w-full items-center gap-2 rounded-lg bg-blue-600/30 px-3 py-2 text-left text-sm font-semibold text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    All Tickets
                </button>
            </nav>
            <div className="mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                <button onClick={() => navigate('/dashboard/admin')} className="w-full rounded-lg border border-slate-600/50 bg-slate-700/30 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 transition">← Admin Dashboard</button>
                <button onClick={logout} className="w-full rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200">Logout</button>
            </div>
        </aside>
    )
}

export default function AdminTicketDashboard() {
    const navigate = useNavigate()
    const [, setUser] = useState(null)
    const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0, rejected: 0 })
    const [tickets, setTickets] = useState([])
    const [technicians, setTechnicians] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filter, setFilter] = useState('ALL')
    const [assigningId, setAssigningId] = useState(null)
    const [selectedTech, setSelectedTech] = useState('')
    const [assignError, setAssignError] = useState('')

    useEffect(() => {
        Promise.all([getMe(), getAllTicketStats(), getAllTickets(), getTechnicians()])
            .then(([me, s, t, tech]) => { setUser(me); setStats(s); setTickets(t); setTechnicians(tech) })
            .catch(() => setError('Failed to load tickets'))
            .finally(() => setLoading(false))
    }, [])

    const filters = ['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']
    const filtered = filter === 'ALL' ? tickets : tickets.filter(t => t.status === filter)

    const handleQuickAssign = async (ticketId) => {
        if (!selectedTech) { setAssignError('Select a technician'); return }
        try {
            const updated = await assignTechnician(ticketId, selectedTech)
            setTickets(prev => prev.map(t => t.id === ticketId ? updated : t))
            setAssigningId(null)
            setSelectedTech('')
            setAssignError('')
        } catch (err) {
            setAssignError(err?.response?.data?.message || 'Assignment failed')
        }
    }

    const statCards = [
        { label: 'Total Tickets', value: stats.total ?? 0, icon: '📋', border: '' },
        { label: 'Open', value: stats.open ?? 0, icon: '⏰', border: '' },
        { label: 'In Progress', value: stats.inProgress ?? 0, icon: '🔧', border: '' },
        { label: 'Resolved', value: stats.resolved ?? 0, icon: '✅', border: '' },
        { label: 'Urgent', value: stats.open ?? 0, icon: '⚠️', border: 'border-l-4 border-l-rose-400' },
    ]

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <Sidebar navigate={navigate} />
                <main className="p-4 sm:p-8">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Admin Panel</p>
                            <h1 className="mt-1 text-3xl font-bold text-slate-900">Admin Ticket Dashboard</h1>
                            <p className="mt-1 text-sm text-slate-500">Admin can monitor all incident tickets and staff workflow.</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            Admin View
                        </div>
                    </div>

                    {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

                    {/* Stats */}
                    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-6">
                        {statCards.map(card => (
                            <article key={card.label} className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${card.border}`}>
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

                    {/* Tickets Table */}
                    {loading ? (
                        <div className="py-16 text-center text-sm text-slate-500">Loading tickets...</div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                            <p className="text-4xl">📭</p>
                            <p className="mt-3 text-sm text-slate-500">No tickets found for this filter.</p>
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
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filtered.map(ticket => (
                                            <tr key={ticket.id} className="hover:bg-slate-50 transition">
                                                <td className="px-5 py-4">
                                                    <p className="font-semibold text-slate-900 max-w-xs truncate">{ticket.title}</p>
                                                    <p className="text-xs text-slate-400 mt-0.5">{ticket.resourceLocation}</p>
                                                    <p className="text-xs text-slate-400">by {ticket.reporterName}</p>
                                                </td>
                                                <td className="px-4 py-4 text-slate-600">{CATEGORY_LABELS[ticket.category]}</td>
                                                <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${priorityColor(ticket.priority)}`}>{PRIORITY_LABELS[ticket.priority]}</span></td>
                                                <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${statusColor(ticket.status)}`}>{STATUS_LABELS[ticket.status]}</span></td>
                                                <td className="px-4 py-4">
                                                    {ticket.assignedTechnicianName
                                                        ? <span className="text-blue-700 font-medium">{ticket.assignedTechnicianName}</span>
                                                        : <span className="text-slate-400">Unassigned</span>}
                                                    {assigningId === ticket.id && (
                                                        <div className="mt-2 flex flex-col gap-1">
                                                            <select value={selectedTech} onChange={e => setSelectedTech(e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none">
                                                                <option value="">Select…</option>
                                                                {technicians.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
                                                            </select>
                                                            {assignError && <p className="text-xs text-rose-600">{assignError}</p>}
                                                            <div className="flex gap-1">
                                                                <button onClick={() => handleQuickAssign(ticket.id)} className="rounded bg-blue-600 px-2 py-1 text-xs text-white">Assign</button>
                                                                <button onClick={() => setAssigningId(null)} className="rounded border border-slate-300 px-2 py-1 text-xs">Cancel</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                                                            className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                                                        >View</button>
                                                        <button
                                                            onClick={() => { setAssigningId(ticket.id); setSelectedTech(''); setAssignError('') }}
                                                            className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                                                        >Assign</button>
                                                    </div>
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
