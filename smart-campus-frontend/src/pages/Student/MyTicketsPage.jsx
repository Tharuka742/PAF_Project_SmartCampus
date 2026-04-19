import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getMe } from '../../services/auth'
import { getMyTickets, deleteMyTicket, STATUS_LABELS, CATEGORY_LABELS, PRIORITY_LABELS, statusColor, priorityColor } from '../../services/ticket'

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
                <button onClick={() => navigate('/tickets')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
                    Dashboard
                </button>
                <button onClick={() => navigate('/tickets/create')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Create Ticket
                </button>
                <button onClick={() => navigate('/tickets/my')} className="flex w-full items-center gap-2 rounded-lg bg-blue-600/30 px-3 py-2 text-left text-sm font-semibold text-white">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    My Tickets
                </button>
            </nav>
            <div className="mt-auto border-t border-white/10 px-4 py-4 space-y-2">
                {user && <p className="text-xs text-slate-400 px-1">Signed in as <span className="text-white">{user.username}</span></p>}
                <button onClick={() => navigate('/dashboard/student')} className="w-full rounded-lg border border-slate-600/50 bg-slate-700/30 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 transition">← Back to Dashboard</button>
                <button onClick={logout} className="w-full rounded-lg border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200">Logout</button>
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
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <div className="grid min-h-screen lg:grid-cols-[250px_1fr]">
                <Sidebar user={user} navigate={navigate} />

                <main className="p-4 sm:p-8">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Module C</p>
                            <h1 className="mt-1 text-3xl font-bold text-slate-900">My Tickets</h1>
                            <p className="mt-1 text-sm text-slate-500">All incident tickets you have submitted.</p>
                        </div>
                        <button
                            onClick={() => navigate('/tickets/create')}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition"
                        >+ New Ticket</button>
                    </div>

                    {error && <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

                    {/* Filter tabs */}
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

                    {loading ? (
                        <div className="py-16 text-center text-sm text-slate-500">Loading tickets...</div>
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
                            <p className="text-4xl">📭</p>
                            <p className="mt-3 text-sm font-semibold text-slate-700">No tickets found</p>
                            <p className="mt-1 text-xs text-slate-500">{filter === 'ALL' ? 'You have not submitted any tickets yet.' : `No ${STATUS_LABELS[filter]} tickets.`}</p>
                            {filter === 'ALL' && (
                                <button onClick={() => navigate('/tickets/create')} className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 transition">+ Create Ticket</button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map(ticket => (
                                <div
                                    key={ticket.id}
                                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-blue-300 hover:shadow-md transition cursor-pointer"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${priorityColor(ticket.priority)}`}>{PRIORITY_LABELS[ticket.priority]}</span>
                                            <span className="text-xs text-slate-400">{CATEGORY_LABELS[ticket.category]}</span>
                                        </div>
                                        <p className="mt-1 text-sm font-bold text-slate-900 truncate">{ticket.title}</p>
                                        <p className="mt-0.5 text-xs text-slate-500">{ticket.resourceLocation}</p>
                                        {ticket.assignedTechnicianName && (
                                            <p className="mt-1 text-xs text-blue-600 font-medium">👤 Assigned to: {ticket.assignedTechnicianName}</p>
                                        )}
                                    </div>
                                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                                        <div className="flex gap-2 items-center justify-end">
                                            {ticket.status === 'OPEN' && !ticket.assignedTechnicianId && (
                                                <div className="flex gap-2 mr-2 border-r border-slate-200 pr-4">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}/edit`); }}
                                                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={(e) => handleDelete(e, ticket.id)}
                                                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 px-3 py-1.5 rounded-lg transition"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColor(ticket.status)}`}>{STATUS_LABELS[ticket.status]}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleDateString()}</span>
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
